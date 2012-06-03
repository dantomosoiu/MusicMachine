function HomeClass() {

    this.__load = function () {
        Panels.extend('home');
        this.getLatestNews(Mm.session.userId);
    }

    this.index = function () {

    }

    this.__panelAdded = function () {
        var links = '';
        if (Mm.session.isModerator == "True" || Mm.session.isUploader == "True" || Mm.session.isAdmin == "True") {
            links = '<h4>Manage Web Application</h4><ul>';
            if (Mm.session.isAdmin == "True") {
                links += "<li><a href='Administrator.aspx'>Administrator</a></li>";
            }
            if (Mm.session.isUploader == "True") {
                links += "<li><a href='#/upload'>Uploader</a></li>";
            }
            if (Mm.session.isModerator == "True") {
                links += "<li><a href='#/moderator'>Moderator</a></li>";
            }
            links += '</ul>';
            $('#home_compacted_specialusers').html(links);
            $('#home_extended_specialusers').html(links);
            Panels.fixCompactedLinks('home');
        }
    }

    this._showup = function(x, content) {
        document.getElementById(x).innerHTML = content + ' <br /> ' +
        '<a href="#/myprofile">View shoutbox</div>';
    }

    this.addToQueue = function(position) {
        rightQueue.add(this.results[position]);
    }

    this.acceptFriendRequest = function (friendId) {
        Mm.showLoading();
        $.post("FriendsAcceptRequest.ashx", { friendId: friendId }, function (data) {
            Mm.hideLoading();
            home.getLatestNews(Mm.session.userId);
        }); 
    }

    this.declineFriendRequest = function(friendId) {
        Mm.showLoading();
        $.post("FriendsIgnoreFriend.ashx", { friendId: friendId }, function (data) {
            Mm.hideLoading();
            home.getLatestNews(Mm.session.userId);
        });
    }

    this.results = [];

    // aceasta functie trebuie apelata cu id-ul user-ului curent de fiecare data cand se da click pe Home panel
    this.getLatestNews = function (User_Id) {
        Mm.showLoading();
        $.post("LatestNews.ashx", { UserId: User_Id }, function (response) {
            if (Mm.checkAppState(response) == true) {
                var text_html = '';
                var j = 0;
                var senderId;
                var receiverId;
                for (i = 0; i < response.length; i++) {
                    var eventType = response[i].EventType;
                    var eventDate = response[i].EventDate;

                    if (eventType == "friend_request") {
                        // construiesc o intrare in Latest News de tip cerere de prietenie
                        var status = response[i].Event.Status;
                        var friendId = response[i].Event.Sender.UserId;
                        // id-ul userului care a facut cererea de prietenie
                        if (status == "accepted") {
                            //daca cererea a fost acceptata
                            text_html += '<div class = "latestNewsEntryTitle_container" >\n ';
                            text_html += 'Friend request accepted ' + eventDate + '</div>';
                            text_html += '<div class = "latestNewsEntryBody_container" >\n ';
                            text_html += 'You are now friends with <a href="#/friends/personalInfo/' + friendId + '" >' +
                                response[i].Event.Sender.FirstName + ' ' + response[i].Event.Sender.LastName + '</a>' +
                                '<br /> <a href="#/friends/personalInfo/' + friendId + '" >View profile</a> </div>';
                        }
                        else {
                            //cererea este in starea pending
                            senderId = response[i].Event.Sender.UserId;
                            text_html += '<div class = "latestNewsEntryTitle_container" >\n ';
                            text_html += 'Friend request pending ' + eventDate + '</div>';
                            text_html += '<div class = "latestNewsEntryBody_container" >\n ';
                            text_html += '<a href="#/friends/personalInfo/' + friendId + '" >' +
                                response[i].Event.Sender.FirstName + ' ' + response[i].Event.Sender.LastName +
                                '</a> sent you a friend request<br /> ' +
                                '<a href="#/friends/personalInfo/' + friendId + '" >View profile</a> - ' +
                                '<a href="javascript:home.acceptFriendRequest(' + senderId + ')">Accept</a> - ' +
                                '<a href="javascript:home.declineFriendRequest(' + senderId + ')">Decline</a> </div>';
                        }
                    }
                    else
                        if (eventType == "recommendation") {
                            // construiesc o intrare in Latest News de tip recomandarea unei melodii
                            j++;
                            home.results[j] = response[i].Event.Song;
                            receiverId = response[i].Event.Receiver.UserId; // id-ul celui caruia i-a fost recomandata piesa
                            senderId = response[i].Event.Sender.UserId; //id-ul celui care a recomandat piesa
                            text_html += '<div class = "latestNewsEntryTitle_container" >\n ';

                            if (receiverId == User_Id) {
                                text_html += '<a href="#/friends/personalInfo/' + senderId + '" >' +
                                response[i].Event.Sender.FirstName + ' ' + response[i].Event.Sender.LastName +
                                '</a> recommended you a song ' + eventDate + ' </div> ';
                                text_html += '<div class = "latestNewsEntryBody_container" >\n ' +
                                response[i].Event.Song.Artists + ' - ' + response[i].Event.Song.SongName +
                                '<br /> <a href="javascript:home.addToQueue(' + j + ')">Add to queue</a> ';
                            }
                            else {
                                text_html += '<a href="#/friends/personalInfo/' + senderId + '" >' +
                                response[i].Event.Sender.FirstName + ' ' + response[i].Event.Sender.LastName + '</a> recommended ' +
                                '<a href="#/friends/personalInfo/' + receiverId + '" >' + response[i].Event.Receiver.FirstName + ' '
                                 + response[i].Event.Receiver.LastName + '</a>' +
                                ' a song ' + eventDate + ' </div> ';
                                text_html += '<div class = "latestNewsEntryBody_container" >\n ' +
                                response[i].Event.Song.Artists + ' - ' + response[i].Event.Song.SongName +
                                '<br /> <a href="javascript:home.addToQueue(' + j + ')">Add to queue</a> ';
                            }
                            text_html += '</div>';
                        }
                        else
                            if (eventType == "shoutbox_message") {
                                //construiesc o intrare de tip shoutbox message
                                senderId = response[i].Event.Sender.UserId; //id-ul celui care a postat pe shoutbox
                                text_html += '<div class = "latestNewsEntryTitle_container" >\n ';
                                text_html += '<a href="#/friends/personalInfo/' + senderId + '" >' +
                                response[i].Event.Sender.FirstName + ' ' + response[i].Event.Sender.LastName + '</a> ' +
                                'posted on your shoutbox ' + response[i].EventDate + ' </div>';
                                text_html += '<div class = "latestNewsEntryBody_container" >';
                                if (response[i].Event.Body.length <= 60) {
                                    text_html += response[i].Event.Body + '<br /> <a href="#/myprofile">View shoutbox</a> </span> </div>';
                                }
                                else {

                                    //added by bitza, content e undefined si incerc sa ocolesc o eroare

                                    if (typeof content === "undefined") {
                                     text_html += '<span id = "' + i + '" > ' + response[i].Event.Body.substring(0, 60) + ' ... <br /> ' +
                                    '<a href="javascript:home._showup(' + i + ', \'' + '\')">View message</a> - ' +
                                    '<a href="#/myprofile">View shoutbox</a> </span> </div>';
                                    }
                                    else {
                                     text_html += '<span id = "' + i + '" > ' + response[i].Event.Body.substring(0, 60) + ' ... <br /> ' +
                                    '<a href="javascript:home._showup(' + i + ', \'' + content + '\')">View message</a> - ' +
                                    '<a href="#/myprofile">View shoutbox</a> </span> </div>';
                                    }
                                    
                                }
                            }
                }
                $('#home_latestnews').html(text_html);
                Mm.hideLoading();
            }
        }, 'json');
    }

    this.getLatestNews(Mm.session.userId);
}

var home = null;
var panelHome = new Panel('Home', 'home', false);

panelHome.setExtendedHtml('<table class = "home_container"> \
                                <tr> \
                                    <td class = "home_menu_container" > \
                                        <div class="column"> \
                                        <h4>Social</h4>\n\
								        <ul>\n\
									        <li><a href="#/myprofile">My Profile</a></li>\n\
									        <li><a href="#/friends">Friends</a></li>\n\
								        </ul>\n\
								        <h4>Music</h4>\n\
								        <ul>\n\
									        <li><a href="#/topmusic">Top Music</a></li>\n\
									        <li><a href="#/suggestions">Suggestions</a></li>\n\
									        <li><a href="#/lyrics">Lyrics</a></li>\n\
								        </ul><div id="home_extended_specialusers"></div></div> \
                                    </td>\n\
								    <td class = "home_latestnews_container" >  \
                                        <div class = "latestnewsTitle_container"><h4>Latest news</h4> </div>\
                                        <div class="scroll_vertical">\n\
                                        <div id="home_latestnews"> \
                                            \
                                        </div>\n\
                                        </div> \
                                    </td> </tr> </table>\n\
');

panelHome.setCompactedHtml('<h4>Social</h4>\n\
								<ul>\n\
									<li><a href="#/myprofile">My Profile</a></li>\n\
									<li><a href="#/friends">Friends</a></li>\n\
								</ul>\n\
								<h4>Music</h4>\n\
								<ul>\n\
									<li><a href="#/topmusic">Top Music</a></li>\n\
									<li><a href="#/suggestions">Suggestions</a></li>\n\
									<li><a href="#/lyrics">Lyrics</a></li>\n\
								</ul><div id="home_compacted_specialusers"></div>\n\
');