function initializePlayer () {

    //SeekSlider
    $('#SeekSliderS').slider({
        range: "min",
        min: 0,
        change: function (e, ui) {
            if (e.originalEvent == undefined) {
                //
                // event was triggered programmatically - do something
                //
            } else {
                var sound = MusicPlayer.getFlashMovie("player");
                sound.playSliderS(ui.value);
            }
        },
        start: function (e, ui) {
            if (e.originalEvent == undefined) {
                //
                // event was triggered programmatically - do something
                //
            } else {
                 var sound = MusicPlayer.getFlashMovie("player");
                 sound.pauseSliderS();
            }
        }
    });

    // VolumeSlider
    $('#VolumeSliderS').slider({
        range: 'min',
        value: 100,
        step: 1,
        animate: true,
        slide: function (event, ui) {
             var sound = MusicPlayer.getFlashMovie("player");
             sound.changeVolumeS(ui.value);             
        }
    });

    $("#player_middle_middle").droppable({
         drop: function (event, ui) {
             ui.draggable.offset(soundDraggerPosition);
             rightQueue.add(soundDraggerObject, 0);
             MusicPlayer.finishedSong(0);
             rightQueue.remove(ui.draggable.attr("id").split("next_song_")[1]);
         }
    });

    Coord = $("#PreviousAnchor").offset();
    xCoord = Coord.left;
    yCoord = Coord.top;
    //alert(xCoord + "x" + yCoord);

    //$("#player_current_seconds").css("top", yCoord + "px");
    //$("#player_current_seconds").css("left", xCoord + 10 + "px");


    $('#player_current_seconds').animate({
        //left: '+=10',
        top: '-=18'
    });

    $('#player_total_seconds').animate({
        //left: '+=10',
        top: '-=18'
    });

}


function PlayerClass() {  

    var url;
    var stateUrl = 1; // 1 - trebuie bagat din stop 2 - a fost bagat deja din alta parte
    var stateRepeat = 0;
    
//    this.getFlashMovie = function (movieName) {
//    return swfobject.getObjectById("player");
//    }


    this.getFlashMovie = function (movieName) { // intoarce obiectul flash cu numele dat ca parametru
        var isIE = navigator.appName.indexOf("Microsoft") != -1;
        return (isIE) ? window[movieName] : document[movieName];
    }



    this.setMaxPosition = function (max) { // seteaza maximul sliderului (in milisecunde)

        var aux = 0;
        if (max > aux) {
            $("#SeekSliderS").slider("option", "max", max);
            aux_min_max = Math.floor(max / 60000);
            aux_sec_max = Math.floor(Math.floor(max % 60000) / 1000);
            $("#player_total_seconds").html(aux_min_max+":"+aux_sec_max);
            aux = max;
        }

    }

    this.playerVoteSong = function (VoteNr) {
    votedSong = { SongId: url.SongId, Vote: VoteNr };
    Mm.showLoading();
    $.post("VoteSong.ashx", votedSong, function (response) {
        if (Mm.checkAppState(response) == true) {
            url.Vote = VoteNr;
            rightQueue.updateQueue();
            leftQueue.updateQueue();

            buttonString = '';

            switch(VoteNr){
                                    case -1:
                                    {
                                        buttonString = '</div><div class="buton_queue_mid_1" onclick=\"MusicPlayer.playerVoteSong(0)\" ></div><div class="buton_queue_mid_2" onclick=\"MusicPlayer.playerVoteSong(1)\" ></div><div class="buton_queue_mid_3" onclick=\"MusicPlayer.playerVoteSong(2)\" ></div><div class="buton_queue_mid_4" onclick=\"MusicPlayer.playerVoteSong(3)\" ></div><div class="buton_queue_mid_5" onclick=\"MusicPlayer.playerVoteSong(4)\" ></div><div class="buton_queue_mid_6" onclick=UrlObject.redirect("#/reportSong/reportForm/' + url.SongId +'"); ></div>';
                                        break;
                                    }
                                    case 0:
                                    {
                                        buttonString = '</div><div class="buton_queue_mid_1_pressed" onclick=\"MusicPlayer.playerVoteSong(0)\" ></div><div class="buton_queue_mid_2" onclick=\"MusicPlayer.playerVoteSong(1)\" ></div><div class="buton_queue_mid_3" onclick=\"MusicPlayer.playerVoteSong(2)\" ></div><div class="buton_queue_mid_4" onclick=\"MusicPlayer.playerVoteSong(3)\" ></div><div class="buton_queue_mid_5" onclick=\"MusicPlayer.playerVoteSong(4)\" ></div><div class="buton_queue_mid_6" onclick=UrlObject.redirect("#/reportSong/reportForm/' + url.SongId +'"); ></div>';
                                        break;
                                    }
                                    case 1:
                                    {
                                        buttonString = '</div><div class="buton_queue_mid_1" onclick=\"MusicPlayer.playerVoteSong(0)\" ></div><div class="buton_queue_mid_2_pressed" onclick=\"MusicPlayer.playerVoteSong(1)\" ></div><div class="buton_queue_mid_3" onclick=\"MusicPlayer.playerVoteSong(2)\" ></div><div class="buton_queue_mid_4" onclick=\"MusicPlayer.playerVoteSong(3)\" ></div><div class="buton_queue_mid_5" onclick=\"MusicPlayer.playerVoteSong(4)\" ></div><div class="buton_queue_mid_6" onclick=UrlObject.redirect("#/reportSong/reportForm/' + url.SongId +'"); ></div>';
                                        break;
                                    }
                                    case 2:
                                    {
                                        buttonString = '</div><div class="buton_queue_mid_1" onclick=\"MusicPlayer.playerVoteSong(0)\" ></div><div class="buton_queue_mid_2" onclick=\"MusicPlayer.playerVoteSong(1)\" ></div><div class="buton_queue_mid_3_pressed" onclick=\"MusicPlayer.playerVoteSong(2)\" ></div><div class="buton_queue_mid_4" onclick=\"MusicPlayer.playerVoteSong(3)\" ></div><div class="buton_queue_mid_5" onclick=\"MusicPlayer.playerVoteSong(4)\" ></div><div class="buton_queue_mid_6" onclick=UrlObject.redirect("#/reportSong/reportForm/' + url.SongId +'"); ></div>';
                                        break;
                                    }
                                    case 3:
                                    {
                                        buttonString = '</div><div class="buton_queue_mid_1" onclick=\"MusicPlayer.playerVoteSong(0)\" ></div><div class="buton_queue_mid_2" onclick=\"MusicPlayer.playerVoteSong(1)\" ></div><div class="buton_queue_mid_3" onclick=\"MusicPlayer.playerVoteSong(2)\" ></div><div class="buton_queue_mid_4_pressed" onclick=\"MusicPlayer.playerVoteSong(3)\" ></div><div class="buton_queue_mid_5" onclick=\"MusicPlayer.playerVoteSong(4)\" ></div><div class="buton_queue_mid_6" onclick=UrlObject.redirect("#/reportSong/reportForm/' + url.SongId +'"); ></div>';
                                        break;
                                    }
                                    case 4:
                                    {
                                        buttonString = '</div><div class="buton_queue_mid_1" onclick=\"MusicPlayer.playerVoteSong(0)\" ></div><div class="buton_queue_mid_2" onclick=\"MusicPlayer.playerVoteSong(1)\" ></div><div class="buton_queue_mid_3" onclick=\"MusicPlayer.playerVoteSong(2)\" ></div><div class="buton_queue_mid_4" onclick=\"MusicPlayer.playerVoteSong(3)\" ></div><div class="buton_queue_mid_5_pressed" onclick=\"MusicPlayer.playerVoteSong(4)\" ></div><div class="buton_queue_mid_6" onclick=UrlObject.redirect("#/reportSong/reportForm/' + url.SongId +'"); ></div>';
                                        break;
                                    }
            }



            $("#player_middle_middle").html('<div class="song_container_buttons"><div class="dummy_button">'+ buttonString +'<div class="dummy_button"></div> </div> <img id="player_cover_art" src="images/cover-art/'+ url.AlbumId +'.png"  WIDTH="128" onerror="this.src=\'images/cover-art/-1.png\';" /> ');



        }
        Mm.hideLoading();
    }, "json");

    }

    this.updateVotes = function (VoteNr){
    
        buttonString = '';
        switch(VoteNr){
                                    case -1:
                                    {
                                        buttonString = '</div><div class="buton_queue_mid_1" onclick=\"MusicPlayer.playerVoteSong(0)\" ></div><div class="buton_queue_mid_2" onclick=\"MusicPlayer.playerVoteSong(1)\" ></div><div class="buton_queue_mid_3" onclick=\"MusicPlayer.playerVoteSong(2)\" ></div><div class="buton_queue_mid_4" onclick=\"MusicPlayer.playerVoteSong(3)\" ></div><div class="buton_queue_mid_5" onclick=\"MusicPlayer.playerVoteSong(4)\" ></div><div class="buton_queue_mid_6" onclick=UrlObject.redirect("#/reportSong/reportForm/' + url.SongId +'"); ></div>';
                                        break;
                                    }
                                    case 0:
                                    {
                                        buttonString = '</div><div class="buton_queue_mid_1_pressed" onclick=\"MusicPlayer.playerVoteSong(0)\" ></div><div class="buton_queue_mid_2" onclick=\"MusicPlayer.playerVoteSong(1)\" ></div><div class="buton_queue_mid_3" onclick=\"MusicPlayer.playerVoteSong(2)\" ></div><div class="buton_queue_mid_4" onclick=\"MusicPlayer.playerVoteSong(3)\" ></div><div class="buton_queue_mid_5" onclick=\"MusicPlayer.playerVoteSong(4)\" ></div><div class="buton_queue_mid_6" onclick=UrlObject.redirect("#/reportSong/reportForm/' + url.SongId +'"); ></div>';
                                        break;
                                    }
                                    case 1:
                                    {
                                        buttonString = '</div><div class="buton_queue_mid_1" onclick=\"MusicPlayer.playerVoteSong(0)\" ></div><div class="buton_queue_mid_2_pressed" onclick=\"MusicPlayer.playerVoteSong(1)\" ></div><div class="buton_queue_mid_3" onclick=\"MusicPlayer.playerVoteSong(2)\" ></div><div class="buton_queue_mid_4" onclick=\"MusicPlayer.playerVoteSong(3)\" ></div><div class="buton_queue_mid_5" onclick=\"MusicPlayer.playerVoteSong(4)\" ></div><div class="buton_queue_mid_6" onclick=UrlObject.redirect("#/reportSong/reportForm/' + url.SongId +'"); ></div>';
                                        break;
                                    }
                                    case 2:
                                    {
                                        buttonString = '</div><div class="buton_queue_mid_1" onclick=\"MusicPlayer.playerVoteSong(0)\" ></div><div class="buton_queue_mid_2" onclick=\"MusicPlayer.playerVoteSong(1)\" ></div><div class="buton_queue_mid_3_pressed" onclick=\"MusicPlayer.playerVoteSong(2)\" ></div><div class="buton_queue_mid_4" onclick=\"MusicPlayer.playerVoteSong(3)\" ></div><div class="buton_queue_mid_5" onclick=\"MusicPlayer.playerVoteSong(4)\" ></div><div class="buton_queue_mid_6" onclick=UrlObject.redirect("#/reportSong/reportForm/' + url.SongId +'"); ></div>';
                                        break;
                                    }
                                    case 3:
                                    {
                                        buttonString = '</div><div class="buton_queue_mid_1" onclick=\"MusicPlayer.playerVoteSong(0)\" ></div><div class="buton_queue_mid_2" onclick=\"MusicPlayer.playerVoteSong(1)\" ></div><div class="buton_queue_mid_3" onclick=\"MusicPlayer.playerVoteSong(2)\" ></div><div class="buton_queue_mid_4_pressed" onclick=\"MusicPlayer.playerVoteSong(3)\" ></div><div class="buton_queue_mid_5" onclick=\"MusicPlayer.playerVoteSong(4)\" ></div><div class="buton_queue_mid_6" onclick=UrlObject.redirect("#/reportSong/reportForm/' + url.SongId +'"); ></div>';
                                        break;
                                    }
                                    case 4:
                                    {
                                        buttonString = '</div><div class="buton_queue_mid_1" onclick=\"MusicPlayer.playerVoteSong(0)\" ></div><div class="buton_queue_mid_2" onclick=\"MusicPlayer.playerVoteSong(1)\" ></div><div class="buton_queue_mid_3" onclick=\"MusicPlayer.playerVoteSong(2)\" ></div><div class="buton_queue_mid_4" onclick=\"MusicPlayer.playerVoteSong(3)\" ></div><div class="buton_queue_mid_5_pressed" onclick=\"MusicPlayer.playerVoteSong(4)\" ></div><div class="buton_queue_mid_6 onclick=UrlObject.redirect("#/reportSong/reportForm/' + url.SongId +'"); "></div>';
                                        break;
                                    }
            }



            $("#player_middle_middle").html('<div class="song_container_buttons"><div class="dummy_button">'+ buttonString +'<div class="dummy_button"></div> </div> <img id="player_cover_art" src="images/cover-art/'+ url.AlbumId +'.png"  WIDTH="128" onerror="this.src=\'images/cover-art/-1.png\';" /> ');

    }

    this.play = function () {

        var sound = this.getFlashMovie("player");



        if (rightQueue.isEmpty() == false ) 
        {


                                if ( stateUrl == 1 ) url = rightQueue.remove();        

                                sound.playS("music/"+url.SongId+".mp3");
                                sound.changeVolumeS($('#VolumeSliderS').slider("value"));

                                

                                document.getElementById("PlayAnchor").onclick = function () { MusicPlayer.pause() };
                                $('#PlayAnchor').removeClass('play').addClass('pause')
                                        
                                        if(url.source == 1) {
                                            listenSource = 1;
                                        }
                                        else{
                                            listenSource = 0;
                                        }
                                        songHistory = { SongId: url.SongId , UserId: Mm.session.userId, source: listenSource };
                                        
                                          document.getElementById("NextAnchor").onclick = function () {  };
                                          document.getElementById("PreviousAnchor").onclick = function () {  };
                                          Mm.showLoading();
                                        $.post("PlayerSongHistory.ashx", songHistory, function (response) {
                                            if (Mm.checkAppState(response) == true) {
                                                
                                            }
                                            Mm.hideLoading();
                                            document.getElementById("NextAnchor").onclick = function () { MusicPlayer.finishedSong(0) };
                                            document.getElementById("PreviousAnchor").onclick = function () { MusicPlayer.previous() };
                                            
                                        }, "json");

                                        var buttonString = '</div><div class="buton_queue_mid_1" onclick=\"MusicPlayer.playerVoteSong(0)\" ></div><div class="buton_queue_mid_2" onclick=\"MusicPlayer.playerVoteSong(1)\" ></div><div class="buton_queue_mid_3" onclick=\"MusicPlayer.playerVoteSong(2)\" ></div><div class="buton_queue_mid_4" onclick=\"MusicPlayer.playerVoteSong(3)\" ></div><div class="buton_queue_mid_5" onclick=\"MusicPlayer.playerVoteSong(4)\" ></div><div class="buton_queue_mid_6" onclick=UrlObject.redirect("#/reportSong/reportForm/' + url.SongId +'"); ></div>';

                                switch(url.Vote){
                                    case -1:
                                    {
                                        buttonString = '</div><div class="buton_queue_mid_1" onclick=\"MusicPlayer.playerVoteSong(0)\" ></div><div class="buton_queue_mid_2" onclick=\"MusicPlayer.playerVoteSong(1)\" ></div><div class="buton_queue_mid_3" onclick=\"MusicPlayer.playerVoteSong(2)\" ></div><div class="buton_queue_mid_4" onclick=\"MusicPlayer.playerVoteSong(3)\" ></div><div class="buton_queue_mid_5" onclick=\"MusicPlayer.playerVoteSong(4)\" ></div><div class="buton_queue_mid_6" onclick=UrlObject.redirect("#/reportSong/reportForm/' + url.SongId +'"); ></div>';
                                        break;
                                    }
                                    case 0:
                                    {
                                        buttonString = '</div><div class="buton_queue_mid_1_pressed" onclick=\"MusicPlayer.playerVoteSong(0)\" ></div><div class="buton_queue_mid_2" onclick=\"MusicPlayer.playerVoteSong(1)\" ></div><div class="buton_queue_mid_3" onclick=\"MusicPlayer.playerVoteSong(2)\" ></div><div class="buton_queue_mid_4" onclick=\"MusicPlayer.playerVoteSong(3)\" ></div><div class="buton_queue_mid_5" onclick=\"MusicPlayer.playerVoteSong(4)\" ></div><div class="buton_queue_mid_6" onclick=UrlObject.redirect("#/reportSong/reportForm/' + url.SongId +'"); ></div>';
                                        break;
                                    }
                                    case 1:
                                    {
                                        buttonString = '</div><div class="buton_queue_mid_1" onclick=\"MusicPlayer.playerVoteSong(0)\" ></div><div class="buton_queue_mid_2_pressed" onclick=\"MusicPlayer.playerVoteSong(1)\" ></div><div class="buton_queue_mid_3" onclick=\"MusicPlayer.playerVoteSong(2)\" ></div><div class="buton_queue_mid_4" onclick=\"MusicPlayer.playerVoteSong(3)\" ></div><div class="buton_queue_mid_5" onclick=\"MusicPlayer.playerVoteSong(4)\" ></div><div class="buton_queue_mid_6" onclick=UrlObject.redirect("#/reportSong/reportForm/' + url.SongId +'"); ></div>';
                                        break;
                                    }
                                    case 2:
                                    {
                                        buttonString = '</div><div class="buton_queue_mid_1" onclick=\"MusicPlayer.playerVoteSong(0)\" ></div><div class="buton_queue_mid_2" onclick=\"MusicPlayer.playerVoteSong(1)\" ></div><div class="buton_queue_mid_3_pressed" onclick=\"MusicPlayer.playerVoteSong(2)\" ></div><div class="buton_queue_mid_4" onclick=\"MusicPlayer.playerVoteSong(3)\" ></div><div class="buton_queue_mid_5" onclick=\"MusicPlayer.playerVoteSong(4)\" ></div><div class="buton_queue_mid_6" onclick=UrlObject.redirect("#/reportSong/reportForm/' + url.SongId +'"); ></div>';
                                        break;
                                    }
                                    case 3:
                                    {
                                        buttonString = '</div><div class="buton_queue_mid_1" onclick=\"MusicPlayer.playerVoteSong(0)\" ></div><div class="buton_queue_mid_2" onclick=\"MusicPlayer.playerVoteSong(1)\" ></div><div class="buton_queue_mid_3" onclick=\"MusicPlayer.playerVoteSong(2)\" ></div><div class="buton_queue_mid_4_pressed" onclick=\"MusicPlayer.playerVoteSong(3)\" ></div><div class="buton_queue_mid_5" onclick=\"MusicPlayer.playerVoteSong(4)\" ></div><div class="buton_queue_mid_6" onclick=UrlObject.redirect("#/reportSong/reportForm/' + url.SongId +'"); ></div>';
                                        break;
                                    }
                                    case 4:
                                    {
                                        buttonString = '</div><div class="buton_queue_mid_1" onclick=\"MusicPlayer.playerVoteSong(0)\" ></div><div class="buton_queue_mid_2" onclick=\"MusicPlayer.playerVoteSong(1)\" ></div><div class="buton_queue_mid_3" onclick=\"MusicPlayer.playerVoteSong(2)\" ></div><div class="buton_queue_mid_4" onclick=\"MusicPlayer.playerVoteSong(3)\" ></div><div class="buton_queue_mid_5_pressed" onclick=\"MusicPlayer.playerVoteSong(4)\" ></div><div class="buton_queue_mid_6" onclick=UrlObject.redirect("#/reportSong/reportForm/' + url.SongId +'"); ></div>';
                                        break;
                                    }

                                }

                                $("#player_middle_middle").html('<div class="song_container_buttons"><div class="dummy_button">'+ buttonString +'<div class="dummy_button"></div> </div> <img id="player_cover_art" src="images/cover-art/'+ url.AlbumId +'.png"  WIDTH="128" onerror="this.src=\'images/cover-art/-1.png\';" /> ');
        
                                //$("#player_middle_middle").css('background-image', 'url(images/cover-art/'+ url.AlbumId +'.png)');

                                //$("#player_bottom_middle").html('<img style="display:none" src="images/cover-art/'+ url.AlbumId +'.png" onerror="document.getElementById(\'player_middle_middle\').style.backgroundImage=\'url(images/cover-art/-1.png)\'" />');

                                $("#player_bottom_middle").html(url.Artists + " <br/> " + url.SongName);
                                lyrics.changeContent(url.SongId);
                                suggestions.changeContent(url);
    }
    else if ( stateUrl == 2 ) 
    {

                                sound.playS("music/"+url.SongId+".mp3");
                                sound.changeVolumeS($('#VolumeSliderS').slider("value"));

                                document.getElementById("PlayAnchor").onclick = function () { MusicPlayer.pause() };
                                $('#PlayAnchor').removeClass('play').addClass('pause')
                                        

                                        if(url.source == 1) {
                                            listenSource = 1;
                                        }
                                        else{
                                            listenSource = 0;
                                        }
                                        songHistory = { SongId: url.SongId , UserId: Mm.session.userId, source: listenSource };
                                        
                                          document.getElementById("NextAnchor").onclick = function () {  };
                                          document.getElementById("PreviousAnchor").onclick = function () {  };
                                          Mm.showLoading();
                                        $.post("PlayerSongHistory.ashx", songHistory, function (response) {
                                            if (Mm.checkAppState(response) == true) {
                                                
                                            }
                                            Mm.hideLoading();
                                            document.getElementById("NextAnchor").onclick = function () { MusicPlayer.finishedSong(0) };
                                            document.getElementById("PreviousAnchor").onclick = function () { MusicPlayer.previous() };
                                            
                                        }, "json");

                                        var buttonString = '</div><div class="buton_queue_mid_1" onclick=\"MusicPlayer.playerVoteSong(0)\" ></div><div class="buton_queue_mid_2" onclick=\"MusicPlayer.playerVoteSong(1)\" ></div><div class="buton_queue_mid_3" onclick=\"MusicPlayer.playerVoteSong(2)\" ></div><div class="buton_queue_mid_4" onclick=\"MusicPlayer.playerVoteSong(3)\" ></div><div class="buton_queue_mid_5" onclick=\"MusicPlayer.playerVoteSong(4)\" ></div><div class="buton_queue_mid_6" onclick=UrlObject.redirect("#/reportSong/reportForm/' + url.SongId +'"); ></div>';

                                switch(url.Vote){
                                    case -1:
                                    {
                                        buttonString = '</div><div class="buton_queue_mid_1" onclick=\"MusicPlayer.playerVoteSong(0)\" ></div><div class="buton_queue_mid_2" onclick=\"MusicPlayer.playerVoteSong(1)\" ></div><div class="buton_queue_mid_3" onclick=\"MusicPlayer.playerVoteSong(2)\" ></div><div class="buton_queue_mid_4" onclick=\"MusicPlayer.playerVoteSong(3)\" ></div><div class="buton_queue_mid_5" onclick=\"MusicPlayer.playerVoteSong(4)\" ></div><div class="buton_queue_mid_6" onclick=UrlObject.redirect("#/reportSong/reportForm/' + url.SongId +'"); ></div>';
                                        break;
                                    }
                                    case 0:
                                    {
                                        buttonString = '</div><div class="buton_queue_mid_1_pressed" onclick=\"MusicPlayer.playerVoteSong(0)\" ></div><div class="buton_queue_mid_2" onclick=\"MusicPlayer.playerVoteSong(1)\" ></div><div class="buton_queue_mid_3" onclick=\"MusicPlayer.playerVoteSong(2)\" ></div><div class="buton_queue_mid_4" onclick=\"MusicPlayer.playerVoteSong(3)\" ></div><div class="buton_queue_mid_5" onclick=\"MusicPlayer.playerVoteSong(4)\" ></div><div class="buton_queue_mid_6" onclick=UrlObject.redirect("#/reportSong/reportForm/' + url.SongId +'"); ></div>';
                                        break;
                                    }
                                    case 1:
                                    {
                                        buttonString = '</div><div class="buton_queue_mid_1" onclick=\"MusicPlayer.playerVoteSong(0)\" ></div><div class="buton_queue_mid_2_pressed" onclick=\"MusicPlayer.playerVoteSong(1)\" ></div><div class="buton_queue_mid_3" onclick=\"MusicPlayer.playerVoteSong(2)\" ></div><div class="buton_queue_mid_4" onclick=\"MusicPlayer.playerVoteSong(3)\" ></div><div class="buton_queue_mid_5" onclick=\"MusicPlayer.playerVoteSong(4)\" ></div><div class="buton_queue_mid_6" onclick=UrlObject.redirect("#/reportSong/reportForm/' + url.SongId +'"); ></div>';
                                        break;
                                    }
                                    case 2:
                                    {
                                        buttonString = '</div><div class="buton_queue_mid_1" onclick=\"MusicPlayer.playerVoteSong(0)\" ></div><div class="buton_queue_mid_2" onclick=\"MusicPlayer.playerVoteSong(1)\" ></div><div class="buton_queue_mid_3_pressed" onclick=\"MusicPlayer.playerVoteSong(2)\" ></div><div class="buton_queue_mid_4" onclick=\"MusicPlayer.playerVoteSong(3)\" ></div><div class="buton_queue_mid_5" onclick=\"MusicPlayer.playerVoteSong(4)\" ></div><div class="buton_queue_mid_6" onclick=UrlObject.redirect("#/reportSong/reportForm/' + url.SongId +'"); ></div>';
                                        break;
                                    }
                                    case 3:
                                    {
                                        buttonString = '</div><div class="buton_queue_mid_1" onclick=\"MusicPlayer.playerVoteSong(0)\" ></div><div class="buton_queue_mid_2" onclick=\"MusicPlayer.playerVoteSong(1)\" ></div><div class="buton_queue_mid_3" onclick=\"MusicPlayer.playerVoteSong(2)\" ></div><div class="buton_queue_mid_4_pressed" onclick=\"MusicPlayer.playerVoteSong(3)\" ></div><div class="buton_queue_mid_5" onclick=\"MusicPlayer.playerVoteSong(4)\" ></div><div class="buton_queue_mid_6" onclick=UrlObject.redirect("#/reportSong/reportForm/' + url.SongId +'"); ></div>';
                                        break;
                                    }
                                    case 4:
                                    {
                                        buttonString = '</div><div class="buton_queue_mid_1" onclick=\"MusicPlayer.playerVoteSong(0)\" ></div><div class="buton_queue_mid_2" onclick=\"MusicPlayer.playerVoteSong(1)\" ></div><div class="buton_queue_mid_3" onclick=\"MusicPlayer.playerVoteSong(2)\" ></div><div class="buton_queue_mid_4" onclick=\"MusicPlayer.playerVoteSong(3)\" ></div><div class="buton_queue_mid_5_pressed" onclick=\"MusicPlayer.playerVoteSong(4)\" ></div><div class="buton_queue_mid_6" onclick=UrlObject.redirect("#/reportSong/reportForm/' + url.SongId +'"); ></div>';
                                        break;
                                    }

                                }

                                $("#player_middle_middle").html('<div class="song_container_buttons"><div class="dummy_button">'+ buttonString +'<div class="dummy_button"></div> </div> <img id="player_cover_art" src="images/cover-art/'+ url.AlbumId +'.png" alt="'+url.Album+'" title="'+url.Album+'" WIDTH="128" onerror="this.src=\'images/cover-art/-1.png\';" /> ');
        
                                //$("#player_middle_middle").css('background-image', 'url(images/cover-art/'+ url.AlbumId +'.png)');

                                //$("#player_bottom_middle").html('<img style="display:none" src="images/cover-art/'+ url.AlbumId +'.png" onerror="document.getElementById(\'player_middle_middle\').style.backgroundImage=\'url(images/cover-art/-1.png)\'" />');

                                $("#player_bottom_middle").html(url.Artists + " <br/> " + url.SongName);
                                lyrics.changeContent(url.SongId);
                                suggestions.changeContent(url);



    }

    }

    this.getSongId = function () {
        if(url!=null)
            if(url.SongId !=null){
                return url.SongId;
            }
        return null;
    }

    this.getSongObj = function () {
        if(url!=null)
            if(url.SongId !=null){
                return url;
            }
        return null;
    }

    this.replayButton = function () {

    if ( stateRepeat == 0 ) 
    {
    stateRepeat = 1;
    $('#ReplayAnchor').removeClass('replay').addClass('replayActive')
     }
    else {stateRepeat = 0;
    $('#ReplayAnchor').removeClass('replayActive').addClass('replay')
    }


    }

    this.replay = function () {
        
        var sound = MusicPlayer.getFlashMovie("player");
        sound.playSliderS(1);

        if (url.source == 1) {
            listenSource = 1;
        }
        else {
            listenSource = 0;
        }
        songHistory = { SongId: url.SongId, UserId: Mm.session.userId, source: listenSource };

        document.getElementById("NextAnchor").onclick = function () { };
        document.getElementById("PreviousAnchor").onclick = function () { };
        Mm.showLoading();
        $.post("PlayerSongHistory.ashx", songHistory, function (response) {
            if (Mm.checkAppState(response) == true) {

            }
            Mm.hideLoading();
            document.getElementById("NextAnchor").onclick = function () { MusicPlayer.finishedSong(0) };
            document.getElementById("PreviousAnchor").onclick = function () { MusicPlayer.previous() };

        }, "json");
        
//        stateUrl = 2 ;
//        this.stop();
//        stateUrl = 1 ;

//        var sound = this.getFlashMovie("player");
//        sound.playS("music/"+url.SongId+".mp3");

        document.getElementById("PlayAnchor").onclick = function () { MusicPlayer.pause() };
        $('#PlayAnchor').removeClass('play').addClass('pause')

    }

    this.stop = function () {

        var sound = this.getFlashMovie("player");
        sound.stopS();
        $("#SeekSliderS").slider("value", [1]);
        //if ( stateUrl == 1 ) leftQueue.add(url);
        stateUrl = 2;

        document.getElementById("PlayAnchor").onclick = function () { MusicPlayer.play() };       
        $('#PlayAnchor').removeClass('pause').addClass('play')

      //  $("#player_middle_middle").html('');
      //   $("#player_middle_middle").css('background-image','');
    }

    this.pause = function () {

        var sound = this.getFlashMovie("player");
        sound.pauseS();

        document.getElementById("PlayAnchor").onclick = function () { MusicPlayer.pausePlay() };
     
      $('#PlayAnchor').removeClass('pause').addClass('play')


    }

    this.pausePlay = function () { // resume la cantec din pauza
        var sound = this.getFlashMovie("player");
        sound.pausePlayS();

        document.getElementById("PlayAnchor").onclick = function () { MusicPlayer.pause() };
    
      $('#PlayAnchor').removeClass('play').addClass('pause')
    }

    this.showTimer = function (str) { // modifica slider-ul de timming (seek-bar la melodie ) direct din flash
        //  document.getElementById("TextArea2").value = str;
        $("#SeekSliderS").slider("value", str);
        aux_min = Math.floor(str / 60000);
        aux_sec = Math.floor (Math.floor(str % 60000)/1000);

        $("#player_current_seconds").html(aux_min +":" +aux_sec);
    }

    this.flushPlayer = function () {
        this.stop();
        url = null;
        stateRepeat = 0;
        $("#player_middle_middle").html("");        
        $("#player_bottom_middle").html("");
    }

    this.finishedSong = function (caller) { // se apeleaza din flash atunci cand se termina cantecul curent            
        // document.getElementById("TextArea2").value = "s-a terminat cantecul";

        if (caller == 1) if (stateRepeat == 1) { this.replay(); return; }

        if (rightQueue.isEmpty() == false) {
            if (url != undefined) {
                leftQueue.add(url);
                this.stop();
                stateUrl = 1;
            }
            this.play();
        } else {
            this.stop();           
        }



        //  document.getElementById("PlayAnchor").onclick = function () { MusicPlayer.play() };
        //  document.getElementById("PlayImg").src = "play.jpg";
        // $('#PlayAnchor').removeClass('pause').addClass('play')

    }

    this.previous = function () {
        
        if ( leftQueue.isEmpty() == false ) {
                                          if (url != undefined ) {rightQueue.add(url,0);
                                                             //    stateUrl = 2 ;
                                                                 this.stop();
                                                                 stateUrl = 1 ;
                                                                 url = leftQueue.remove(); 
                                                                 rightQueue.add(url,0);
                                                                 }
                                             this.play();
                                            }
    
    }

}

var MusicPlayer = new PlayerClass();



////////////////////// Astea sunt direct de la flash - don't mess with it ////////////////////////////////

//<!-- Adobe recommends that developers use SWFObject2 for Flash Player detection. -->
//			<!-- For more information see the SWFObject page at Google code (http://code.google.com/p/swfobject/). -->
//			<!-- Information is also available on the Adobe Developer Connection Under "Detecting Flash Player versions and embedding SWF files with SWFObject 2" -->
//			<!-- Set to minimum required Flash Player version or 0 for no version detection -->
//			var swfVersionStr = "10.0.2";
//			<!-- xiSwfUrlStr can be used to define an express installer SWF. -->
//			var xiSwfUrlStr = "";
//			var flashvars = {};
//			var params = {};
//			params.quality = "high";
//			params.bgcolor = "#ffffff";
//			params.play = "true";
//			params.loop = "true";
//			params.wmode = "window";
//			params.scale = "showall";
//			params.menu = "true";
//			params.devicefont = "false";
//			params.salign = "";
//			params.allowscriptaccess = "sameDomain";
//			var attributes = {};
//			attributes.id = "player";
//			attributes.name = "player";
//			attributes.align = "middle";
//			swfobject.createCSS("html", "height:100%; background-color: #ffffff;");
//			swfobject.createCSS("body", "margin:0; padding:0; overflow:hidden; height:100%;");
//			swfobject.embedSWF(
//				"player.swf", "flashContent",
//				"1", "1",
//				swfVersionStr, xiSwfUrlStr,
//				flashvars, params, attributes);


//<!--
        //v1.7
        // Flash Player Version Detection
        // Detect Client Browser type
        // Copyright 2005-2008 Adobe Systems Incorporated.  All rights reserved.
        var isIE = (navigator.appVersion.indexOf("MSIE") != -1) ? true : false;
        var isWin = (navigator.appVersion.toLowerCase().indexOf("win") != -1) ? true : false;
        var isOpera = (navigator.userAgent.indexOf("Opera") != -1) ? true : false;
        function ControlVersion() {
            var version;
            var axo;
            var e;
            // NOTE : new ActiveXObject(strFoo) throws an exception if strFoo isn't in the registry
            try {
                // version will be set for 7.X or greater players
                axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");
                version = axo.GetVariable("$version");
            } catch (e) {
            }
            if (!version) {
                try {
                    // version will be set for 6.X players only
                    axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");

                    // installed player is some revision of 6.0
                    // GetVariable("$version") crashes for versions 6.0.22 through 6.0.29,
                    // so we have to be careful. 

                    // default to the first public version
                    version = "WIN 6,0,21,0";
                    // throws if AllowScripAccess does not exist (introduced in 6.0r47)		
                    axo.AllowScriptAccess = "always";
                    // safe to call for 6.0r47 or greater
                    version = axo.GetVariable("$version");
                } catch (e) {
                }
            }
            if (!version) {
                try {
                    // version will be set for 4.X or 5.X player
                    axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.3");
                    version = axo.GetVariable("$version");
                } catch (e) {
                }
            }
            if (!version) {
                try {
                    // version will be set for 3.X player
                    axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.3");
                    version = "WIN 3,0,18,0";
                } catch (e) {
                }
            }
            if (!version) {
                try {
                    // version will be set for 2.X player
                    axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
                    version = "WIN 2,0,0,11";
                } catch (e) {
                    version = -1;
                }
            }

            return version;
        }
        // JavaScript helper required to detect Flash Player PlugIn version information
        function GetSwfVer() {
            // NS/Opera version >= 3 check for Flash plugin in plugin array
            var flashVer = -1;

            if (navigator.plugins != null && navigator.plugins.length > 0) {
                if (navigator.plugins["Shockwave Flash 2.0"] || navigator.plugins["Shockwave Flash"]) {
                    var swVer2 = navigator.plugins["Shockwave Flash 2.0"] ? " 2.0" : "";
                    var flashDescription = navigator.plugins["Shockwave Flash" + swVer2].description;
                    var descArray = flashDescription.split(" ");
                    var tempArrayMajor = descArray[2].split(".");
                    var versionMajor = tempArrayMajor[0];
                    var versionMinor = tempArrayMajor[1];
                    var versionRevision = descArray[3];
                    if (versionRevision == "") {
                        versionRevision = descArray[4];
                    }
                    if (versionRevision[0] == "d") {
                        versionRevision = versionRevision.substring(1);
                    } else if (versionRevision[0] == "r") {
                        versionRevision = versionRevision.substring(1);
                        if (versionRevision.indexOf("d") > 0) {
                            versionRevision = versionRevision.substring(0, versionRevision.indexOf("d"));
                        }
                    }
                    var flashVer = versionMajor + "." + versionMinor + "." + versionRevision;
                }
            }
            // MSN/WebTV 2.6 supports Flash 4
            else if (navigator.userAgent.toLowerCase().indexOf("webtv/2.6") != -1) flashVer = 4;
            // WebTV 2.5 supports Flash 3
            else if (navigator.userAgent.toLowerCase().indexOf("webtv/2.5") != -1) flashVer = 3;
            // older WebTV supports Flash 2
            else if (navigator.userAgent.toLowerCase().indexOf("webtv") != -1) flashVer = 2;
            else if (isIE && isWin && !isOpera) {
                flashVer = ControlVersion();
            }
            return flashVer;
        }
        // When called with reqMajorVer, reqMinorVer, reqRevision returns true if that version or greater is available
        function DetectFlashVer(reqMajorVer, reqMinorVer, reqRevision) {
            versionStr = GetSwfVer();
            if (versionStr == -1) {
                return false;
            } else if (versionStr != 0) {
                if (isIE && isWin && !isOpera) {
                    // Given "WIN 2,0,0,11"
                    tempArray = versionStr.split(" "); 	// ["WIN", "2,0,0,11"]
                    tempString = tempArray[1]; 		// "2,0,0,11"
                    versionArray = tempString.split(","); // ['2', '0', '0', '11']
                } else {
                    versionArray = versionStr.split(".");
                }
                var versionMajor = versionArray[0];
                var versionMinor = versionArray[1];
                var versionRevision = versionArray[2];
                // is the major.revision >= requested major.revision AND the minor version >= requested minor
                if (versionMajor > parseFloat(reqMajorVer)) {
                    return true;
                } else if (versionMajor == parseFloat(reqMajorVer)) {
                    if (versionMinor > parseFloat(reqMinorVer))
                        return true;
                    else if (versionMinor == parseFloat(reqMinorVer)) {
                        if (versionRevision >= parseFloat(reqRevision))
                            return true;
                    }
                }
                return false;
            }
        }
        function AC_AddExtension(src, ext) {
            if (src.indexOf('?') != -1)
                return src.replace(/\?/, ext + '?');
            else
                return src + ext;
        }
        function AC_Generateobj(objAttrs, params, embedAttrs) {
            var str = '';
            if (isIE && isWin && !isOpera) {
                str += '<object ';
                for (var i in objAttrs) {
                    str += i + '="' + objAttrs[i] + '" ';
                }
                str += '>';
                for (var i in params) {
                    str += '<param name="' + i + '" value="' + params[i] + '" /> ';
                }
                str += '</object>';
            }
            else {
                str += '<embed ';
                for (var i in embedAttrs) {
                    str += i + '="' + embedAttrs[i] + '" ';
                }
                str += '> </embed>';
            }
            document.write(str);
        }
        function AC_FL_RunContent() {
            var ret =
    AC_GetArgs
    (arguments, ".swf", "movie", "clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"
     , "application/x-shockwave-flash"
    );
            AC_Generateobj(ret.objAttrs, ret.params, ret.embedAttrs);
        }
        function AC_SW_RunContent() {
            var ret =
    AC_GetArgs
    (arguments, ".dcr", "src", "clsid:166B1BCA-3F9C-11CF-8075-444553540000"
     , null
    );
            AC_Generateobj(ret.objAttrs, ret.params, ret.embedAttrs);
        }
        function AC_GetArgs(args, ext, srcParamName, classid, mimeType) {
            var ret = new Object();
            ret.embedAttrs = new Object();
            ret.params = new Object();
            ret.objAttrs = new Object();
            for (var i = 0; i < args.length; i = i + 2) {
                var currArg = args[i].toLowerCase();
                switch (currArg) {
                    case "classid":
                        break;
                    case "pluginspage":
                        ret.embedAttrs[args[i]] = args[i + 1];
                        break;
                    case "src":
                    case "movie":
                        args[i + 1] = AC_AddExtension(args[i + 1], ext);
                        ret.embedAttrs["src"] = args[i + 1];
                        ret.params[srcParamName] = args[i + 1];
                        break;
                    case "onafterupdate":
                    case "onbeforeupdate":
                    case "onblur":
                    case "oncellchange":
                    case "onclick":
                    case "ondblclick":
                    case "ondrag":
                    case "ondragend":
                    case "ondragenter":
                    case "ondragleave":
                    case "ondragover":
                    case "ondrop":
                    case "onfinish":
                    case "onfocus":
                    case "onhelp":
                    case "onmousedown":
                    case "onmouseup":
                    case "onmouseover":
                    case "onmousemove":
                    case "onmouseout":
                    case "onkeypress":
                    case "onkeydown":
                    case "onkeyup":
                    case "onload":
                    case "onlosecapture":
                    case "onpropertychange":
                    case "onreadystatechange":
                    case "onrowsdelete":
                    case "onrowenter":
                    case "onrowexit":
                    case "onrowsinserted":
                    case "onstart":
                    case "onscroll":
                    case "onbeforeeditfocus":
                    case "onactivate":
                    case "onbeforedeactivate":
                    case "ondeactivate":
                    case "type":
                    case "codebase":
                    case "id":
                        ret.objAttrs[args[i]] = args[i + 1];
                        break;
                    case "width":
                    case "height":
                    case "align":
                    case "vspace":
                    case "hspace":
                    case "class":
                    case "title":
                    case "accesskey":
                    case "name":
                    case "tabindex":
                        ret.embedAttrs[args[i]] = ret.objAttrs[args[i]] = args[i + 1];
                        break;
                    default:
                        ret.embedAttrs[args[i]] = ret.params[args[i]] = args[i + 1];
                }
            }
            ret.objAttrs["classid"] = classid;
            if (mimeType) ret.embedAttrs["type"] = mimeType;
            return ret;
        }
// -->