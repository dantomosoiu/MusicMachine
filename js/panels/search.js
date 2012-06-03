function SearchClass() {
    this.__load = function () {
        Panels.extend('search');
        this.setEnterKeyPressAction();
    }

    this.index = function () {
    }
    
    this.results = [];

    // Preia informatiile introduse in searchbox-ul principal si apeleaza o functie de cautare 
    // in functie de tipul de search selectat.
    this.generalButton = function () {
        Panels.add(panelSearch);
        Panels.extend('search');
        var index = document.getElementById("search_options").selectedIndex;
        var selectedOption = document.getElementById("search_options").options[index].text;
        var searchString = document.getElementById("searchbox").value;

        if (selectedOption == "Songs") {
            this.songSearch(searchString, searchString, searchString, searchString, searchString);
        }

        if (selectedOption == "Lyrics") {
            this.lyricsSearch(searchString);
        }

        if (selectedOption == "Users") {
            this.userSearch(searchString, searchString, searchString);
        }
    }

    // Preia informatiile introduse la cautarea avansata a unei melodii si apeleaza functia 
    // de cautare specifica.
    this.songButton = function () {
        var songName = document.getElementById("song_name_box").value;
        artists = document.getElementById("artists_box").value;
        album = document.getElementById("album_box").value;
        year = document.getElementById("year_box").value;
        genres = document.getElementById("genres_box").value;
        this.songSearch(songName, artists, album, year, genres);
    }

    // Preia informatiile introduse la cautarea unei melodii dupa versuri si apeleaza functia 
    // de cautare specifica.
    this.lyricsButton = function () {
        lyrics = document.getElementById("lyrics_box").value;
        this.lyricsSearch(lyrics);
    }

    // Preia informatiile introduse la cautarea unui utilizator si apeleaza functia 
    // de cautare specifica.
    this.userButton = function () {
        firstName = document.getElementById("first_name_box").value;
        lastName = document.getElementById("last_name_box").value;
        email = document.getElementById("email_box").value;
        this.userSearch(firstName, lastName, email);
    }

    // Afiseaza intr-un gridview informatiile despre melodii intoarse de o interogare catre server. 
    // Actualizeaza si panoul compactat.
    this.displaySongs = function () {
        searchColumnArray = [
            { columnId: "SongName", columnTitle: "Song" },
            { columnId: "Artists", columnTitle: "Artist" },
            { columnId: "Album", columnTitle: "Album" },
            { columnId: "Year", columnTitle: "Year" },
            { columnId: "Genres", columnTitle: "Genres" },
            { columnId: "Action", columnTitle: "Action" }
        ];

        searchDataArray = [];
        for (i = 0; i < this.results.length; ++i) {
            searchDataArray[i] = {
                SongName: this.results[i].SongName,
                Artists: this.results[i].Artists,
                Album: this.results[i].Album,
                Year: this.results[i].Year,
                Genres: this.results[i].Genres,
                Action: { content: '<div class="inlinePlaylistDiv"> <img src="images/to_queue_gridview_song.png" title="add song to queue" onmouseover="this.src=\'images/to_queue_gridview_song_hover.png\'" onmouseout="this.src=\'images/to_queue_gridview_song.png\'" onClick="search.addSearchSongToQueue(' + i + ');" /> <img src="images/add_playlist.png" title="add song to playlist" onmouseover="this.src=\'images/add_playlist_hover.png\'" onmouseout="this.src=\'images/add_playlist.png\'" onClick="search.addSearchSongToPlaylist(' + i + ');" /> <img src="images/recommend.png" title="recommend song to a friend" onmouseover="this.src=\'images/recommend_hover.png\'" onmouseout="this.src=\'images/recommend.png\'" onClick="RecommendObject.recommend(' + parseInt(search.results[i].SongId) + ', \'' + search.results[i].Artists + ' - ' + search.results[i].SongName + '\')" /> <img src="images/report.png" title="report a problem at this song" onmouseover="this.src=\'images/report_hover.png\'" onmouseout="this.src=\'images/report.png\'" onClick="UrlObject.redirect(\'#/reportSong/reportForm/' + search.results[i].SongId + '\')" /> </div>', type: 'html' }
            };
        }

        if (this.results.length > 0) {
            searchGridview = new Gridview(searchColumnArray, searchDataArray, "search_gridview");
            $("#search_gridview_container").html(searchGridview.getGridviewHtml());
            searchGridview.activate();
        } else {
            $("#search_gridview_container").html("No results to display.");
        }

        compactedHtml = "";
        for (i = 0; i < this.results.length; ++i)
            compactedHtml += "<li><a href='javascript:search.addSearchSongToQueue(" + i + ")'>" + this.results[i].Artists + " - "
                + this.results[i].SongName + "<a/></li>";
        document.getElementById("compacted_search_list").innerHTML = compactedHtml;
        Panels.fixCompactedLinks('search');
    }

    // Afiseaza intr-un gridview informatiile despre utilizatori intoarse de o interogare catre server. 
    // Actualizeaza si panoul compactat.
    this.displayUsers = function (results) {
        searchColumnArray = [
            { columnId: "FirstName", columnTitle: "First Name" },
            { columnId: "LastName", columnTitle: "Last Name" },
            { columnId: "Email", columnTitle: "Email" },
            { columnId: "Action", columnTitle: "Action"}
        ];

        searchDataArray = [];
        for (i = 0; i < this.results.length; ++i)
            searchDataArray[i] = {
                FirstName: this.results[i].FirstName,
                LastName: this.results[i].LastName,
                Email: this.results[i].Email,
                Action: { content: "<a href='#/friends/personalInfo/" + this.results[i].UserId + "'>View profile</a>", type: "html" }
            };

        if (this.results.length > 0) {
            searchGridview = new Gridview(searchColumnArray, searchDataArray, "search_gridview");
            $("#search_gridview_container").html(searchGridview.getGridviewHtml());
            searchGridview.activate();
        } else {
            $("#search_gridview_container").html("No results to display.");
        }

        compactedHtml = "";
        for (i = 0; i < this.results.length; ++i)
            compactedHtml += "<li><a href='#/friends/personalInfo/" + this.results[i].UserId + "'>" + this.results[i].FirstName
                + " " + this.results[i].LastName + "</a></li>";
        document.getElementById("compacted_search_list").innerHTML = compactedHtml;
        Panels.fixCompactedLinks('search');
    }

    // Executa cautarea unei melodii.
    this.songSearch = function (songName, artists, album, year, genres) {
        songName = Mm.sanitizeString(songName);
        artists = Mm.sanitizeString(artists);
        album = Mm.sanitizeString(album);
        year = Mm.sanitizeString(year);
        genres = Mm.sanitizeString(genres);

        searchRequest = {
            songName: songName,
            artists: artists,
            album: album,
            year: year,
            genres: genres,
            user_id: Mm.session.userId,
            results: 100
        }

        if (songName != "" || artists != "" || album != "" || year != "" || genres != "") {
            Mm.showLoading();
            $.post("SearchSongs.ashx", searchRequest, function (response) {
                if (Mm.checkAppState(response) == true) {
                    search.results = response;
                    search.displaySongs(this.results);
                    Mm.hideLoading()
                }
            }, "json");
        }
    }

    // Executa cautarea unei melodii dupa versuri.
    this.lyricsSearch = function (lyrics) {
        lyrics = Mm.sanitizeString(lyrics);
        searchRequest = {
            lyrics: lyrics,
            user_id: Mm.session.userId,
            results: 100
        }

        if (lyrics != "") {
            Mm.showLoading();
            $.post("SearchLyrics.ashx", searchRequest, function (response) {
                if (Mm.checkAppState(response) == true) {
                    search.results = response;
                    search.displaySongs(this.results);
                    Mm.hideLoading();
                }
            }, "json");
        }
    }

    // Executa cautarea unui utilizator.
    this.userSearch = function (firstName, lastName, email) {
        firstName = Mm.sanitizeString(firstName);
        lastName = Mm.sanitizeString(lastName);
        email = Mm.sanitizeString(email);

        searchRequest = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            results: 100
        }

        if (firstName != "" || lastName != "" || email != "") {
            Mm.showLoading();
            $.post("SearchUsers.ashx", searchRequest, function (response) {
                if (Mm.checkAppState(response) == true) {
                    search.results = response;
                    search.displayUsers(this.results);
                    Mm.hideLoading();
                }
            }, "json");
        }
    }

    // Adauga melodia de la pozitia specificata in coada.
    this.addSearchSongToQueue = function (position) {
        if (position < this.results.length)
            rightQueue.add(this.results[position]);
    }

    // Adauga melodia de la pozitia specificata in playlist-ul curent.
    this.addSearchSongToPlaylist = function (position) {
        if (position < this.results.length)
            playlists.addSongToPlaylist(this.results[position]);
    }

    this.setEnterKeyPressAction = function () {
        var songSearchTextboxes = ["#song_name_box", "#artists_box", "#album_box", "#year_box", "#genres_box"];
        for (i in songSearchTextboxes) {
            $(songSearchTextboxes[i]).keypress(function (event) {
                if (event.which == '13') {
                    search.songButton();
                }
            });
        }

        var userSearchTextboxes = ["#first_name_box", "#last_name_box", "#email_box"];
        for (i in userSearchTextboxes) {
            $(userSearchTextboxes[i]).keypress(function (event) {
                if (event.which == '13') {
                    search.userButton();
                }
            });
        }

        $("#lyrics_box").keypress(function (event) {
            if (event.which == '13') {
                search.lyricsButton();
            }
        });
    }

    $("#searchbox").keypress(function (event) {
        if (event.which == '13') {
            search.generalButton();
        }
    });
}

var search = null;
var panelSearch = new Panel('Search', 'search', true);

panelSearch.setExtendedHtml('<div class="scroll_vertical" style="height: 300px"><div class="column">\n\
								<div class="oneline_form_container">\n\
									<div class="row">Name <input id="song_name_box" type="text"></div>\n\
									<div class="row">Artist <input id="artists_box" type="text"></div>\n\
									<div class="row">Album <input id="album_box" type="text"></div>\n\
									<div class="row">Year <input id="year_box" type="text"></div>\n\
									<div class="row">Genre <input id="genres_box" type="text"></div>\n\
									<div class="submit"><input class="button" type="button" value="Search songs" onclick="search.songButton()"></div>\n\
								</div>\n\
							</div>\n\
							<div class="column">\n\
								<div class="oneline_form_container">\n\
									<div class="row">First Name <input id="first_name_box" type="text"></div>\n\
                                    <div class="row">Last Name <input id="last_name_box" type="text"></div>\n\
                                    <div class="row">Email <input id="email_box" type="text"></div>\n\
									<div class="submit"><input class="button" type="button" value="Search users" onclick="search.userButton()"></div>\n\
								</div>\n\
								<div class="oneline_form_container">\n\
									<div class="row">Lyrics <input id="lyrics_box" type="text"></div>\n\
									<div class="submit"><input class="button" type="button" value="Search lyrics" onclick="search.lyricsButton()"></div>\n\
								</div>\n\
							</div>\n\
							<h4 style="clear: both">Results</h4>\n\
							<div id="search_gridview_container" class="gridview_container">\n\
							</div>\n\
							</div>\n\
');
panelSearch.setCompactedHtml('<p><a href="javascript:Panels.extend(\'search\')">Advanced</a></p>\n\
								<h4>Results</h4>\n\
								<ul id="compacted_search_list" class="oneline">\n\
								</ul>\n\
');
