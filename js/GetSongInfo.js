$(document).ready(function () {
    $('#loading').css('visibility', 'hidden');
    $("#inputSong").change(function () {
        $('#loading').css('visibility', 'visible');
        $('#fileUploadInfo').text("Wait");
        var songName = $("#inputSong").val().substr($("#inputSong").val().lastIndexOf("\\") + 1, $("#inputSong").val().length);

        $.post("GetSongInfo.ashx", { 'songName': songName }, function (data) {

            $("#album_box").val("");
            $("#song_name_box").val("");
            $("#artists_box").val("");
            $("#genres_box").val("");
            $("#year_box").val("");
            $("#lyrics_box").val("");

            eval("song = " + data);

            if (data == "error") {
                alert("Error fetching song information");
            }
            else {
                if (song.results.trackmatches.track != undefined) {

                    var song;
                    var artist = "";
                    var title = "";
                    var album = "";
                    var date = "";
                    var genre = "";
                    var i;

                    artist = song.results.trackmatches.track.artist;
                    artist = artist.replace(" & ", ",");
                    title = song.results.trackmatches.track.name;

                    $("#song_name_box").val(title);
                    $("#artists_box").val(artist);

                    $.post("GetSongInfo2.ashx", { 'title': title, 'artist': artist }, function (data) {

                        eval("song = " + data);
                        if (data == "error") {
                            alert("Error fetching song information");
                        }
                        else {
                            if (song.track != undefined) {
                                if (song.track.album != undefined) {
                                    album = song.track.album.title;
                                    $("#album_box").val(album);

                                    if (song.track.album.title != undefined) {
                                        $("#album_artist_field").val(song.track.album.artist);
                                    }
                                }

                                if (song.track.toptags != undefined && song.track.toptags.tag != undefined) {
                                    i = 0;
                                    while (song.track.toptags.tag[i + 1] != undefined) {
                                        genre += song.track.toptags.tag[i].name + ", ";
                                        i++;
                                    }
                                    genre += song.track.toptags.tag[i].name;
                                    $("#genres_box").val(genre);
                                }
                            }

                            $.post("GetSongInfo3.ashx", { 'album': album, 'artist': artist }, function (data) {

                                eval("song = " + data);
                                if (data == "error") {
                                    alert("Error fetching song information");
                                }
                                else {
                                    if (song.album != undefined) {
                                        if (song.album.releasedate != undefined) {
                                            date = new Date(song.album.releasedate).getFullYear();
                                            if (!isNaN(date)) {
                                                $("#year_box").val(date);
                                            }
                                        }
                                    }
                                }
                                $('#loading').css('visibility', 'hidden');
                                $('#fileUploadInfo').text("File");
                            }, "json");
                        }
                    }, "json");


                    $.post("GetSongInfo4.ashx", { 'title': title, 'artist': artist }, function (data) {

                        if (data == "error") {
                            alert("Error fetching song information");
                        }
                        else {
                            $("#lyrics_box").val(data);
                        }
                        
                    }, "json");
                }
                else {
                    $('#loading').css('visibility', 'hidden');
                    $('#fileUploadInfo').text("File");
                }
            }
        }, "json");

    });
});