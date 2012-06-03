function UploadClass() {

    this.__load = function () {
        Panels.add(panelUpload);
        Panels.extend('upload');
    }

    this.index = function () {
        this.getSongs();
    }

    uploadColumnArray = [{ columnId: 'SongName', columnTitle: 'Song' }, { columnId: 'Artists', columnTitle: 'Artist' }, { columnId: 'Album', columnTitle: 'Album' }, { columnId: 'Year', columnTitle: 'Year' }, { columnId: 'Genres', columnTitle: 'Genres' }, { columnId: 'ReportType', columnTitle: 'ReportType' }, { columnId: 'ReportDate', columnTitle: 'ReportDate' }, { columnId: 'Comment', columnTitle: 'Comment' }, { columnId: 'Action', columnTitle: 'Action' }, { columnId: 'GoTo', columnTitle: 'GoTo' }, { columnId: 'Modify', columnTitle: 'Modify' }, { columnId: 'UnReport', columnTitle: 'UnReport'}];
    uploadDataArray = [];
    uploadSongs = [];

    this.showSongs = function () {
        uploadDataArray = [];
        
        for (i = 0; i < uploadSongs.length; ++i)
            uploadDataArray[i] = {
                SongName: uploadSongs[i].Song.SongName,
                Artists: uploadSongs[i].Song.Artists,
                Album: uploadSongs[i].Song.Album,
                Year: uploadSongs[i].Song.Year,
                Genres: uploadSongs[i].Song.Genres,
                Reporter:uploadSongs[i].Reporter.UserId,
                ReportType:uploadSongs[i].ReportType,
                ReportDate:uploadSongs[i].ReportDate,
                Comment: uploadSongs[i].Comment,
                GoTo: { content: "<a href='#/friends/personalInfo/" + uploadSongs[i].Reporter.UserId + "' >See reporter</a>", type: "html" },
                Modify: { content: "<a href='javascript:void(0)' onClick='upload.changeIframeSrc(" + uploadSongs[i].Song.SongId + ",1);'>Modify</a>", type: "html" },
                //  Modify: { content: "<img src='images/to_queue_gridview_song.png' onClick='upload.getSongInfo(" + uploadSongs[i].Song.SongId + ");'>", type: "html" },
                UnReport: { content: "<a href='javascript:void(0)' onClick='upload.unreportSong(" + uploadSongs[i].Song.SongId + ");'>Unreport</a>", type: "html" },
                Action: { content: "<img src='images/to_queue_gridview_song.png' onClick='upload.addSongToQueue(" + i + ");'> <img src='images/delete_gridview_song.png' onClick='upload.deleteSong(" + uploadSongs[i].Song.SongId + ");'>", type: "html" }               
            };

           if (uploadSongs.length > 0) {
            uploadGridview = new Gridview(uploadColumnArray, uploadDataArray, "upload_gridview");
            $("#upload_gridview_container").html(uploadGridview.getGridviewHtml());
            uploadGridview.activate();
        } else {
            $("#upload_gridview_container").html("No results to display.");
        }

        compactedHtml = "";
        for (i = 0; i < uploadSongs.length; ++i)
            compactedHtml += "<li><a href='javascript:upload.addSongToQueue(" + i + ")'>" + uploadSongs[i].Song.Artists + " - "
                + uploadSongs[i].Song.SongName + "<a/></li>";
        document.getElementById("upload_content_compacted").innerHTML = compactedHtml;
        Panels.fixCompactedLinks('upload');
    }

    this.changeIframeSrc = function (SongId, do_function) {
        if (do_function == 1) do_function = "update";
        document.getElementById("Iframe1").src = "UploadSong.aspx?SongId=" + SongId + "&do_function=" + do_function;

    }

    this.getSongs = function () {

        showSong = {test:"test"};

        Mm.showLoading();
        $.post("UploadShowSongs.ashx", showSong, function (response) {
            if (Mm.checkAppState(response) == true) {
                uploadSongs = response;
                upload.showSongs();
                Mm.hideLoading()
            }
        }, "json");

    }

    this.addSongToQueue = function (position) {
        if (position < uploadSongs.length)
            rightQueue.add(uploadSongs[position].Song);
    }

    this.deleteSong = function (SongID) {



        if (MusicPlayer.getSongObj() != null) if (SongID == MusicPlayer.getSongId()) {
            MusicPlayer.finishedSong(0);
            leftQueue.remove();
            if (rightQueue.isEmpty() == true) MusicPlayer.flushPlayer();
        }


        songInfo = { SongId: SongID };
        Mm.showLoading();
        $.post("UploadDeleteSong.ashx", songInfo, function (response) {
            if (Mm.checkAppState(response) == true) {
                upload.getSongs();
                //  document.getElementById("Iframe1").contentDocument.getElementById("song_id_box").value = response.SongId;
//                document.getElementById("Iframe1").contentDocument.getElementById("song_name_box").value = response.SongName;
//                document.getElementById("Iframe1").contentDocument.getElementById("artists_box").value = response.Artists;
                // document.getElementById("Iframe1").contentDocument.getElementById("Button2").style = " {visibility:hidden;}";
                document.getElementById("Iframe1").src = "UploadSong.aspx";
            }
            Mm.hideLoading();
        }, "json");


    }

    this.unreportSong = function (SongID) {

        songInfo = { SongId: SongID };
        Mm.showLoading();
        $.post("UploadUnreportSong.ashx", songInfo, function (response) {
            if (Mm.checkAppState(response) == true) {
                document.getElementById("Iframe1").src = "UploadSong.aspx";
                upload.getSongs();
            }
            Mm.hideLoading();
        }, "json");


    }

//    this.insertSong = function () {
//        songName = document.getElementById("song_name_box").value;
//        artists = document.getElementById("artists_box").value;
//        album = document.getElementById("album_box").value;
//        year = document.getElementById("year_box").value;
//        genres = document.getElementById("genres_box").value;
//        lyrics = document.getElementById("lyrics_box").value;

//        songName = Mm.sanitizeString(songName);
//        artists = Mm.sanitizeString(artists);
//        album = Mm.sanitizeString(album);
//        year = Mm.sanitizeString(year);
//        genres = Mm.sanitizeString(genres);
//        lyrics = Mm.sanitizeString(lyrics);

//        songObj = { SongName: songName, Artists: artists, Album: album, Year: year, Genres: genres, Lyrics: lyrics };


//        Mm.showLoading();
//        $.post("UploadInsertSong.ashx", songObj, function (response) {
//            if (Mm.checkAppState(response) == true) {

//                document.getElementById("song_id_box").value = response.SongId;

////                document.getElementById("song_name_box").value = "";
////                document.getElementById("artists_box").value = "";
//                document.getElementById("album_box").value = "";
//                document.getElementById("year_box").value = "";
//                document.getElementById("genres_box").value = "";
//                document.getElementById("lyrics_box").value = "";
//            }
//            Mm.hideLoading();
//        }, "json");


//    }

//    this.getSongInfo = function (SongId) {
//        songInfo = { SongId: SongId };

//       
//        document.getElementById("Iframe1").contentDocument.getElementById("inputSong").innerHTML = "";
//        document.getElementById("Iframe1").contentDocument.getElementById("input_button_submit").onclick = function () { upload.updateSong(SongId) };

////        document.getElementById("input_file").innerHTML = "";
////        document.getElementById("input_button_submit").onclick = function () { upload.updateSong(SongId) };



//        Mm.showLoading();
//        $.post("UploadGetSongInfo.ashx", songInfo, function (response) {
//            if (Mm.checkAppState(response) == true) {


//                document.getElementById("Iframe1").contentDocument.getElementById("song_name_box").value = response.SongName;
//                document.getElementById("Iframe1").contentDocument.getElementById("artists_box").value = response.Artists;
//                document.getElementById("Iframe1").contentDocument.getElementById("album_box").value = response.Album;
//                document.getElementById("Iframe1").contentDocument.getElementById("year_box").value = response.Year;
//                document.getElementById("Iframe1").contentDocument.getElementById("genres_box").value = response.Genres;

////                document.getElementById("song_name_box").value = response.SongName;
////                document.getElementById("artists_box").value = response.Artists;
////                document.getElementById("album_box").value = response.Album;
////                document.getElementById("year_box").value = response.Year;
////                document.getElementById("genres_box").value = response.Genres;
////             


//                $.post("LyricsPanel.ashx", songInfo, function (response) {
//                    if (Mm.checkAppState(response) == true) {

//                       document.getElementById("Iframe1").contentDocument.getElementById("lyrics_box").value = response.SongLyrics;
//                       

//                    }
//                }, "json");



//                Mm.hideLoading()
//            }
//        }, "json");




//    }

//    this.updateSong = function (SongID) {

//        songName =  document.getElementById("Iframe1").contentDocument.getElementById("song_name_box").value;
//        artists =  document.getElementById("Iframe1").contentDocument.getElementById("artists_box").value;
//        album =  document.getElementById("Iframe1").contentDocument.getElementById("album_box").value;
//        year =  document.getElementById("Iframe1").contentDocument.getElementById("year_box").value;
//        genres =  document.getElementById("Iframe1").contentDocument.getElementById("genres_box").value;
//        lyrics =  document.getElementById("Iframe1").contentDocument.getElementById("lyrics_box").value;

//        songName = Mm.sanitizeString(songName);
//        artists = Mm.sanitizeString(artists);
//        album = Mm.sanitizeString(album);
//        year = Mm.sanitizeString(year);
//        genres = Mm.sanitizeString(genres);
//        lyrics = Mm.sanitizeString(lyrics);

//        songInfo = { SongId: SongID, SongName: songName, Artists: artists, Album: album, Year: year, Genres: genres, Lyrics: lyrics };

//        Mm.showLoading();
//        $.post("UploadUpdateSong.ashx", songInfo, function (response) {
//            if (Mm.checkAppState(response) == true) {


//                document.getElementById("upload_content_extended").innerHTML = '<iframe class="scroll_vertical"  id="Iframe1"  frameborder="0"  vspace="0"  hspace="0"  marginwidth="0"  marginheight="0" height="400px" width="100%" src="UploadSong.aspx"></iframe><div><div id="upload_gridview_container" class="gridview_container"></div></div>'
//                upload.getSongs();
////                document.getElementById("Iframe1").contentDocument.getElementById("input_button_submit").onclick = function () { upload.insertSong() };
////                document.getElementById("Iframe1").contentDocument.getElementById("input_file").innerHTML = '<input type="file"/>';

////                document.getElementById("Iframe1").contentDocument.getElementById("song_name_box").value = "";
////                document.getElementById("Iframe1").contentDocument.getElementById("artists_box").value = "";
////                document.getElementById("Iframe1").contentDocument.getElementById("album_box").value = "";
////                document.getElementById("Iframe1").contentDocument.getElementById("year_box").value = "";
////                document.getElementById("Iframe1").contentDocument.getElementById("genres_box").value = "";
//            }
//            Mm.hideLoading();
//        }, "json");

//        



//    }

};

var upload = null;
var panelUpload = new Panel('Upload', 'upload',true);
panelUpload.setExtendedHtml('<div id="upload_content_extended" class="scroll_vertical"><iframe  id="Iframe1" class="scroll_vertical"  frameborder="0"  vspace="0"  hspace="0"  marginwidth="0"  marginheight="0" height="400px" width="100%" src="UploadSong.aspx"></iframe><div><div id="upload_gridview_container" class="gridview_container"></div></div></div>');


panelUpload.setCompactedHtml('<div id="upload_content_compacted" class="scroll_vertical"> </div>');