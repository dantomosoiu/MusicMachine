function TopMusicClass() {
    this.__load = function () {
        Panels.add(panelTopMusic);
        Panels.extend('topmusic');
        topmusic.refreshTop();
    }

    this.index = function () {
    }

    this.results = [];
    this.selection = ["this week", "this month", "this year"];

    this.addSongToQueue = function (position) {
        if (position < this.results.length)
            rightQueue.add(this.results[position]);
    }

    // Adauga melodia de la pozitia specificata in playlist-ul curent.
    this.addSongToPlaylist = function (position) {
        if (position < this.results.length)
            playlists.addSongToPlaylist(this.results[position]);
    }

    this.displayTop = function (selected, checked) {
        topsColumnArray = [
            { columnId: "Number", columnTitle: "#" },
            { columnId: "ListenCount", columnTitle: "Count" },
            { columnId: "SongName", columnTitle: "Song" },
            { columnId: "Artists", columnTitle: "Artist" },
            { columnId: "Album", columnTitle: "Album" },
            { columnId: "Year", columnTitle: "Year" },
            { columnId: "Genres", columnTitle: "Genres" },
            { columnId: "Action", columnTitle: "Action" }
        ];

        topsDataArray = [];
        for (i = 0; i < this.results.length; ++i)
            topsDataArray[i] = {
                Number: i + 1,
                ListenCount: this.results[i].Count,
                SongName: this.results[i].SongName,
                Artists: this.results[i].Artists,
                Album: this.results[i].Album,
                Year: this.results[i].Year,
                Genres: this.results[i].Genres,
                Action: { content: '<div class="inlinePlaylistDiv"> <img src="images/to_queue_gridview_song.png" title="add song to queue" onmouseover="this.src=\'images/to_queue_gridview_song_hover.png\'" onmouseout="this.src=\'images/to_queue_gridview_song.png\'" onClick="topmusic.addSongToQueue(' + i + ');" /> <img src="images/add_playlist.png" title="add song to playlist" onmouseover="this.src=\'images/add_playlist_hover.png\'" onmouseout="this.src=\'images/add_playlist.png\'" onClick="topmusic.addSongToPlaylist(' + i + ');" /> <img src="images/recommend.png" title="recommend song to a friend" onmouseover="this.src=\'images/recommend_hover.png\'" onmouseout="this.src=\'images/recommend.png\'" onClick="RecommendObject.recommend(' + parseInt(topmusic.results[i].SongId) + ', \'' + topmusic.results[i].Artists + ' - ' + topmusic.results[i].SongName + '\')" />', type: "html" }
            };

        if (this.results.length > 0) {
            topsGridview = new Gridview(topsColumnArray, topsDataArray, "tops_gridview");
            $("#tops_extended").html(topsGridview.getGridviewHtml());
            topsGridview.activate();
        } else {
            $("#tops_extended").html("No results to display.");
        }
        
        compactedHtml = 'Most played ';
        compactedHtml += this.selection[selected];
        compactedHtml += '<div id = "tops_compacted" >\n';
        if (checked == true)
            compactedHtml += ' (friends only) ';
        for (i = 0; i < this.results.length; ++i)
            compactedHtml += "<li><a href='javascript:topmusic.addSongToQueue(" + i + ")'>" + this.results[i].Artists + " - "
                + this.results[i].SongName + "<a/></li>";
        compactedHtml += '</div>';
        panelTopMusic.setCompactedHtml(compactedHtml);
    }

    this.refreshTop = function () {
        var select = document.getElementById("select");
        var selectedType = select.selectedIndex;
        var friendsOnly = document.getElementById("friendsOnly").checked;
        var UserId = Mm.session.userId;
        Mm.showLoading();
        $.post("TopMusic.ashx", { UserId: UserId, Type: selectedType, FriendsOnly: friendsOnly }, function (response) {
            if (Mm.checkAppState(response) == true) {
                topmusic.results = response;
                topmusic.displayTop(selectedType, friendsOnly);
                Mm.hideLoading();
            }
        }, "json");

    }
}

var topmusic = null;
var panelTopMusic = new Panel('Top Music', 'topmusic', true);

panelTopMusic.setExtendedHtml(' <div class = "selection"> Most played' +     
                               ' <select id = "select" class="most_played_list" onchange = "javascript:topmusic.refreshTop()"> \
                                    <option>this week</option>\
                                    <option>this month</option>\
                                    <option>this year</option>\
                                </select>\n\
                                <input type="checkbox" id="friendsOnly" onchange="javascript:topmusic.refreshTop()" >\
                                    <label for="friendsOnly">friends only</label> </div>\
                                <div class = "scroll_vertical" >\
                                    <div id = "tops_extended" class="gridview_container">\n\
								    </div>\
                                </div>');

panelTopMusic.setCompactedHtml('Most played \
                                <select id = "select" class="most_played_list" onchange = "javascript:topmusic.refreshTop()"> \
                                    <option>this week</option>\
                                    <option>this month</option>\
                                    <option>this year</option>\
                                </select>\n\
                                <input type = "checkbox" id = "friendsOnly" onchange = "javascript:topmusic.refreshTop()" />\
                                    friends only\
                                <div id = "tops_compacted" >\n\
								</div>');