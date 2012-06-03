function ModeratorClass() {

    this.__load = function () {
        Panels.add(panelModerator);
        Panels.extend('moderator');
        if (Mm.session.isModerator == "True")
            this.loadReportedMessagesGridview();
        else {
            var text_html = "You have to be a moderator to visualize this page.";
            $("#reportedMessages_gridview_container").html(text_html);
            $("#reportedMessages_gridview_container_smaller").html(text_html);

        }
    }



    reportedMessagesColumnArray = [{ columnId: 'senderEmail', columnTitle: 'Sender Email' }, { columnId: 'bodyMessage', columnTitle: 'Message' }, { columnId: 'goToPage', columnTitle: 'Go to' }, { columnId: 'action1', columnTitle: 'Delete Message' }, { columnId: 'action2', columnTitle: 'Delete Report'}];
    reportedMessagesDataAray = [] ;



    // populeaza gridview-ul reportedMessagesGridview cu detalii despre mesajele reportate
    this.loadReportedMessagesGridview = function () {
        if (Mm.session.isModerator == "True") {
            $.post("ModeratorPanel.ashx", {}, function (response) {
                if (Mm.checkAppState(response) == true) {
                    reportedMessagesDataArray = [];
                    if (response != undefined) {
                        for (i = 0; i < response.length; i++) {

                            reportedMessagesDataArray[i] = { senderEmail: response[i].Message.Sender.Email, bodyMessage: response[i].Message.Body, goToPage: { content: '<a href="#/friends/shoutbox/' + response[i].Message.Receiver.UserId + '">Go to Shoutbox</a>', type: 'html' }, action1: { id: "DeleteMessageButton", content: 'Delete', type: 'button', callback: 'moderator/_deleteMessage/' + response[i].Message.MessageId + '' }, action2: { id: "DeleteMessageReportButton", content: 'Delete', type: 'button', callback: 'moderator/_deleteMessageReport/' + response[i].Message.MessageId + ''} };
                        }
                    }


                    if (response.length != 0) {
                        reportedMessagesGridview = new Gridview(reportedMessagesColumnArray, reportedMessagesDataArray, 'reportedMessages_gridview');
                        $("#reportedMessages_gridview_container").html(reportedMessagesGridview.getGridviewHtml());
                        reportedMessagesGridview.activate();
                        var text_html = "There are <b>" + response.length + "</b> reported messages! <br />";
                        text_html += "Extend panel for more details.";
                        $("#reportedMessages_gridview_container_smaller").html(text_html);
                    }
                    //daca nu exista mesaje reportate
                    else {
                        $("#reportedMessages_gridview_container").html("There are no reported messages!");
                        $("#reportedMessages_gridview_container_smaller").html("There are no reported messages!");
                    }

                }
            }, "json");
        }
    }

    
    this.index = function () {
    }


    this.__panelAdded = function () {
    }


    // aceasta functie realizeaza stergerea mesajului cu id-ul messId
    this._deleteMessage = function (messId) {
        if (Mm.session.isModerator == "True")
        {
            mesajJson = { MessageId: messId };
            Mm.showLoading();
            $.post("ModeratorMessageDelete.ashx", mesajJson, function (response) {

                if (Mm.checkAppState(response) == true) {
                    //dupa stergerea unei melodii actualizeaza gridview-ul ce contine mesajele raportate
                    moderator.loadReportedMessagesGridview();

                }
                Mm.hideLoading();
            });
        }
        else 
        {
            var text_html = "You have to be a moderator to visualize this page.";
            $("#reportedMessages_gridview_container").html(text_html);
            $("#reportedMessages_gridview_container_smaller").html(text_html);

        }



    }


    // aceasta functie realizeaza stergerea mesajului cu id-ul messId
    this._deleteMessageReport = function (messId) {
        if (Mm.session.isModerator == "True")
        {
            mesajJson = { MessageId: messId };
            Mm.showLoading();
            $.post("ModeratorDeleteMessageReport.ashx", mesajJson, function (response) {

                if (Mm.checkAppState(response) == true) {
                    //dupa stergerea unei melodii actualizeaza gridview-ul ce contine mesajele raportate
                    moderator.loadReportedMessagesGridview();

                }
                Mm.hideLoading();
            });
        }
        else {
            var text_html = "You have to be a moderator to visualize this page.";
            $("#reportedMessages_gridview_container").html(text_html);
            $("#reportedMessages_gridview_container_smaller").html(text_html);

        }



    }


}



var moderator = null;

var panelModerator = new Panel('Moderator', 'moderator');

panelModerator.setExtendedHtml(' <div id="reportedMessages_gridview_container"> </div>');

panelModerator.setCompactedHtml('<div id="reportedMessages_gridview_container_smaller"></div>');