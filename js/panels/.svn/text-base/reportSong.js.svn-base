function ReportSongClass() {

    this.__load = function () {
        Panels.add(panelReportSong);
        Panels.extend('reportSong');

    }

    this.index = function () { 

    }

    this.reportForm = function (songId) {

        var text_html = "";
        text_html += " <table><tr class='row'><td>Type</td><td><input type='text' id='type_box' maxlength='10'/></td><td></td></tr>";
        text_html += "<tr class='row'><td>Comments</td><td><form name='myform'><textarea class='row' id='comment_box' name='limitedtextarea' onKeyDown='reportSong.limitText(this.form.limitedtextarea,this.form.countdown,250);'onKeyUp='reportSong.limitText(this.form.limitedtextarea,this.form.countdown,250);'></textarea><br><font size='1'>(Maximum characters: 250)<br>You have <input readonly type='text' name='countdown' size='3' value='250'> characters left.</font></form></td><td></td></tr>";
        text_html += "<tr class='row'><td></td><td></td><td><a id='ReportAnchor' href='javascript:void(0)' class='button' onclick='reportSong.reportSubmit(" + songId + ");'>Report</a></td></tr> </table>";


        $('#report_content_extended').html(text_html);


    }

    this.reportSubmit = function (songId) {

        songOb = { SongId: songId , Type:  Mm.sanitizeString( document.getElementById("type_box").value ) , Comment : Mm.sanitizeString( document.getElementById("comment_box").value )  };

        Mm.showLoading();

        $.post("ReportSong.ashx", songOb, function (response) {
            if (Mm.checkAppState(response) == true) {

                Mm.hideLoading();
                Panels.close("reportSong");
            }
        }, "json");

    }


    this.limitText = function (limitField, limitCount, limitNum) {
        if (limitField.value.length > limitNum) {
            limitField.value = limitField.value.substring(0, limitNum);
        } else {
            limitCount.value = limitNum - limitField.value.length;
        }
    }


};

var reportSong = null;
var panelReportSong = new Panel('Report Song', 'reportSong');
panelReportSong.setExtendedHtml('<div id="report_content_extended" class="scroll_vertical"> No song selected </div>');

panelReportSong.setCompactedHtml('<div id="report_content_compacted" class="scroll_vertical"> </div>');