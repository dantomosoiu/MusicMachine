function LyricsClass() {

    this.__load = function () {
        Panels.add(panelLyrics);
        Panels.extend('lyrics');
        
    }

    this.index = function () {
        // verific daca songid e undefined sau null ( daca nu s-a dat play la vreo melodie )
        if (MusicPlayer.getSongObj() != null) this.changeContent(MusicPlayer.getSongId());
        else {
            $('#lyric_content_extended').html("No song playing");
            $('#lyric_content_compacted').html("No song playing");
        }
    }

    this.changeContent = function (songId) {

        songOb = { SongId: songId };

        Mm.showLoading();
        $.post("LyricsPanel.ashx", songOb, function (response) {
            if (Mm.checkAppState(response) == true) {
                song_lyrics = response.SongLyrics;
                song_lyrics = song_lyrics.replace(/\n/gi, "<br />");
                text_html = response.Artists + " - " + response.SongName + "<br /><br />" + song_lyrics;

                $('#lyric_content_extended').html(text_html);
                $('#lyric_content_compacted').html(text_html);
                Mm.hideLoading();
            }
        }, "json");

    }

};

var lyrics = null;
var panelLyrics = new Panel('Lyrics', 'lyrics');
panelLyrics.setExtendedHtml('<div id="lyric_content_extended" class="scroll_vertical">  </div>');


panelLyrics.setCompactedHtml('<div id="lyric_content_compacted" class="scroll_vertical"> </div>');