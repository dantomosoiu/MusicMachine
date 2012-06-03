﻿function FriendsClass () {

	this.__panelAdded = function () {
		extendedHtml = '<div id="friends">\n\
            <div class="button_toolbar">\n\
                <a href="#/friends">My Friends</a>\n\
				<a href="#/friends/friendRequests">Friend Requests</a>\n\
            </div>\n\
            <div id = "friends_container" class="scroll_vertical">\n\
            </div>\n\
			</div>';
		panelFriends.setExtendedHtml(extendedHtml);
	}

	this.__load = function () {
	    Panels.add(panelFriends);
	    Panels.extend('friends');

	}


	this.index = function () {
		Mm.showLoading();
		//this.waitForLoad = true;
		$.post("FriendsGetFriends.ashx", function (data) {
			Mm.hideLoading();
			if (Mm.checkAppState(data) != true) return;
			compactedFriendList = $("<div><h4>My Friends</h4></div>");
			friendsHtml = '<h3 id="friends_header">My Friends</h3>';
			if (typeof data == 'string') {
				friendsHtml += "<h4>" + data + "</h4>";
				compactedFriendList.append($("<h4></h4>").html(data));
				$("#friends_container").html(friendsHtml);
				panelFriends.setCompactedHtml(compactedFriendList.html());
			} else {
				columnArray = [{ columnId: 'FirstName', columnTitle: 'First Name' }, { columnId: 'LastName', columnTitle: 'Last Name' }, { columnId: 'Location', columnTitle: 'Location' }, { columnId: 'Profile', columnTitle: ''}];
				for (i in data) {
					profile = { content: 'View Profile', type: 'button', callback: 'friends/personalInfo/' + data[i].UserId };
					data[i].Profile = profile;
					compactedFriendList.append(
                    $("<a></a>").attr("href", "#/friends/personalInfo/" + data[i].UserId).html(data[i].FirstName + " " + data[i].LastName)
                );
					compactedFriendList.append("<br/>");
				}
				friendsGridview = new Gridview(columnArray, data, 'friends_gridview');
				friendsHtml += friendsGridview.getGridviewHtml();
				$("#friends_container").html(friendsHtml);
				friendsGridview.activate();
				panelFriends.setCompactedHtml(compactedFriendList.html());

			}



			//friends.waitForLoad = false;
			
		});

	}

	this.friendRequests = function () {
		Mm.showLoading();
		//this.waitForLoad = true;
		$.post("FriendsGetFriendRequests.ashx", function (data) {
			Mm.hideLoading();
			if (Mm.checkAppState(data) != true) return;
			compactedFriendRequestList = $("<div><h4>Friend Requests</h4></div>");
			friendsRequestHtml = '<h3 id="friends_header">Friend Requests</h3>';
			if (typeof data == 'string') {
				friendsRequestHtml += "<h4>" + data + "</h4>";
				compactedFriendRequestList.append($("<h4></h4>").html(data));
				$("#friends_container").html(friendsRequestHtml);
				panelFriends.setCompactedHtml(compactedFriendRequestList.html());
			} else {
				columnArray = [{ columnId: 'FirstName', columnTitle: 'First Name' }, { columnId: 'LastName', columnTitle: 'Last Name' }, { columnId: 'Age', columnTitle: 'Age' }, { columnId: 'Location', columnTitle: 'Location' }, { columnId: 'Profile', columnTitle: '' }, { columnId: 'Accept', columnTitle: '' }, { columnId: 'Ignore', columnTitle: ''}];
				for (i in data) {
					profile = { content: 'View Profile', type: 'button', callback: 'friends/personalInfo/' + data[i].UserId };
					accept = { content: 'Accept', type: 'button', callback: 'friends/_acceptFriend/' + data[i].UserId };
					ignore = { content: 'Ignore', type: 'button', callback: 'friends/_ignoreFriend/' + data[i].UserId };
					data[i].Profile = profile;
					data[i].Accept = accept;
					data[i].Ignore = ignore;
					compactedFriendRequestList.append(
                    $("<a></a>").attr("href", "#/friends/personalInfo").html(data[i].FirstName + " " + data[i].LastName)
                );
					compactedFriendRequestList.append("<br/>");
				}
				friendsRequestGridview = new Gridview(columnArray, data, 'friends_request_gridview');
				friendsRequestHtml += friendsRequestGridview.getGridviewHtml();


				$("#friends_container").html(friendsRequestHtml);
				friendsRequestGridview.activate();

				panelFriends.setCompactedHtml(compactedFriendRequestList.html());
			}

			//friends.waitForLoad = false;
			
		});
	}

	this.getFriendHeader = function (id) {
		
		return '<h3 id="friends_header"><img src="images/user-24.png" alt=""><span id="friends_userTitle"></span><span id = "friends_request"></span></h3>\n\
				<div class="button_toolbar friends_showPersonalInfo">\n\
					<a href="#/friends/personalInfo/' + id + '">Personal Info</a>\n\
                    <a href="#/friends/shoutbox/' + id + '">Shoutbox</a>\n\
                    <a href="#/friends/playlists/' + id + '">Playlists</a>\n\
                </div>';


	}

	this.shoutbox = function (id) {
		Mm.showLoading();

		$.post("FriendsGetShoutbox.ashx", { friend_id: id }, function (data) {
			Mm.hideLoading();
			if (Mm.checkAppState(data) != true) return;
			$("#friends_container").html(friends.getFriendHeader(id));
			friends.loadCompacted(id);

			var shoutboxHtml = $("<div><h3>Shoutbox</h3></div>").attr("class", "shoutbox"); ;

			if (data == false) {
				shoutboxHtml.append($("<h4>No messages.</h4>"));
			} else {

				for (i in data) {
					entry = data[i];

					compactedMessage = $("<div></div>").attr("class", "shoutbox");
					compactedMessage.append($("<b></b>").append($("<a></a>").attr("href", "#/friends/personalInfo/" + entry.Sender.UserId).html(entry.Sender.FirstName + " " + entry.Sender.LastName)));
					compactedMessage.append($("<span> says:</span>"));
					compactedMessage.append($("<br />"));
					compactedMessage.append(entry.Body);
					compactedMessage.append($("<br />"));
					compactedMessage.append($("<br />"));

					header = $("<div></div>").attr("class", "message_header");
					if (Mm.session.isModerator == "True") {
						header.append(
							$("<a></a>").attr("href", "#/friends/_removePost/" + id + "/" + entry.MessageId).append(
								$("<img></img>").attr("class", "shoutbox_message_delete").attr("src", "images/cross-button.png").attr("title", "Remove this message")));
					}
					header.append(
							$("<a></a>").attr("href", "#/friends/_reportPost/" + entry.MessageId).append(
								$("<img></img>").attr("class", "shoutbox_message_delete").attr("src", "images/burn.png").attr("title", "Report this message")));

					header.append($("<img></img>").attr("src", "images/user-frame-32.png").attr("class", "avatar"));
					header.append($("<b></b>").append($("<a></a>").attr("href", "#/friends/personalInfo/" + entry.Sender.UserId).html(entry.Sender.FirstName + " " + entry.Sender.LastName)));
					header.append($("<br />"));
					header.append(entry.SendDate);

					message_content = $("<div></div>").attr("class", "message_content");
					message_content.append(entry.Body);

					message = $("<div></div>").attr("class", "message_container");
					message.append(header);
					message.append(message_content);

					shoutboxHtml.append(message);
				}
			}
			Mm.showLoading();
			$.post("FriendsIsFriend.ashx", { friendId: id }, function (data2) {
				Mm.hideLoading();
				if (Mm.checkAppState(data2) != true) return;
				if (data2 == true) {
					shoutboxHtml.append($("<textarea></textarea>", {
						rows: 6,
						cols: 30,
						id: 'friends_shoutbox_textarea'
					})).append($("<br />")).append($("<a></a>", {
						class: "button",
						href: "#/friends/_post/" + id
					}).html("Post"));
				}
				$("#friends_container").append(shoutboxHtml);

			});



		});
	}

	this._post = function (id) {

		if ($("#friends_shoutbox_textarea").val() == "") {
			alert("No message!");
			return;
		}
		Mm.showLoading();

		$.post("FriendsShoutboxPost.ashx", {
			friendId: id,
			title: "Title",
			message: sanitizeString($("#friends_shoutbox_textarea").val())
		}, function (data) {
			Mm.hideLoading();
			if (Mm.checkAppState(data) != true) return;
			//UrlObject.refresh();

		});
	}

	this._removePost = function (friendId, messageId) {
		Mm.showLoading();
		if (confirm("Are you sure?")) {
			$.post("FriendsRemoveMessage.ashx", { message_id: messageId }, function (data) {
				Mm.hideLoading();
				if (Mm.checkAppState(data) != true) return;
				if (data == false) {

				} else {

				}
				UrlObject.redirect("#/friends/shoutbox/" + friendId);
				

			});
		}
		
	}


	this._reportPost = function (messageId) {
		Mm.showLoading();
		if (confirm("Are you sure?")) {
			$.post("FriendsReportMessage.ashx", { message_id: messageId }, function (data) {
				Mm.hideLoading();
				if (Mm.checkAppState(data) != true) return;
				if (data == false) {

				} else {

				}
				

			});
		}
	}

	this._requestFriend = function (id) {

		Mm.showLoading();
		$.post("FriendsRequest.ashx", { friendId: id }, function (data) {
			Mm.hideLoading(); 
			if (Mm.checkAppState(data) != true) return;
			UrlObject.refresh();
			
		});

	}

	this._acceptFriend = function (id, refresh) {
		Mm.showLoading();
		$.post("FriendsAcceptRequest.ashx", { friendId: id }, function (data) {
			Mm.hideLoading();
			if (Mm.checkAppState(data) != true) return;
			if (refresh == true) {
				UrlObject.refresh();
			}
			
		});

	}

	this._ignoreFriend = function (id, refresh) {
		Mm.showLoading();
		$.post("FriendsIgnoreFriend.ashx", { friendId: id }, function (data) {
			Mm.hideLoading(); 
			if (Mm.checkAppState(data) != true) return;
			if (refresh == true) {
				UrlObject.refresh();
			}
			
		});

	}


	this.loadCompacted = function (id) {
		$.post("FriendsGetProfile.ashx", { friend_id: id }, function (data) {
			Mm.hideLoading();
			if (Mm.checkAppState(data) != true) return;

			var favouriteArtists = "";
			var favouriteGenres = "";

			if (data.FavouriteArtists[0]) {
				favouriteArtists = "<br/><b>Favourite artists:</b><br/>" + data.FavouriteArtists[0];
			}
			if (data.FavouriteArtists[1]) {
				favouriteArtists += ", " + data.FavouriteArtists[1];
			}
			if (data.FavouriteArtists[2]) {
				favouriteArtists += ", " + data.FavouriteArtists[2];
			}


			if (data.FavouriteGenres[0]) {
				favouriteGenres = "<br/><b>Favourite Genres:</b><br/>" + data.FavouriteGenres[0];
			}
			if (data.FavouriteGenres[1]) {
				favouriteGenres += ", " + data.FavouriteGenres[1];
			}
			if (data.FavouriteGenres[2]) {
				favouriteGenres += ", " + data.FavouriteGenres[2];
			}

			friendInfoHtml =
				'<div id="friends_compactedInfo">\n\
					<h4>' + data.FirstName + " " + data.LastName + '</h4>' +
                    favouriteArtists +
                    favouriteGenres;

			panelFriends.setCompactedHtml(friendInfoHtml);

			$("#friends_userTitle").html(data.FirstName + " " + data.LastName);
			Mm.showLoading();
			$.post("FriendsFriendship.ashx", { friendId: id }, function (data) {
				Mm.hideLoading();
				if (Mm.checkAppState(data) != true) return;
				if (data == false) {
					request = '<a href="#/friends/_requestFriend/' + id + '">Add as friend</a>';
				} else {
					request = "";
				}
				$("#friends_request").html(request);

			});
		});

	}


	this.personalInfo = function (id) {
		Mm.showLoading();
		//this.waitForLoad = true;
		$.post("FriendsGetProfile.ashx", { friend_id: id }, function (data) {
			Mm.hideLoading();
			if (Mm.checkAppState(data) != true) return;

			friendInfoHtml = friends.getFriendHeader(id) +
				'<div id="friends_personalInfo">\n\
					<h3>Personal Info</h3>\n\
					<table border="0" cellspacing="0" cellpadding="0" id="friends_infoTable">\n\
						<tr>\n\
							<td>First name:</td>\n\
							<td>\n\
								<span class="friends_firstname friends_info"></span>\n\
							</td>\n\
						</tr>\n\
						<tr>\n\
							<td>Last name:</td>\n\
							<td>\n\
								<span class="friends_lastname friends_info"></span>\n\
							</td>\n\
						</tr>\n\
						<tr>\n\
							<td>Sex:</td>\n\
							<td>\n\
								<span class="friends_sex friends_info"></span>\n\
							</td>\n\
						</tr>\n\
						<tr>\n\
							<td>Location:</td>\n\
							<td>\n\
								<span class="friends_location friends_info"></span>\n\
							</td>\n\
						</tr>\n\
						<tr>\n\
							<td>Favourite artists:</td>\n\
							<td id="friends_artists">\n\
								<span class="friends_artist1 friends_info"></span>\n\
								<span class="friends_artist2 friends_info"></span>\n\
								<span class="friends_artist3 friends_info"></span>\n\
							</td>\n\
						</tr>\n\
						<tr>\n\
							<td>Favourite Genres:</td>\n\
							<td id="friends_genres">\n\
								<span class="friends_genre1 friends_info"></span>\n\
								<span class="friends_genre2 friends_info"></span>\n\
								<span class="friends_genre3 friends_info"></span>\n\
							</td>\n\
						</tr>\n\
					</table>';
			$("#friends_container").html(friendInfoHtml);
			friends.loadCompacted(id); ;
			friends.loadFriendInfo(data);
			//friends.waitForLoad = false;
			
		});



	}


	this.loadFriendInfo = function (data) {

		$(".friends_firstname.friends_info").html(data.FirstName);

		$(".friends_lastname.friends_info").html(data.LastName);

		//$(".friends_age").html(data.Age);

		$(".friends_location.friends_info").html(data.Location);

		if ($.trim(data.Sex) == "Male") {
			$(".friends_sex.friends_info").html("Male");
		} 
		if ($.trim(data.Sex) == "Female") {
			$(".friends_sex.friends_info").html("Female");
		}
		$(".friends_artist1.friends_info").html("");
		$(".friends_artist2.friends_info").html("");
		$(".friends_artist3.friends_info").html("");

		$(".friends_genre1.friends_info").html("");
		$(".friends_genre2.friends_info").html("");
		$(".friends_genre3.friends_info").html("");



		for (j in data.FavouriteArtists) {
			$(".friends_artist" + (1 + j * 1) + ".friends_info").html(data.FavouriteArtists[j]);
		}

		for (j in data.FavouriteGenres) {
			$(".friends_genre" + (1 + j * 1) + ".friends_info").html(data.FavouriteGenres[j]);
		}
	}

	this.playlists = function (friend_id) {
		this.changeContent(friend_id);
	}

	this.showPlaylist = function (friendId, PlayId) { //actualizeaza tot panelul - se apeleaza la deschiderea unui alt playlist decat cel curent

		songInfo = { UserId: friendId,
			PlaylistId: PlayId
		};

		Mm.showLoading();
		$.post("PlaylistSongsPanel.ashx", songInfo, function (response) {
			if (Mm.checkAppState(response) == true) {
				playlistDataArray = [];
				friends.FriendsplaylistSongs = [];
				playlistColumnArray = [{ columnId: 'SongName', columnTitle: 'Song' }, { columnId: 'Artists', columnTitle: 'Artist' }, { columnId: 'Album', columnTitle: 'Album' }, { columnId: 'Year', columnTitle: 'Year' }, { columnId: 'Genres', columnTitle: 'Genres' }, { columnId: 'action', columnTitle: 'Action'}];
				if (response != undefined) {
					for (i = 0; i < response.length; i++) {
						friends.FriendsplaylistSongs[i] = { songObj: response[i], playlistPosition: i };
						playlistDataArray[i] = { SongName: response[i].SongName,
							Artists: response[i].Artists,
							Album: response[i].Album,
							Year: response[i].Year,
							Genres: response[i].Genres,
							action: { content: '<img src="images/to_queue_gridview_song.png" onClick="friends.addSongToQueue(' + i + ');"> <img src="images/add_playlist.png" onClick="friends.addSongToPlaylist(' + i + ');">', type: 'html' } 
						};
					}
				}

				playlistGridview = new Gridview(playlistColumnArray, playlistDataArray, 'friends_playlist_gridview');
				$("#friends_playlist_gridview_container").html(playlistGridview.getGridviewHtml());
				playlistGridview.activate();



				Mm.hideLoading();
			}
		}, "json");

		this.changeContent(friendId);
	}

	this.addSongToPlaylist = function (position) {
		playlists.addSongToPlaylist(this.FriendsplaylistSongs[position].songObj);
	}

	this.addSongToQueue = function (position) {
		rightQueue.add(this.FriendsplaylistSongs[position].songObj);
	}

	this.changeContent = function (friend_id) {  //actualizeaza lista playlisturilor (cu interogare din bd)

		userInfo = {
			UserId: friend_id
		};

		$("#friends_container").html(this.getFriendHeader(friend_id) + '<h3>Playlists</h3><div class="column-menu"></div>\n\<div class="column"><div id="buttons_toolbar" class="button_toolbar"><a id="friends_AddToQueueButtonAnchor" href="#/friends/_addPlaylistToQueue" class="button">Add to Queue</a></div><div id="friends_playlist_gridview_container" class="gridview_container"></div></div>');

		Mm.showLoading();
		$.post("PlaylistPanel.ashx", userInfo, function (response) {
			if (Mm.checkAppState(response) == true) {
				var text_html = "<ul class='list_playlists'>";
				for (i = 0; i < response.length; i++) {
					text_html += ' <li><a id="playlist' + response[i].PlaylistId + '" href="#/friends/showPlaylist/' + friend_id + '/' + response[i].PlaylistId + '" >' + response[i].PlaylistName + '</a></li>';
				}
				text_html += "</ul>";

				$('#friends_container .column-menu').html(text_html);
				Mm.hideLoading();
			}
		}, "json");

		this.loadCompacted(friend_id);
	}

	this._addPlaylistToQueue = function () { // adauga toate melodiile din playlist in coada

		for (i = 0; i < this.FriendsplaylistSongs.length; i++) {
			rightQueue.add(this.FriendsplaylistSongs[i].songObj);
		}

	}

}

var panelFriends = new Panel('Friends', 'friends', true);
var friends = null;