MyprofileClass = function () {

    this.__panelAdded = function () {

        Mm.showLoading();
        this.waitForLoad = true;
        $.post("MyProfileInfo.ashx", function (data) {
            Mm.hideLoading();
            if (Mm.checkAppState(data) != true) return;
            if (data == "false") {

            } else {

            }
            extendedHtml = '<div id="myprofile">\n\
	        <h3 id="myprofile_header"><img src="images/user-24.png" alt=""><span id="myprofile_userTitle"></span></h3>\n\
            <div  class="scroll_vertical">\n\
				<div class="button_toolbar myprofile_showPersonalInfo">\n\
					<a href="#/myprofile/showPersonalInfo">Show Personal Info</a>\n\
                </div>\n\
				<div class="button_toolbar myprofile_hidePersonalInfo" style="display:none">\n\
					<a href="#/myprofile">Hide Personal Info</a>\n\
				</div>\n\
				<div id="myprofile_personalInfo" style="display: none">\n\
					<h3>Personal Info</h3>\n\
					<div class="button_toolbar myprofile_editInfo">\n\
						<a href="javascript:void(0)" onclick="myprofile.toggleEditInfo()">Edit info</a>\n\
					</div>\n\
					<div class="button_toolbar myprofile_editInfo" style="display: none">\n\
						<a href="javascript:void(0)" onclick="myprofile.saveProfile()">Save</a>\n\
						<a href="javascript:void(0)" onclick="myprofile.cancelProfile()">Cancel</a>\n\
					</div>\n\
					<table border="0" cellspacing="0" cellpadding="0" id="myprofile_infoTable">\n\
						<tr>\n\
							<td>First name:</td>\n\
							<td>\n\
								<span class="myprofile_firstname myprofile_info"></span>\n\
								<input class="myprofile_firstname myprofile_input" type="text" value="" style="display: none"/>\n\
							</td>\n\
						</tr>\n\
						<tr>\n\
							<td>Last name:</td>\n\
							<td>\n\
								<span class="myprofile_lastname myprofile_info"></span>\n\
								<input class="myprofile_lastname myprofile_input" type="text" value="" style="display:none"/>\n\
							</td>\n\
						</tr>\n\
						<tr>\n\
							<td>E-mail:</td>\n\
							<td><span  class="myprofile_email"></span></td>\n\
						</tr>\n\
						<tr>\n\
							<td>Sex:</td>\n\
							<td>\n\
								<span class="myprofile_sex myprofile_info"></span>\n\
								<span class="myprofile_sex" style="display: none">\n\
									<input id="myprofile_male" type="radio" name="sex" value="Male"><label for="myprofile_male">Male</label>\n\
									<input id="myprofile_female" type="radio" name="sex" value="Female"><label for="myprofile_female">Female</label>\n\
								</span>\n\
							</td>\n\
						</tr>\n\
						<tr>\n\
							<td>Location:</td>\n\
							<td>\n\
								<span class="myprofile_location myprofile_info"></span>\n\
								<input type="text" class="myprofile_location myprofile_input" value=""  style="display: none"/>\n\
							</td>\n\
						</tr>\n\
						<tr>\n\
							<td>Favourite artists:</td>\n\
							<td id="myprofile_artists">\n\
								<span class="myprofile_artist1 myprofile_info"></span>\n\
								<input type="text" class="myprofile_artist1 myprofile_input" style="display: none"/>\n\
								<span class="myprofile_artist2 myprofile_info"></span>\n\
								<input type="text" class="myprofile_artist2 myprofile_input" style="display: none"/>\n\
								<span class="myprofile_artist3 myprofile_info"></span>\n\
								<input type="text" class="myprofile_artist3 myprofile_input" style="display: none"/>\n\
							</td>\n\
						</tr>\n\
						<tr>\n\
							<td>Favourite Genres:</td>\n\
							<td id="myprofile_genres">\n\
								<span class="myprofile_genre1 myprofile_info"></span>\n\
								<input type="text" class="myprofile_genre1 myprofile_input" style="display: none"/>\n\
								<span class="myprofile_genre2 myprofile_info"></span>\n\
								<input type="text" class="myprofile_genre2 myprofile_input" style="display: none"/>\n\
								<span class="myprofile_genre3 myprofile_info"></span>\n\
								<input type="text" class="myprofile_genre3 myprofile_input" style="display: none"/>\n\
							</td>\n\
						</tr>\n\
					</table>\n\
					<h4>Change password</h4>\n\
                    <div id="myprofile_passwordError"></div>\n\
                    <div id="myprofile_passwordSuccess"></div>\n\
					<div class="form_container" style="width: 280px">\n\
						<div class="row">Old password: <input type="password" id="myprofile_oldPassword"></div>\n\
						<div class="row">New password: <input type="password" id="myprofile_newPassword1"></div>\n\
						<div class="row">Retype password: <input type="password" id="myprofile_newPassword2"></div>\n\
						<div class="submit"><input type="button" class="button" value="Change password" onclick="myprofile.changePassword()"></div>\n\
					</div>\n\
				</div>\n\
				<div class="shoutbox">\n\
					<h3>Shoutbox</h3>\n\
                    <div id="myprofile_shoutboxContainer"></div>\n\
                    </div>\n\
				</div>\n\
			</div>';
            panelMyProfile.setExtendedHtml(extendedHtml);
            myprofile.populatePanel(data);
            myprofile.loadShoutbox();
            myprofile.waitForLoad = false;

        });
    }



    this.__load = function () {
        Panels.add(panelMyProfile);
        Panels.extend('myprofile');

    }



    this.properties = new Array("firstname", "lastname", "sex", "location", "artist1", "artist2", "artist3", "genre1", "genre2", "genre3", "song1", "song2", "song3");

    this.index = function () {
        this.hidePersonalInfo();

    }
    this.toggleEditInfo = function () {
        $(".myprofile_editInfo").toggle();
        for (i in this.properties) {
            $(".myprofile_" + this.properties[i]).toggle();
        }
    }

    this.showPersonalInfo = function () {
        $(".myprofile_showPersonalInfo").hide();
        $(".myprofile_hidePersonalInfo").show();
        $("#myprofile_personalInfo").slideDown();
    }

    this.hidePersonalInfo = function () {
        $(".myprofile_hidePersonalInfo").hide();
        $(".myprofile_showPersonalInfo").show();
        $("#myprofile_personalInfo").hide();
    }



    this.saveProfile = function () {

        if ($("#myprofile_female").attr('checked')) {
            gender = "Female";
        } else {
            gender = "Male";
        }
        test2 = [];
        test2[0] = 11;
        test2[1] = 21;
        Mm.showLoading();
        $.post("MyProfileUpdate.ashx", {

            first_name: sanitizeString($(".myprofile_firstname.myprofile_input").val()),
            last_name: sanitizeString($(".myprofile_lastname.myprofile_input").val()),
            sex: gender,
            location: sanitizeString($(".myprofile_location.myprofile_input").val()),

            artist1: sanitizeString($(".myprofile_artist1.myprofile_input").val()),
            artist2: sanitizeString($(".myprofile_artist2.myprofile_input").val()),
            artist3: sanitizeString($(".myprofile_artist3.myprofile_input").val()),

            genre1: sanitizeString($(".myprofile_genre1.myprofile_input").val()),
            genre2: sanitizeString($(".myprofile_genre2.myprofile_input").val()),
            genre3: sanitizeString($(".myprofile_genre3.myprofile_input").val())

        }, function (data) {
            Mm.hideLoading();
            if (Mm.checkAppState(data) != true) return;
            if (data == false) {
                alert("Database Error. Please try again");
            } else {
                Mm.showLoading();
                $.post("MyProfileInfo.ashx", function (data) {
                    Mm.hideLoading();
                    if (Mm.checkAppState(data) != true) return;
                    myprofile.populatePanel(data);
                    Mm.session.firstName = data.FirstName;
                    Mm.session.lastName = data.LastName;
                    Mm.refreshCurrentUserState();


                    myprofile.toggleEditInfo();
                });
            }
        });

    }


    this.cancelProfile = function () {
        for (i in this.properties) {
            input = $(".myprofile_" + this.properties[i] + ".myprofile_input");
            info = $(".myprofile_" + this.properties[i] + ".myprofile_info");

            input.val(info.html());
        }
        if ($(".myprofile_sex.myprofile_info") == "Male") {
            $("#myprofile_male").attr('checked', 'checked');
        } else {
            $("#myprofile_female").attr('checked', 'checked');
        }

        this.toggleEditInfo();
    }


    this.changePassword = function () {
        $("#myprofile_passwordSuccess").html("");
        $("#myprofile_passwordError").html("");
        if ($("#myprofile_newPassword1").val() == "") {
            $("#myprofile_passwordError").html("New password required!");
        } else {
            if ($("#myprofile_newPassword1").val() != $("#myprofile_newPassword2").val()) {
                $("#myprofile_passwordError").html("The new password differs from the re-typed password!");
            } else {
                Mm.showLoading();
                $.post("MyProfileChangePassword.ashx", {
                    password: $.md5($("#myprofile_oldPassword").val() + "10i4tr"),
                    new_password: $.md5($("#myprofile_newPassword1").val() + "10i4tr")
                }, function (data) {
                    Mm.hideLoading();
                    if (Mm.checkAppState(data) != true) return;
                    if (data == true) {
                        $("#myprofile_passwordSuccess").html("Password changed successfully");
                    } else {
                        $("#myprofile_passwordError").html(data);
                    }
                });
            }
        }
    }


    this.populatePanel = function (data) {
        $("#myprofile_userTitle").html(data.FirstName);

        $(".myprofile_firstname.myprofile_info").html(data.FirstName);
        $(".myprofile_firstname.myprofile_input").val(data.FirstName);

        $(".myprofile_lastname.myprofile_info").html(data.LastName);
        $(".myprofile_lastname.myprofile_input").val(data.LastName);

        $(".myprofile_email").html(data.Email);

        //$(".myprofile_age").html(data.Age);

        $(".myprofile_location.myprofile_info").html(data.Location);
        $(".myprofile_location.myprofile_input").val(data.Location);

        if ($.trim(data.Sex) == "Male") {
            $("#myprofile_male").attr('checked', 'checked');
            $(".myprofile_sex.myprofile_info").html("Male");
        }
        if ($.trim(data.Sex) == "Female") {
            $("#myprofile_female").attr('checked', 'checked');
            $(".myprofile_sex.myprofile_info").html("Female");
        }
        $(".myprofile_artist1.myprofile_input").val("");
        $(".myprofile_artist1.myprofile_info").html("");
        $(".myprofile_artist2.myprofile_input").val("");
        $(".myprofile_artist2.myprofile_info").html("");
        $(".myprofile_artist3.myprofile_input").val("");
        $(".myprofile_artist3.myprofile_info").html("");

        $(".myprofile_genre1.myprofile_input").val("");
        $(".myprofile_genre1.myprofile_info").html("");
        $(".myprofile_genre2.myprofile_input").val("");
        $(".myprofile_genre2.myprofile_info").html("");
        $(".myprofile_genre3.myprofile_input").val("");
        $(".myprofile_genre3.myprofile_info").html("");



        for (j in data.FavouriteArtists) {
            $(".myprofile_artist" + (1 + j * 1) + ".myprofile_input").val(data.FavouriteArtists[j]);
            $(".myprofile_artist" + (1 + j * 1) + ".myprofile_info").html(data.FavouriteArtists[j]);
        }

        for (j in data.FavouriteGenres) {
            $(".myprofile_genre" + (1 + j * 1) + ".myprofile_input").val(data.FavouriteGenres[j]);
            $(".myprofile_genre" + (1 + j * 1) + ".myprofile_info").html(data.FavouriteGenres[j]);
        }

        $("#myprofile_songs input").autocomplete({
            source: "MyProfileSearchSong.ashx",
            minLength: 2
        });
        $("#myprofile_artists input").autocomplete({
            source: "MyProfileSearchArtist.ashx",
            minLength: 2
        });
        $("#myprofile_genres input").autocomplete({
            source: "MyProfileSearchGenre.ashx",
            minLength: 2
        });

    }


    this._removePost = function (messageId) {
        Mm.showLoading();
        if (confirm("Are you sure?")) {
            $.post("MyProfileRemoveMessage.ashx", { message_id: messageId }, function (data) {
                Mm.hideLoading();
                if (Mm.checkAppState(data) != true) return;
                if (data == false) {

                } else {

                }
                myprofile.loadShoutbox();

            });
        }
    }


    this.loadShoutbox = function () {
        Mm.showLoading();
        $("#myprofile_shoutboxContainer").html("");
        $.post("MyProfileGetShoutBox.ashx", function (data) {
            Mm.hideLoading();
            if (Mm.checkAppState(data) != true) return;
            var extendedHtml = $("<div></div>");
            extendedHtml.append($("<h3>Shoutbox</h3>"));

            if (data == false) {
                $("#myprofile_shoutboxContainer").append($("<h4>No messages.</h4>"));
            } else {

                for (i in data) {
                    entry = data[i];

                    compactedMessage = $("<div></div>");
                    compactedMessage.append($("<b></b>").append($("<a></a>").attr("href", "#/friends/personalInfo/" + entry.Sender.UserId).html(entry.Sender.FirstName + " " + entry.Sender.LastName)));
                    compactedMessage.append($("<span> says:</span>"));
                    compactedMessage.append($("<br />"));
                    compactedMessage.append(entry.Body);
                    compactedMessage.append($("<br />"));
                    compactedMessage.append($("<br />"));

                    header = $("<div></div>").attr("class", "message_header");
                    header.append(
						$("<a></a>").attr("href", "#/myprofile/_removePost/" + entry.MessageId).append(
							$("<img></img>").attr("class", "shoutbox_message_delete").attr("src", "images/cross-button.png").attr("title", "Remove this message")));
                    header.append(
							$("<a></a>").attr("href", "#/friends/_reportPost/" + entry.MessageId).append(
								$("<img></img>").attr("class", "shoutbox_message_delete").attr("src", "images/burn.png").attr("title", "Remove this message")));


                    header.append($("<img></img>").attr("src", "images/user-frame-32.png").attr("class", "avatar"));
                    header.append($("<b></b>").append($("<a></a>").attr("href", "#/friends/personalInfo/" + entry.Sender.UserId).html(entry.Sender.FirstName + " " + entry.Sender.LastName)));
                    header.append($("<br />"));
                    header.append(entry.SendDate);

                    message_content = $("<div></div>").attr("class", "message_content");
                    message_content.append(entry.Body);

                    message = $("<div></div>").attr("class", "message_container");
                    message.append(header);
                    message.append(message_content);

                    $("#myprofile_shoutboxContainer").append(message);

                    extendedHtml.append(compactedMessage);
                }
            }
            $("#myprofile_shoutboxContainer").append($("<textarea></textarea>", {
                rows: 6,
                cols: 30,
                id: 'myprofile_shoutbox_textarea'
            })).append($("<br />")).append($("<a></a>", {
                class: "button",
                href: "#/myprofile/_post"
            }).html("Post"));

            panelMyProfile.setCompactedHtml(extendedHtml.html());


        });

    }


    this._post = function () {
        if ($("#myprofile_shoutbox_textarea").val() == "") {
            alert("No message!");
            return;
        }
        Mm.showLoading();

        $.post("MyProfileShoutboxPost.ashx", {
            title: "Title",
            message: sanitizeString($("#myprofile_shoutbox_textarea").val())
        }, function (data) {
            Mm.hideLoading();
            if (Mm.checkAppState(data) != true) return;
            myprofile.loadShoutbox();

        });
    }




}

var panelMyProfile = new Panel('My Profile', 'myprofile', true);
var myprofile = null;

