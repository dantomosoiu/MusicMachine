function SuggestionsClass() {

    suggestionColumnArray = [{ columnId: 'SongName', columnTitle: 'Song' },
    { columnId: 'Artists', columnTitle: 'Artist' },
    { columnId: 'Album', columnTitle: 'Album' },
    { columnId: 'Year', columnTitle: 'Year' },
    { columnId: 'Genres', columnTitle: 'Genres' },
    { columnId: 'action', columnTitle: 'Action'}];

    this.__load = function () {
        Panels.add(panelSuggestions);
        Panels.extend('suggestions');
    }

    this.index = function () {       
        if (MusicPlayer.getSongObj() != null) {
            this.changeContent(MusicPlayer.getSongObj());
        }
    }

    this.addToQueue = function (pos) {
        rightQueue.add(suggestedSongs[pos]);
    }

    this.addToPlaylist = function (pos) {
        playlists.addSongToPlaylist(suggestedSongs[pos]);
    }

    /*
     Afiseaza atat rezultatele pe panoul compactat cat si pe panoul extins. Este necesara introducerea informatiilor
     prin intermediul id-urilor container-elor, deoarece exista 3 apeluri post asincrone si rezultatele nu pot fi
     construite simultan. Parametri:
     - response: array de SongInfo primit ca rezultat al apelului post
     - compactedDivId: id-ul div-ului container compactat (cu # in fata, e.g. #album_suggestions_compacted)
     - extendedDivId: id-ul div-ului container extins (cu # in fata)
     - gridviewId: id-ul gridview-ului
     - gridviewContainerId: id-ului div-ului container al gridview-ului (fara # in fata)
     - headerText: text ce va fi afisat inainte de un gridview (e.g. 'Songs by the same artist:')
     */

     /*
     Bug:
     Ultimile 2 gridview-uri nu au linkurile bune catre queue/playlist
     Pozitiile melodiilor din link sunt decalate cu nr de pozitii ale gridview-urilor anterioare
     Toate gridview-urile incep numerotarea pozitiilor de la 0, dar ar trebui sa se tina cont defapt de gridview-urile de dinainte
     Problema e ca e greu ca dracu`, pt ca cele 3 array-uri rezultate nu sunt sincrone si nu stiu cand sa ma uit sa calculez pozitiile...
     */
    this.displayResults = function (response, compactedDivId, extendedDivId, gridviewId,
            gridviewContainerId, headerText) {
        extHtml = '<h4>' + headerText + '</h4>';
        compHtml = '<ul class="oneline"> <li><b> ' + headerText + ' </b></li>';

        if (response.length > 0) {
            suggestionDataArray = [];

            extHtml += ' <div id="' + gridviewContainerId + '"> album </div>';
            $(extendedDivId).html(extHtml);

            suggestionDataArray = [];

            for (i = 0; i < response.length; ++i) {
                suggestedSongs.push(response[i]);

                listElementHtml = '<li> <a href="javascript:void(0)" onclick="suggestions.addToQueue(' + pos + ')" >' + suggestedSongs[pos].Artists + ' - ' + suggestedSongs[pos].SongName + '</a></li>';
                compHtml += listElementHtml;

                suggestionDataArray[i] = {
                    SongName: suggestedSongs[pos].SongName,
                    Artists: suggestedSongs[pos].Artists,
                    Album: suggestedSongs[pos].Album,
                    Year: suggestedSongs[pos].Year,
                    Genres: suggestedSongs[pos].Genres,
                    action: { content: '<div class="inlinePlaylistDiv"> <img src="images/to_queue_gridview_song.png" title="add song to queue" onmouseover="this.src=\'images/to_queue_gridview_song_hover.png\'" onmouseout="this.src=\'images/to_queue_gridview_song.png\'" onClick="suggestions.addToQueue(' + i + ');" /><img src="images/add_playlist.png" title="add song to playlist" onmouseover="this.src=\'images/add_playlist_hover.png\'" onmouseout="this.src=\'images/add_playlist.png\'" onClick="suggestions.addToPlaylist(' + i + ');" />', type: 'html' }
                }
                ++pos;
            }
            suggestionAlbumGridview = new Gridview(suggestionColumnArray, suggestionDataArray, gridviewId);
            $('#' + gridviewContainerId).html(suggestionAlbumGridview.getGridviewHtml());
            suggestionAlbumGridview.activate();
        } else {
            $(extendedDivId).html(extHtml + 'No results to display.');
            compHtml += '<li> No results to display. </li>';
        }

        compHtml += '</ul>';
        $(compactedDivId).html(compHtml);
        Panels.fixCompactedLinks('suggestions');
    }

    this.changeContent = function (song) {
        songId = song.SongId;
        suggestedSongs = [];
        pos = 0;

        compHtml = '<div id="suggestions_content_extended" class="scroll_vertical"> ';
        compHtml += '<div id="album_suggestions_compacted"> </div>';
        compHtml += '<div id="artist_suggestions_compacted"> </div>';
        compHtml += '<div id="songs_suggestions_compacted"> </div>';
        compHtml += ' </div>';
        extHtml = '<div id="suggestions_content_extended" class="scroll_vertical">';
        extHtml += '<div id="album_suggestions_extended"> </div>';
        extHtml += '<div id="artist_suggestions_extended"> </div>';
        extHtml += '<div id="songs_suggestions_extended"> </div>';
        extHtml += ' </div>';
        panelSuggestions.setCompactedHtml(compHtml);
        panelSuggestions.setExtendedHtml(extHtml);

        suggestRequest = {
            results: 3,
            user_id: Mm.session.userId,
            song_id: songId
        }
        Mm.showLoading();
        $.post("AlbumSuggest.ashx", suggestRequest, function (response) {
            if (Mm.checkAppState(response)) {
                suggestions.displayResults(response, "#album_suggestions_compacted", "#album_suggestions_extended",
                    "suggestion_gridview_album", "suggestion_gridview_album_container", "Songs from the same album:");
                Mm.hideLoading();
            }
        }, "json");

        suggestRequest = {
            results: 5,
            user_id: Mm.session.userId,
            song_id: songId
        }
        Mm.showLoading();
        $.post("ArtistSuggest.ashx", suggestRequest, function (response) {
            if (Mm.checkAppState(response)) {
                suggestions.displayResults(response, "#artist_suggestions_compacted", "#artist_suggestions_extended",
                    "suggestion_gridview_artist", "suggestion_gridview_artist_container", "Songs by the same artist:");
                Mm.hideLoading();
            }
        }, "json");

        suggestRequest = {
            results: 15,
            user_id: Mm.session.userId,
            songName: "",
            artists: "",
            album: "",
            year: "",
            genres: song.Genres
        }
        Mm.showLoading();
        $.post("SearchSongs.ashx", suggestRequest, function (response) {
            if (Mm.checkAppState(response)) {
                for (i = 0; i < response.length; ++i)
                    if (response[i].SongId == songId)
                        response.splice(i, 1);
                suggestions.displayResults(response, "#songs_suggestions_compacted", "#songs_suggestions_extended",
                    "suggestion_gridview_songs", "suggestion_gridview_songs_container", "Similar songs:");
                Mm.hideLoading();
            }
        }, "json");
    }
};

var suggestions = null;
var panelSuggestions = new Panel('Suggestions', 'suggestions');
panelSuggestions.setExtendedHtml('<div id="suggestions_content_extended" class="scroll_vertical"> No song playing </div>');


panelSuggestions.setCompactedHtml('<div id="suggestions_content_compacted" class="scroll_vertical"> No song playing </div>');