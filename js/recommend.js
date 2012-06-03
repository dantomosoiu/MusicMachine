function RecommendClass() {

	this.recommend = function (songId, songTitle) {
		this.songTitle = songTitle;
		this.songId = songId;
		Mm.showLoading();
		$.post("FriendsGetFriends.ashx", function (data) {
			RecommendObject.friendList = data;
			window.open('recommend.html', '', 'width=400,height=250,status=no,location=no,titlebar=no,toolbar=no');
			Mm.hideLoading();
		});

	}

	this.postRecommend = function (friendId, remoteWindow) {
		$.post("RecommendSong.ashx", { songId: this.songId, friendId: friendId }, function (data) {
			if (data == false) {
				alert("Recommendation already sent");
			} else {
				remoteWindow.close();
			}
		});

	}



}