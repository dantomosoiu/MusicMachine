function PlaylistsClass() {

    this.__load = function () {
        Panels.extend('playlists');
    }

    this.index = function () {

    }


    playlistColumnArray = [{ columnId: 'position', columnTitle: '#' }, { columnId: 'SongName', columnTitle: 'Song' }, { columnId: 'Artists', columnTitle: 'Artist' }, { columnId: 'action', columnTitle: 'Action' }, { columnId: 'Album', columnTitle: 'Album' }, { columnId: 'Year', columnTitle: 'Year' }, { columnId: 'Genres', columnTitle: 'Genres'}];
    playlistDataArray = [];
    playlistSongs = [];
    PlayId = "";
    currentPlaylistId = "";
    currentPlaylistName = "";

    orderCounter = -1;
    sentSongs = [];
    playlistSize = 0;
    randomTrials = 0;
    favouriteId = '';
    firstTime = 1;

    this.initialiseSender = function () {
        orderCounter = -1;
        sentSongs = [];
        playlistSize = playlistSongs.length;
        randomTrials = 0;
    }

    this.getSongFromPlaylist = function (type) { //poate fi 'ordered' sau 'random'

        if (playlistSize > 0) {

            if (type == 'ordered') {
                orderCounter++;
                if (orderCounter > playlistSize) {
                    if (repeatState == 0) {
                        return null;
                    }
                    else {
                        orderCounter = -1;
                        sentsSongs = [];
                        return playlistSongs[playlistSize];
                    }
                }
                else {
                    sentSongs.push(playlistSongs[orderCounter]);
                    return playlistSongs[orderCounter];
                }
            }
            else { //type = random
                while (randomTrials < playlistSize + playlistSize / 2) {
                    randomTry = Math.floor(Math.random() * playlistSize);
                    if ($.inArray(playlistSongs[randomTry], sentSongs) == -1) {
                        sentSongs.push(playlistSongs[randomTry]);
                        return playlistSongs[randomTry];
                    }
                    randomTrials++;
                }
                playlists.initialiseSender();
                return playlists.getSongFromPlaylist('random');
            }

        }
        else {
            return null;
        }

    }

    this.markSelectedPlaylist = function (PlayId) {
        if (PlayId != undefined) {
            $("#playlist_lister #playlist_vertical_column > *").removeClass("selected");
            $("#playlist_lister #playlist_vertical_column #playlist" + PlayId + "").addClass("selected");
        }
        else {

        }
    }


    this.changeContent = function (PlayId) {  //actualizeaza lista playlisturilor (cu interogare din bd)

        userInfo = {
            UserId: Mm.session.userId,
            FirstName: Mm.session.firstName,
            LastName: Mm.session.lastName
        };


        Mm.showLoading();
        $.post("PlaylistPanel.ashx", userInfo, function (response) {
            if (Mm.checkAppState(response) == true) {
                var text_html = '<ul class="list_playlists" id="playlist_vertical_column">';
                text_html += '<li><a id="NewButtonAnchor" href="javascript:void(0)";"><img src="images/plus-circle.png" alt=""> New Playlist</a></li>';
                for (i = 0; i < response.length; i++) {
                    if (i == 0) {
                        playlists.favouriteId = response[i].PlaylistId;
                    }
                    text_html += ' <li><a id="playlist' + response[i].PlaylistId + '" href="#/playlists/showSongs/' + response[i].PlaylistId + '" >' + response[i].PlaylistName + '</a></li>';
                }
                text_html += "</ul>";

                $('#panel-extended-playlists .column-menu').html(text_html);
                Mm.hideLoading();
                playlists.updateCompacted();

                $("#NewButtonAnchor").bind('click', function () {
                    playlists.newPlaylist();
                });

                if (playlists.firstTime != 0) {
                    playlists.firstTime = 0;
                    playlists.showSongs(playlists.favouriteId);
                }

                if (PlayId != undefined) {
                    playlists.currentPlaylistId = PlayId;
                    playlists.currentPlaylistName = $("#playlist" + PlayId).html();
                    playlists.markSelectedPlaylist(playlists.currentPlaylistId);
                }
                else {
                    if (playlists.firstTime == 0) {
                        currentId = $("#playlist_lister #playlist_vertical_column").children().last().children().first().attr("id");
                        playlists.currentPlaylistId = currentId;
                        playlists.currentPlaylistName = $("#playlist" + currentId).html();
                        playlists.markSelectedPlaylist(playlists.currentPlaylistId);
                    }
                }

            }
        }, "json");
    }



    this.updateCompacted = function () {  //actualizeaza melodiile din modul compactat (folosind reprezentarea interna)
        newHtml = '<div class="scroll_vertical" >' + "<h4>" + "Current Playlist" + " ";
        newHtml += '</h4> <ul class="oneline">';

        for (j = 0; j < playlistSongs.length; j++) {
            newHtml = newHtml + '<li><a href="javascript:void(0)" onclick="playlists.toQueuePlaylistSong(' + playlistSongs[j].playlistPosition + ')">' + playlistSongs[j].songObj.SongName + ' - ' + playlistSongs[j].songObj.Artists + '</a></li>\n';
        }
        newHtml = newHtml + ' </ul>\n </div>';
        panelPlaylists.setCompactedHtml(newHtml);
    }

    this.showSongs = function (PlayId) { //actualizeaza tot panelul - se apeleaza la deschiderea unui alt playlist decat cel curent

        songInfo = { UserId: Mm.session.userId,
            PlaylistId: PlayId
        };


        Mm.showLoading();
        $.post("PlaylistSongsPanel.ashx", songInfo, function (response) {
            if (Mm.checkAppState(response) == true) {
                playlistDataArray = [];
                playlistSongs = [];

                if (response != undefined) {
                    for (i = 0; i < response.length; i++) {
                        playlistSongs[i] = { songObj: response[i], playlistPosition: i };
                        playlistDataArray[i] = { position: i, SongName: response[i].SongName, Artists: response[i].Artists, Album: response[i].Album, Year: response[i].Year, Genres: response[i].Genres, action: { content: '<div class="inlinePlaylistDiv"> <img src="images/to_queue_gridview_song.png" title="add song to queue" onmouseover="this.src=\'images/to_queue_gridview_song_hover.png\'" onmouseout="this.src=\'images/to_queue_gridview_song.png\'" onClick="playlists.toQueuePlaylistSong(' + i + ');" /> <img src="images/promote_gridview_song.png" title="move song up" onmouseover="this.src=\'images/promote_gridview_song_hover.png\'" onmouseout="this.src=\'images/promote_gridview_song.png\'"  onClick="playlists.promotePlaylistSong(' + i + ');" /> <img src="images/demote_gridview_song.png" title="move song down" onmouseover="this.src=\'images/demote_gridview_song_hover.png\'" onmouseout="this.src=\'images/demote_gridview_song.png\'" onClick="playlists.demotePlaylistSong(' + i + ');" /> <img src="images/recommend.png" title="recommend song to a friend" onmouseover="this.src=\'images/recommend_hover.png\'" onmouseout="this.src=\'images/recommend.png\'" onClick="RecommendObject.recommend(' + parseInt(response[i].SongId) + ', \'' + response[i].Artists + ' - ' + response[i].SongName + '\')" /> <img src="images/delete_gridview_song.png" title="delete song from playlist" onmouseover="this.src=\'images/delete_gridview_song_hover.png\'" onmouseout="this.src=\'images/delete_gridview_song.png\'" onClick="playlists.deletePlaylistSong(' + i + ');"/> <img src="images/report.png" title="report a problem at this song" onmouseover="this.src=\'images/report_hover.png\'" onmouseout="this.src=\'images/report.png\'" onClick="UrlObject.redirect(\'#/reportSong/reportForm/' + response[i].SongId + '\')" /> </div>', type: 'html'} };
                    }
                    playlists.initialiseSender();
                }

                playlistGridview = new Gridview(playlistColumnArray, playlistDataArray, 'playlist_gridview');
                $("#playlist_gridview_container").html(playlistGridview.getGridviewHtml());
                playlistGridview.activate();


                //                testFav = $("#playlist" + PlayId + "").html();

                //                if (testFav == "Favourites") {
                //                    document.getElementById("RemoveButtonAnchor").disabled = true;
                //                    document.getElementById("RenamePlaylistButtonAnchor").disabled = true;                    
                //                    document.getElementById("RemoveButtonAnchor").onclick = function () { };
                //                    document.getElementById("AddToQueueButtonAnchor").onclick = function () { playlists.addPlaylistToQueue() };
                //                    document.getElementById("SavePlaylistButtonAnchor").onclick = function () { playlists.savePlaylist(PlayId) };
                //                    document.getElementById("RenamePlaylistButtonAnchor").onclick = function () { };
                //                } else {
                //                    document.getElementById("RemoveButtonAnchor").disabled = false;
                //                    document.getElementById("RenamePlaylistButtonAnchor").disabled = false;
                //                    document.getElementById("RemoveButtonAnchor").onclick = function () { playlists.deletePlaylist(PlayId) };
                //                    document.getElementById("AddToQueueButtonAnchor").onclick = function () { playlists.addPlaylistToQueue() };
                //                    document.getElementById("SavePlaylistButtonAnchor").onclick = function () { playlists.savePlaylist(PlayId) };
                //                    document.getElementById("RenamePlaylistButtonAnchor").onclick = function () { playlists.renamePlaylist(PlayId) };
                //                }

                document.getElementById("RemoveButtonAnchor").onclick = function () { playlists.deletePlaylist(PlayId) };
                document.getElementById("AddToQueueButtonAnchor").onclick = function () { playlists.addPlaylistToQueue() };
                document.getElementById("SavePlaylistButtonAnchor").onclick = function () { playlists.savePlaylist(PlayId) };
                document.getElementById("RenamePlaylistButtonAnchor").onclick = function () { playlists.renamePlaylist(PlayId) };

                Mm.hideLoading();
            }
        }, "json");

        this.changeContent(PlayId);

        
    }

    this.deletePlaylistSong = function (position) { //sterge o melodie din playlist (doar in js, nu si in bd)

        for (i = 0; i < playlistSongs.length; i++) {
            if (playlistSongs[i].playlistPosition == position) {
                playlistSongs.splice(i, 1);
                break;
            }
        }

        playlistDataArray = [];
        for (i = 0; i < playlistSongs.length; i++) {
            playlistSongs[i].playlistPosition = i;
            playlistDataArray[i] = { position: i, SongName: playlistSongs[i].songObj.SongName, Artists: playlistSongs[i].songObj.Artists, Album: playlistSongs[i].songObj.Album, Year: playlistSongs[i].songObj.Year, Genres: playlistSongs[i].songObj.Genres, action: { content: '<div class="inlinePlaylistDiv"> <img src="images/to_queue_gridview_song.png" title="add song to queue" onmouseover="this.src=\'images/to_queue_gridview_song_hover.png\'" onmouseout="this.src=\'images/to_queue_gridview_song.png\'" onClick="playlists.toQueuePlaylistSong(' + i + ');" /> <img src="images/promote_gridview_song.png" title="move song up" onmouseover="this.src=\'images/promote_gridview_song_hover.png\'" onmouseout="this.src=\'images/promote_gridview_song.png\'"  onClick="playlists.promotePlaylistSong(' + i + ');" /> <img src="images/demote_gridview_song.png" title="move song down" onmouseover="this.src=\'images/demote_gridview_song_hover.png\'" onmouseout="this.src=\'images/demote_gridview_song.png\'" onClick="playlists.demotePlaylistSong(' + i + ');" /> <img src="images/recommend.png" title="recommend song to a friend" onmouseover="this.src=\'images/recommend_hover.png\'" onmouseout="this.src=\'images/recommend.png\'" onClick="RecommendObject.recommend(' + parseInt(playlistSongs[i].songObj.SongId) + ', \'' + playlistSongs[i].songObj.Artists + ' - ' + playlistSongs[i].songObj.SongName + '\')" /> <img src="images/delete_gridview_song.png" title="delete song from playlist" onmouseover="this.src=\'images/delete_gridview_song_hover.png\'" onmouseout="this.src=\'images/delete_gridview_song.png\'" onClick="playlists.deletePlaylistSong(' + i + ');"/> <img src="images/report.png" title="report a problem at this song" onmouseover="this.src=\'images/report_hover.png\'" onmouseout="this.src=\'images/report.png\'" onClick="UrlObject.redirect(\'#/reportSong/reportForm/' + playlistSongs[i].songObj.SongId + '\')" /> </div>', type: 'html'} };
        }

        playlistGridview = new Gridview(playlistColumnArray, playlistDataArray, 'playlist_gridview');
        $("#playlist_gridview_container").html(playlistGridview.getGridviewHtml());
        playlistGridview.activate();

        //playlists.changeContent();
        playlists.updateCompacted();
    }

    this.promotePlaylistSong = function (position) { //avanseaza pozitia melodiei in playlist (doar in js, nu si in bd)

        if (position == 0)
            return;

        aux = playlistSongs.splice(position, 1);
        playlistSongs.splice(position - 1, 0, aux[0]);

        playlistDataArray = [];
        for (i = 0; i < playlistSongs.length; i++) {
            playlistSongs[i].playlistPosition = i;
            playlistDataArray[i] = { position: i, SongName: playlistSongs[i].songObj.SongName, Artists: playlistSongs[i].songObj.Artists, Album: playlistSongs[i].songObj.Album, Year: playlistSongs[i].songObj.Year, Genres: playlistSongs[i].songObj.Genres, action: { content: '<div class="inlinePlaylistDiv"> <img src="images/to_queue_gridview_song.png" title="add song to queue" onmouseover="this.src=\'images/to_queue_gridview_song_hover.png\'" onmouseout="this.src=\'images/to_queue_gridview_song.png\'" onClick="playlists.toQueuePlaylistSong(' + i + ');" /> <img src="images/promote_gridview_song.png" title="move song up" onmouseover="this.src=\'images/promote_gridview_song_hover.png\'" onmouseout="this.src=\'images/promote_gridview_song.png\'"  onClick="playlists.promotePlaylistSong(' + i + ');" /> <img src="images/demote_gridview_song.png" title="move song down" onmouseover="this.src=\'images/demote_gridview_song_hover.png\'" onmouseout="this.src=\'images/demote_gridview_song.png\'" onClick="playlists.demotePlaylistSong(' + i + ');" /> <img src="images/recommend.png" title="recommend song to a friend" onmouseover="this.src=\'images/recommend_hover.png\'" onmouseout="this.src=\'images/recommend.png\'" onClick="RecommendObject.recommend(' + parseInt(playlistSongs[i].songObj.SongId) + ', \'' + playlistSongs[i].songObj.Artists + ' - ' + playlistSongs[i].songObj.SongName + '\')" /> <img src="images/delete_gridview_song.png" title="delete song from playlist" onmouseover="this.src=\'images/delete_gridview_song_hover.png\'" onmouseout="this.src=\'images/delete_gridview_song.png\'" onClick="playlists.deletePlaylistSong(' + i + ');"/> <img src="images/report.png" title="report a problem at this song" onmouseover="this.src=\'images/report_hover.png\'" onmouseout="this.src=\'images/report.png\'" onClick="UrlObject.redirect(\'#/reportSong/reportForm/' + playlistSongs[i].songObj.SongId + '\')" /> </div>', type: 'html'} };
        }

        playlistGridview = new Gridview(playlistColumnArray, playlistDataArray, 'playlist_gridview');
        $("#playlist_gridview_container").html(playlistGridview.getGridviewHtml());
        playlistGridview.activate();
        playlists.updateCompacted();

    }

    this.demotePlaylistSong = function (position) { //devanseaza pozitia melodiei in playlist (doar in js, nu si in bd)

        if (position == playlistSongs.length - 1)
            return;

        aux = playlistSongs.splice(position + 1, 1);
        playlistSongs.splice(position, 0, aux[0]);

        playlistDataArray = [];
        for (i = 0; i < playlistSongs.length; i++) {
            playlistSongs[i].playlistPosition = i;
            playlistDataArray[i] = { position: i, SongName: playlistSongs[i].songObj.SongName, Artists: playlistSongs[i].songObj.Artists, Album: playlistSongs[i].songObj.Album, Year: playlistSongs[i].songObj.Year, Genres: playlistSongs[i].songObj.Genres, action: { content: '<div class="inlinePlaylistDiv"> <img src="images/to_queue_gridview_song.png" title="add song to queue" onmouseover="this.src=\'images/to_queue_gridview_song_hover.png\'" onmouseout="this.src=\'images/to_queue_gridview_song.png\'" onClick="playlists.toQueuePlaylistSong(' + i + ');" /> <img src="images/promote_gridview_song.png" title="move song up" onmouseover="this.src=\'images/promote_gridview_song_hover.png\'" onmouseout="this.src=\'images/promote_gridview_song.png\'"  onClick="playlists.promotePlaylistSong(' + i + ');" /> <img src="images/demote_gridview_song.png" title="move song down" onmouseover="this.src=\'images/demote_gridview_song_hover.png\'" onmouseout="this.src=\'images/demote_gridview_song.png\'" onClick="playlists.demotePlaylistSong(' + i + ');" /> <img src="images/recommend.png" title="recommend song to a friend" onmouseover="this.src=\'images/recommend_hover.png\'" onmouseout="this.src=\'images/recommend.png\'" onClick="RecommendObject.recommend(' + parseInt(playlistSongs[i].songObj.SongId) + ', \'' + playlistSongs[i].songObj.Artists + ' - ' + playlistSongs[i].songObj.SongName + '\')" /> <img src="images/delete_gridview_song.png" title="delete song from playlist" onmouseover="this.src=\'images/delete_gridview_song_hover.png\'" onmouseout="this.src=\'images/delete_gridview_song.png\'" onClick="playlists.deletePlaylistSong(' + i + ');"/> <img src="images/report.png" title="report a problem at this song" onmouseover="this.src=\'images/report_hover.png\'" onmouseout="this.src=\'images/report.png\'" onClick="UrlObject.redirect(\'#/reportSong/reportForm/' + playlistSongs[i].songObj.SongId + '\')" /> </div>', type: 'html'} };
        }

        playlistGridview = new Gridview(playlistColumnArray, playlistDataArray, 'playlist_gridview');
        $("#playlist_gridview_container").html(playlistGridview.getGridviewHtml());
        playlistGridview.activate();
        playlists.updateCompacted();
    }

    this.toQueuePlaylistSong = function (position) { // adauga melodia in coada de redare
        for (i = 0; i < playlistSongs.length; i++) {
            if (playlistSongs[i].playlistPosition == position) {
                rightQueue.add(playlistSongs[i].songObj);
                break;
            }
        }
    }

    //
    // functia publica de adaugare - se apeleaza cu playlists.addSongToPlaylist(song_json);
    //

    this.addSongToPlaylist = function (obj) {
        l = playlistSongs.length;
        newSong = { songObj: obj, playlistPosition: l };
        playlistSongs[l] = newSong;

        playlistDataArray = [];
        for (i = 0; i < playlistSongs.length; i++) {
            playlistSongs[i].playlistPosition = i;
            playlistDataArray[i] = { position: i, SongName: playlistSongs[i].songObj.SongName, Artists: playlistSongs[i].songObj.Artists, Album: playlistSongs[i].songObj.Album, Year: playlistSongs[i].songObj.Year, Genres: playlistSongs[i].songObj.Genres, action: { content: '<div class="inlinePlaylistDiv"> <img src="images/to_queue_gridview_song.png" title="add song to queue" onmouseover="this.src=\'images/to_queue_gridview_song_hover.png\'" onmouseout="this.src=\'images/to_queue_gridview_song.png\'" onClick="playlists.toQueuePlaylistSong(' + i + ');" /> <img src="images/promote_gridview_song.png" title="move song up" onmouseover="this.src=\'images/promote_gridview_song_hover.png\'" onmouseout="this.src=\'images/promote_gridview_song.png\'"  onClick="playlists.promotePlaylistSong(' + i + ');" /> <img src="images/demote_gridview_song.png" title="move song down" onmouseover="this.src=\'images/demote_gridview_song_hover.png\'" onmouseout="this.src=\'images/demote_gridview_song.png\'" onClick="playlists.demotePlaylistSong(' + i + ');" /> <img src="images/recommend.png" title="recommend song to a friend" onmouseover="this.src=\'images/recommend_hover.png\'" onmouseout="this.src=\'images/recommend.png\'" onClick="RecommendObject.recommend(' + parseInt(playlistSongs[i].songObj.SongId) + ', \'' + playlistSongs[i].songObj.Artists + ' - ' + playlistSongs[i].songObj.SongName + '\')" /> <img src="images/delete_gridview_song.png" title="delete song from playlist" onmouseover="this.src=\'images/delete_gridview_song_hover.png\'" onmouseout="this.src=\'images/delete_gridview_song.png\'" onClick="playlists.deletePlaylistSong(' + i + ');"/> <img src="images/report.png" title="report a problem at this song" onmouseover="this.src=\'images/report_hover.png\'" onmouseout="this.src=\'images/report.png\'" onClick="UrlObject.redirect(\'#/reportSong/reportForm/' + playlistSongs[i].songObj.SongId + '\')" /> </div>', type: 'html'} };
        }

        playlistGridview = new Gridview(playlistColumnArray, playlistDataArray, 'playlist_gridview');
        $("#playlist_gridview_container").html(playlistGridview.getGridviewHtml());
        playlistGridview.activate();
        playlists.updateCompacted();

    }

    this.addPlaylistToQueue = function () { // adauga toate melodiile din playlist in coada

        for (i = 0; i < playlistSongs.length; i++) {
            rightQueue.add(playlistSongs[i].songObj);
        }

    }


    this.newPlaylist = function () {  // creaza un playlist now, introducand intrarea in bd
        $("#NewButtonAnchor").unbind('click');
        $(".list_playlists").append("<input id='new_playlist_name' type='text' size='10' value='New playlist'>");
        $("#new_playlist_name").focus();
        $("#new_playlist_name").select();


        $("#new_playlist_name").keypress(function (event) {
            if (event.which == '13') {
                $("#new_playlist_name").focusout();
            }
        });

        $("#new_playlist_name").focusout(function () {

            // asta e pentru favourite
            if ($('#new_playlist_name').val() == "Favourites") {
                $('#new_playlist_name').val("New Playlist");
            }

            if ($('#new_playlist_name').val().length < 1) {
                $('#new_playlist_name').val("New Playlist");
            }

            newName = $('#new_playlist_name').val();
            newName = Mm.sanitizeString(newName);
            playlistInfo = {
                PlaylistName: newName,
                UserId: Mm.session.userId
            };


            Mm.showLoading();
            $.post("PlaylistInsert.ashx", playlistInfo, function (response) {
                if (Mm.checkAppState(response) == true) {
                    playlists.changeContent();
                }
                Mm.hideLoading();
            }, "json");

            playlists.playlistDataArray = [];
            playlists.playlistSongs = [];

            playlistGridview = new Gridview(playlistColumnArray, playlistDataArray, 'playlist_gridview');
            $("#playlist_gridview_container").html(playlistGridview.getGridviewHtml());
            playlistGridview.activate();
            playlists.updateCompacted();
            $("#NewButtonAnchor").bind('click', function () {
                playlists.newPlaylist();
            });
        });

    }

    this.deletePlaylist = function (PlayId) { // sterge playlistul curend din bd

        if ($("#playlist" + PlayId + "").html() == "Favourites") {
            alert("You cannot delete this playlist!");
            return;
        }

        playlistInfo = { PlaylistId: PlayId };
        Mm.showLoading();
        $.post("PlaylistDelete.ashx", playlistInfo, function (response) {
            if (Mm.checkAppState(response) == true) {
                playlists.changeContent(playlists.favouriteId);
                $("#playlist_gridview_container").html("");
            }
            Mm.hideLoading();
        }, "json");

        playlists.showSongs(playlists.favouriteId);

        //playlists.updateCompacted();
        //playlists.showSongs(playlists.favouriteId);

    }

    this.renamePlaylist = function (PlayId) { //redenumeste playlistul curent (in bd)

        if ($("#playlist" + PlayId + "").html() == "Favourites") {
            alert("You cannot rename this playlist!");
            return;
        }

        oldName = $("#playlist" + PlayId + "").html();
        oldLi = $("#playlist" + PlayId + "").replaceWith('<input id="rename_playlist" type="text" size="10" value="' + $("#playlist" + PlayId + "").html() + '"/>');

        ignore = 0;

        $("#rename_playlist").focus();
        $("#rename_playlist").select();

        $("#rename_playlist").keypress(function (event) {
            if (event.which == '13') {
                $("#rename_playlist").focusout();
            }
        });


        $("#rename_playlist").focusout(function () {

            if ($('#rename_playlist').val().length < 1 || $('#rename_playlist').val() == "Favourites")  {
                ignore = 1;
            }

            newName = $("#rename_playlist").val();
            newName = Mm.sanitizeString(newName);
            $("#rename_playlist").replaceWith(oldLi);
            ($("#playlist" + PlayId + "").html(newName));

            if (ignore == 1) {
                newName = oldName;
            }


            playlistInfo = { PlaylistId: PlayId,
                PlaylistName: newName
            };

            Mm.showLoading();
            $.post("PlaylistRename.ashx", playlistInfo, function (response) {
                if (Mm.checkAppState(response) == true) {
                    playlists.changeContent(PlayId);
                }
                Mm.hideLoading();
            }, "json");

        });
        playlists.updateCompacted();
    }

    this.savePlaylist = function (PlayId) { // salveaza in bd modificarile aduse playlistului

        vectorSongIds = [];
        vectorPlaylistPositions = [];

        for (i = 0; i < playlistSongs.length; i++) {
            vectorSongIds[i] = playlistSongs[i].songObj.SongId;
            vectorPlaylistPositions[i] = playlistSongs[i].playlistPosition;
        }


        playlistInfo = {
            PlaylistId: PlayId,
            SongIds: vectorSongIds,
            PlaylistPositions: vectorPlaylistPositions,
            UserId: Mm.session.userId
        };


        Mm.showLoading();
        $.post("PlaylistSaveDelete.ashx", playlistInfo, function (response) {
            if (Mm.checkAppState(response) == true) {

                $.post("PlaylistSave.ashx", playlistInfo, function (response) {
                    if (Mm.checkAppState(response) == true) {
                        playlists.changeContent(PlayId);
                    }

                }, "json");

            }
            Mm.hideLoading();
        }, "json");

    }

    //    this.testare = function () {
    //        ghostSong = [];

    //        for (i = 1; i < 5; i++) {
    //            ghostSong[i] = { songObj: { SongId: i, Artists: "GhostArtist" + i, SongName: "GhostSong" + i, Year: 1990 + i, Genre: "manea" + i, Duration: "3:0" + i} };
    //            playlists.addSongToPlaylist(ghostSong[i].songObj);
    //        }
    //    }

    this.changeContent();
    $("#panel-extended-playlists").addClass("scroll_vertical");
    $("#panel-extended-playlists").addClass("scroll_horizontal");

    $("#panel-playlists").droppable({

        drop: function (event, ui) {
            ui.draggable.offset(soundDraggerPosition);
            playlists.addSongToPlaylist(soundDraggerObject);
        }
    });


}



var playlists = null;

var panelPlaylists = new Panel('Playlists', 'playlists', false);

//panelPlaylists.setExtendedHtml('<div class="column-menu"></div>\n\<div class="column"><div id="buttons_toolbar" class="button_toolbar"><a id= "SavePlaylistButtonAnchor" href="javascript:void(0)" class="button">Save Playlist</a><a id="AddToQueueButtonAnchor" href="javascript:void(0)" class="button">Add to Queue</a><a id="RemoveButtonAnchor" href="javascript:void(0)" class="button">Remove Playlist</a><a id="RenamePlaylistButtonAnchor" href="javascript:void(0)" class="button">Rename Playlist</a></div><div id="playlist_gridview_container" class="gridview_container"></div></div><div><a href="javascript:void(0)" onclick = "playlists.testare();">test</a></div>');
panelPlaylists.setExtendedHtml('<table> <tr> <td rowspan="2" valign="top"> <div id="playlist_lister" class="column-menu"> </td> <td> </div>\n\ <div id="buttons_toolbar" class="button_toolbar"><a id= "SavePlaylistButtonAnchor" href="javascript:void(0)" class="button">Save Playlist</a><a id="AddToQueueButtonAnchor" href="javascript:void(0)" class="button">Add to Queue</a><a id="RemoveButtonAnchor" href="javascript:void(0)" class="button">Remove Playlist</a><a id="RenamePlaylistButtonAnchor" href="javascript:void(0)" class="button">Rename Playlist</a></div> </td> </tr> <tr> <td valign="top"> <div id="playlist_gridview_container" class="gridview_container"> </div> </td> </tr> </table>');


panelPlaylists.setCompactedHtml('<h4>Current playlist</h4>\n\
										<ul class="oneline">\
										</ul>\n\
                                        ');

