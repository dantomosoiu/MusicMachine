/*		in primul rand semantica: 
*			prin cuvantul 'intern' ma refer la partea ce contine obiectele propriu-zise ale melodiilor si metodele aditionale ale acestora;
*			prin 'extern' ma refer la reprezentarea din html (melodiile ce apar vizual, in browser);
*
*		functii folosibile public:
*
*		rightQueue.add(q);
*
*			adauga obiectul q (de tip melodie) in lista cozii de redare, la sfarsitul acesteia (deci va fi redata ultima);
*
*		rightQueue.add(q, i);
*
*			la fel ca mai sus, doar ca melodia e adaugata pe pozitia i din coada;
*
*       rightQueue.isEmpty(); si leftQueue.isEmpty();
*           
*           returneaza false daca sunt elemente in coada respectiva si true daca nu
*
*       rightQueue.isEmpty(i); si leftQueue.isEmpty(i);
*
*           returneaza false daca sunt cel putin i+1 elemente in coada respectiva si true daca nu
*           practic, testeaza daca elementul de pe pozitia i>=0 poate fi scos din coada
*
*
*		rightQueue.remove();
*
*			elimina prima melodie din coada de redare si o returneaza (pt a fi folosita de catre player);
*
*		rightQueue.remove(i);
*
*			la fel ca mai sus, pentru melodia de pe pozitia i. (functia va fi folosita la dublu click pe melodie, in coada);
*
*		leftQueue.remove(); leftQueue.remove(i);
*			
*			la fel ca mai sus doar ca pt 'recently played' (vor fi folosite la functia previous a playerului).
*
*		leftQueue.add(q);
*
*			apelata dupa terminarea redarii unei melodii, adauga melodia q in lista melodiilor redate recent;
*
*		leftQueue.updateQueue(); si rightQueue.updateQueue();
*
*			actualizeaza listele interne (si ordinea melodiilor din acestea) in functie de ce se afla in div-ul container al cozii;
*			functiile trebuiesc folosite dupa adaugarea prin drag&drop din alte surse si dupa reordonarea melodiilor (tot cu d&d);
*
*		initializeQueue();
*			functie globala, seteaza drag&dropabilitatea cozilor;
*			apelata de obiectul central atunci cand user-ul s-a logat;
*
*
*/

var removingLeft = 0;

shuffleState = 0;
repeatState = 0;
suggestionState = "off"; // initial este off dar mai poate lua valorile: playlist, normal, discovery, conservative, friends, top
suggestionsResponse = [];
soundDraggerPosition = null;


function SetPlayMode(mode) {
    if (mode == "off") {
        if (suggestionState != "off") {
            suggestionState = "off";
            $("div#queue_container div.suggestion_off a.normal").css("background-image", "url(images/buttons/off_active.png)");
            $("div#queue_container div.suggestion_playlist a.normal").css("background-image", "url(images/buttons/playlist.png)");
            $("div#queue_container div.suggestion_normal a.normal").css("background-image", "url(images/buttons/N.png)");
            $("div#queue_container div.suggestion_discovery a.discovery").css("background-image", "url(images/buttons/D.png)");
            $("div#queue_container div.suggestion_conservative a.conservative").css("background-image", "url(images/buttons/C.png)");
            $("div#queue_container div.suggestion_friends a.friends").css("background-image", "url(images/buttons/friends.png)");
            $("div#queue_container div.suggestion_tops a.tops").css("background-image", "url(images/buttons/top.png)");
        }
    }

    if (mode == 'shuffle') {
        if (shuffleState == 0) {
            shuffleState = 1;
            $("div#queue_container div.playmode_shuffle a.shuffle").css("background-image", "url(images/buttons/shuffle_active.png)");
        }
        else {
            shuffleState = 0;
            $("div#queue_container div.playmode_shuffle a.shuffle").css("background-image", "url(images/buttons/shuffle.png)");
        }
    }

    if (mode == 'repeat') {
        if (repeatState == 0) {
            repeatState = 1;
            $("div#queue_container div.playmode_repeat a.repeat").css("background-image", "url(images/buttons/repeat_active.png)");
            rightQueue.queueCheckContents(1);
        }
        else {
            repeatState = 0;
            $("div#queue_container div.playmode_repeat a.repeat").css("background-image", "url(images/buttons/repeat.png)");
        }
    }

    if (mode == 'playlist') {
        if (suggestionState != 'playlist') {
            suggestionState = 'playlist';
            $("div#queue_container div.suggestion_off a.normal").css("background-image", "url(images/buttons/off.png)");
            $("div#queue_container div.suggestion_playlist a.normal").css("background-image", "url(images/buttons/playlist_active.png)");
            $("div#queue_container div.suggestion_normal a.normal").css("background-image", "url(images/buttons/N.png)");
            $("div#queue_container div.suggestion_discovery a.discovery").css("background-image", "url(images/buttons/D.png)");
            $("div#queue_container div.suggestion_conservative a.conservative").css("background-image", "url(images/buttons/C.png)");
            $("div#queue_container div.suggestion_friends a.friends").css("background-image", "url(images/buttons/friends.png)");
            $("div#queue_container div.suggestion_tops a.tops").css("background-image", "url(images/buttons/top.png)");
            rightQueue.queueCheckContents(1);
        }
        else {
            rightQueue.queueCheckContents(1);
        }
    }

    if (mode == 'normal') {
        if (suggestionState != 'normal') {
            suggestionState = 'normal';
            $("div#queue_container div.suggestion_off a.normal").css("background-image", "url(images/buttons/off.png)");
            $("div#queue_container div.suggestion_playlist a.normal").css("background-image", "url(images/buttons/playlist.png)");
            $("div#queue_container div.suggestion_normal a.normal").css("background-image", "url(images/buttons/N_active.png)");
            $("div#queue_container div.suggestion_discovery a.discovery").css("background-image", "url(images/buttons/D.png)");
            $("div#queue_container div.suggestion_conservative a.conservative").css("background-image", "url(images/buttons/C.png)");
            $("div#queue_container div.suggestion_friends a.friends").css("background-image", "url(images/buttons/friends.png)");
            $("div#queue_container div.suggestion_tops a.tops").css("background-image", "url(images/buttons/top.png)");
            rightQueue.queueCheckContents(1);
        }
        else {
            rightQueue.queueCheckContents(1);
        }
    }

    if (mode == 'discovery') {
        if (suggestionState != 'discovery') {
            suggestionState = 'discovery';
            $("div#queue_container div.suggestion_off a.normal").css("background-image", "url(images/buttons/off.png)");
            $("div#queue_container div.suggestion_playlist a.normal").css("background-image", "url(images/buttons/playlist.png)");
            $("div#queue_container div.suggestion_normal a.normal").css("background-image", "url(images/buttons/N.png)");
            $("div#queue_container div.suggestion_discovery a.discovery").css("background-image", "url(images/buttons/D_active.png)");
            $("div#queue_container div.suggestion_conservative a.conservative").css("background-image", "url(images/buttons/C.png)");
            $("div#queue_container div.suggestion_friends a.friends").css("background-image", "url(images/buttons/friends.png)");
            $("div#queue_container div.suggestion_tops a.tops").css("background-image", "url(images/buttons/top.png)");
            rightQueue.queueCheckContents(1);
        }
        else {
            rightQueue.queueCheckContents(1);
        }
    }

    if (mode == 'conservative') {
        if (suggestionState != 'conservative') {
            suggestionState = 'conservative';
            $("div#queue_container div.suggestion_off a.normal").css("background-image", "url(images/buttons/off.png)");
            $("div#queue_container div.suggestion_playlist a.normal").css("background-image", "url(images/buttons/playlist.png)");
            $("div#queue_container div.suggestion_normal a.normal").css("background-image", "url(images/buttons/N.png)");
            $("div#queue_container div.suggestion_discovery a.discovery").css("background-image", "url(images/buttons/D.png)");
            $("div#queue_container div.suggestion_conservative a.conservative").css("background-image", "url(images/buttons/C_active.png)");
            $("div#queue_container div.suggestion_friends a.friends").css("background-image", "url(images/buttons/friends.png)");
            $("div#queue_container div.suggestion_tops a.tops").css("background-image", "url(images/buttons/top.png)");
            rightQueue.queueCheckContents(1);
        }
        else {
            rightQueue.queueCheckContents(1);
        }
    }

    if (mode == 'friends') {
        if (suggestionState != 'friends') {
            suggestionState = 'friends';
            $("div#queue_container div.suggestion_off a.normal").css("background-image", "url(images/buttons/off.png)");
            $("div#queue_container div.suggestion_playlist a.normal").css("background-image", "url(images/buttons/playlist.png)");
            $("div#queue_container div.suggestion_normal a.normal").css("background-image", "url(images/buttons/N.png)");
            $("div#queue_container div.suggestion_discovery a.discovery").css("background-image", "url(images/buttons/D.png)");
            $("div#queue_container div.suggestion_conservative a.conservative").css("background-image", "url(images/buttons/C.png)");
            $("div#queue_container div.suggestion_friends a.friends").css("background-image", "url(images/buttons/friends_active.png)");
            $("div#queue_container div.suggestion_tops a.tops").css("background-image", "url(images/buttons/top.png)");
            rightQueue.queueCheckContents(1);
        }
        else {
            rightQueue.queueCheckContents(1);
        }
    }

    if (mode == 'top') {
        if (suggestionState != 'top') {
            suggestionState = 'top';
            $("div#queue_container div.suggestion_off a.normal").css("background-image", "url(images/buttons/off.png)");
            $("div#queue_container div.suggestion_playlist a.normal").css("background-image", "url(images/buttons/playlist.png)");
            $("div#queue_container div.suggestion_normal a.normal").css("background-image", "url(images/buttons/N.png)");
            $("div#queue_container div.suggestion_discovery a.discovery").css("background-image", "url(images/buttons/D.png)");
            $("div#queue_container div.suggestion_conservative a.conservative").css("background-image", "url(images/buttons/C.png)");
            $("div#queue_container div.suggestion_friends a.friends").css("background-image", "url(images/buttons/friends.png)");
            $("div#queue_container div.suggestion_tops a.tops").css("background-image", "url(images/buttons/top_active.png)");
            rightQueue.queueCheckContents(1);
        }
        else {
            rightQueue.queueCheckContents(1);
        }
    }

    if (mode == 'clear') {
        rightQueue.clearQueue();
    }

}

function queueVoteSong(SongObj, VoteNr) {
    votedSong = { SongId: SongObj.SongId, Vote: VoteNr };
    Mm.showLoading();
    $.post("VoteSong.ashx", votedSong, function (response) {
        if (Mm.checkAppState(response) == true) {
            SongObj.Vote = VoteNr;
            rightQueue.updateQueue();
            leftQueue.updateQueue();
            if (MusicPlayer.getSongId() == SongObj.SongId) { // trebuie sa reactualizez butoanele de vot din player
                MusicPlayer.updateVotes(VoteNr);
            }
        }
        Mm.hideLoading();
    }, "json");

}

var rightQueue = {

    queue: [],  // vector cu obiectele melodiei - reprezentare interna, diferita (cel putin in unele momente) de melodiile din html
    queueIndex: [], //indexul melodiilor, folosit la asigurarea ordinii interne

    add: function (q, pos) { //adauga melodia q in coada, pe pozitia pos
        first = 1;
        if (pos == undefined) {
            pos = rightQueue.queue.length;
        }
        position = pos;
        if (rightQueue.queue.length != 0) {
            rightQueue.queueIndex[(rightQueue.queue.length)] = -1;
            first = 0;
        }
        else {
            rightQueue.queueIndex[0] = 0;
        }
        rightQueue.queue.push(q);

        if (first == 0) {
            var save = -1;
            for (var i = 0; i < rightQueue.queueIndex.length - 1; i++) {
                if (position <= rightQueue.queueIndex[i]) {
                    aux = rightQueue.queue.splice(rightQueue.queue.length - 1, 1);
                    rightQueue.queue.splice(i, 0, aux[0]);
                    save = i;
                    break;
                }
            }
            if (save != -1) {
                rightQueue.queueIndex[rightQueue.queueIndex.length - 1] = rightQueue.queueIndex.length - 1;
            }
            else {
                rightQueue.queueIndex[rightQueue.queueIndex.length - 1] = pos;
            }
        }

        rightQueue.insertInContainer();

    },

    isEmpty: function (s) {
        if (s == undefined) {
            s = 0;
        }
        if (rightQueue.queue.length < s + 1) {
            return true;
        }
        return false;
    },

    clearQueue: function () {
        rightQueue.queue = [];
        rightQueue.queueIndex = [];
        rightQueue.insertInContainer();
    },

    getLastQueued: function (songNumber) {

        lastQueued = [];

        if (rightQueue.queue.length > songNumber) {
            for (var i = rightQueue.queue.length; i > rightQueue.queue.length - songNumber; i--) {
                lastQueued.push(rightQueue.queue[i - 1].SongId);
            }
        }
        else {
            counter = songNumber - rightQueue.queue.length;
            for (var i = 0; i < rightQueue.queue.length; i++) {
                lastQueued.push(rightQueue.queue[i].SongId);
            }

            if (MusicPlayer.getSongId() != null) {
                lastQueued.push(MusicPlayer.getSongId());
                counter--;
            }

            if (counter > leftQueue.queue.length) {
                for (var i = 0; i < leftQueue.queue.length; i++) {
                    lastQueued.push(leftQueue.queue[i].SongId);
                }
            }
            else {
                for (var i = 0; i < counter; i++) {
                    lastQueued.push(leftQueue.queue[i].SongId);
                }
            }

        }
        return lastQueued;
    },

    queueCheckContents: function (forced) {
        if (rightQueue.queue.length < 5 || forced == 1) { // elementele cozii sunt mai putine de 5, incerc sa o populez

            if (suggestionState == 'playlist') {
                if (shuffleState == 0) {
                    for (var i = 0; i < 5; i++) {
                        newSong = playlists.getSongFromPlaylist('ordered');
                        if (newSong != null)
                            rightQueue.add(newSong.songObj);
                    }
                }
                else {
                    for (var i = 0; i < 5; i++) {
                        newSong = playlists.getSongFromPlaylist('random');
                        if (newSong != null)
                            rightQueue.add(newSong.songObj);
                    }
                }
            }


            if (suggestionState == 'normal') {
                requestObj = {
                    user_id: Mm.session.userId,
                    suggestion_mode: 'normal',
                    results: 5,
                    lastQueued: rightQueue.getLastQueued(15)
                };

                Mm.showLoading();
                $.post("SmartSuggest.ashx", requestObj, function (response) {
                    if (Mm.checkAppState(response) == true) {
                        responseSongs = response;
                        for (var i = 0; i < response.length; i++) {
                            if (response[i].Vote != 0) {
                                responseSongs[i].source = 1;
                                rightQueue.add(responseSongs[i]);
                            }
                        }
                        Mm.hideLoading();
                    }
                }, "json");
                return;
            }

            if (suggestionState == 'discovery') {

                requestObj = {
                    user_id: Mm.session.userId,
                    suggestion_mode: 'discovery',
                    results: 5,
                    lastQueued: rightQueue.getLastQueued(15)
                };

                Mm.showLoading();
                $.post("SmartSuggest.ashx", requestObj, function (response) {
                    if (Mm.checkAppState(response) == true) {
                        responseSongs = response;
                        for (var i = 0; i < response.length; i++) {
                            responseSongs[i].source = 1;
                            rightQueue.add(responseSongs[i]);
                        }
                        Mm.hideLoading();
                    }
                }, "json");
                return;
            }


            if (suggestionState == 'conservative') {
                requestObj = {
                    user_id: Mm.session.userId,
                    suggestion_mode: 'conservative',
                    results: 5,
                    lastQueued: rightQueue.getLastQueued(15)
                };
                Mm.showLoading();
                $.post("SmartSuggest.ashx", requestObj, function (response) {
                    if (Mm.checkAppState(response) == true) {
                        responseSongs = response;
                        for (var i = 0; i < response.length; i++) {
                            if (response[i].Vote != 0) {
                                responseSongs[i].source = 1;
                                rightQueue.add(responseSongs[i]);
                            }
                        }
                        Mm.hideLoading();
                    }
                }, "json");
                return;
            }

            if (suggestionState == 'top') {
                requestObj = {
                    user_id: Mm.session.userId,
                    suggestion_mode: 'top',
                    results: 5,
                    lastQueued: rightQueue.getLastQueued(15)
                };
                Mm.showLoading();
                $.post("SmartSuggest.ashx", requestObj, function (response) {
                    if (Mm.checkAppState(response) == true) {
                        responseSongs = response;
                        for (var i = 0; i < response.length; i++) {
                            responseSongs[i].source = 1;
                            rightQueue.add(responseSongs[i]);
                        }
                        Mm.hideLoading();
                    }
                }, "json");
                return;
            }

            if (suggestionState == 'friends') {
                requestObj = {
                    user_id: Mm.session.userId,
                    suggestion_mode: 'friends',
                    results: 5,
                    lastQueued: rightQueue.getLastQueued(15)
                };
                Mm.showLoading();
                $.post("SmartSuggest.ashx", requestObj, function (response) {
                    if (Mm.checkAppState(response) == true) {
                        responseSongs = response;
                        for (var i = 0; i < response.length; i++) {
                            responseSongs[i].source = 1;
                            rightQueue.add(responseSongs[i]);
                        }
                        Mm.hideLoading();
                    }
                }, "json");
                return;
            }


        }
    },

    remove: function (s) { //scoate din coada melodia de pe pozitia s, si o returneaza
        if (s == undefined) {
            index = 0;
        }
        else {
            index = s;
        }
        aux = rightQueue.queue.splice(index, 1);
        rightQueue.queueIndex.splice(index, 1);
        if (index == 0) {
            for (var i = 0; i < rightQueue.queueIndex.length; i++) {
                rightQueue.queueIndex[i]--;

            }
        }
        else {
            for (i = 0; i < rightQueue.queueIndex.length - 1; i++) {
                if (rightQueue.queueIndex[i + 1] - rightQueue.queueIndex[i] != 1) {
                    rightQueue.queueIndex[i + 1]--;
                }
            }
        }
        rightQueue.insertInContainer();
        rightQueue.queueCheckContents();
        return aux[0];
    },

    insertInContainer: function () { //actualizeaza componentele externe (in functie de starea celor interne)
        destination = document.getElementById('queue_right');
        destination.innerHTML = '';
        for (j = 0; j < rightQueue.queue.length; j++) {
            var rightSongButtons = '';
            switch (rightQueue.queue[j].Vote) {
                case -1:
                    {
                        rightSongButtons = '<div class="song_container_buttons"><div class="buton_queue_right_1" onclick=\"queueVoteSong(rightQueue.queue[' + j + '], 0)\" ></div><div class="buton_queue_right_2" onclick=\"queueVoteSong(rightQueue.queue[' + j + '], 1)\" ></div><div class="buton_queue_right_3" onclick=\"queueVoteSong(rightQueue.queue[' + j + '], 2)\" ></div><div class="buton_queue_right_4" onclick=\"queueVoteSong(rightQueue.queue[' + j + '], 3)\" ></div><div class="buton_queue_right_5" onclick=\"queueVoteSong(rightQueue.queue[' + j + '], 4)\" ></div><div class="buton_queue_right_6"></div></div>';
                        break;
                    }
                case 0:
                    {
                        rightSongButtons = '<div class="song_container_buttons"><div class="buton_queue_right_1_pressed" onclick=\"queueVoteSong(rightQueue.queue[' + j + '], 0)\" ></div><div class="buton_queue_right_2" onclick=\"queueVoteSong(rightQueue.queue[' + j + '], 1)\" ></div><div class="buton_queue_right_3" onclick=\"queueVoteSong(rightQueue.queue[' + j + '], 2)\" ></div><div class="buton_queue_right_4" onclick=\"queueVoteSong(rightQueue.queue[' + j + '], 3)\" ></div><div class="buton_queue_right_5" onclick=\"queueVoteSong(rightQueue.queue[' + j + '], 4)\" ></div><div class="buton_queue_right_6"></div></div>';
                        break;
                    }
                case 1:
                    {
                        rightSongButtons = '<div class="song_container_buttons"><div class="buton_queue_right_1" onclick=\"queueVoteSong(rightQueue.queue[' + j + '], 0)\" ></div><div class="buton_queue_right_2_pressed" onclick=\"queueVoteSong(rightQueue.queue[' + j + '], 1)\" ></div><div class="buton_queue_right_3" onclick=\"queueVoteSong(rightQueue.queue[' + j + '], 2)\" ></div><div class="buton_queue_right_4" onclick=\"queueVoteSong(rightQueue.queue[' + j + '], 3)\" ></div><div class="buton_queue_right_5" onclick=\"queueVoteSong(rightQueue.queue[' + j + '], 4)\" ></div><div class="buton_queue_right_6"></div></div>';
                        break;
                    }
                case 2:
                    {
                        rightSongButtons = '<div class="song_container_buttons"><div class="buton_queue_right_1" onclick=\"queueVoteSong(rightQueue.queue[' + j + '], 0)\" ></div><div class="buton_queue_right_2" onclick=\"queueVoteSong(rightQueue.queue[' + j + '], 1)\" ></div><div class="buton_queue_right_3_pressed" onclick=\"queueVoteSong(rightQueue.queue[' + j + '], 2)\" ></div><div class="buton_queue_right_4" onclick=\"queueVoteSong(rightQueue.queue[' + j + '], 3)\" ></div><div class="buton_queue_right_5" onclick=\"queueVoteSong(rightQueue.queue[' + j + '], 4)\" ></div><div class="buton_queue_right_6"></div></div>';
                        break;
                    }
                case 3:
                    {
                        rightSongButtons = '<div class="song_container_buttons"><div class="buton_queue_right_1" onclick=\"queueVoteSong(rightQueue.queue[' + j + '], 0)\" ></div><div class="buton_queue_right_2" onclick=\"queueVoteSong(rightQueue.queue[' + j + '], 1)\" ></div><div class="buton_queue_right_3" onclick=\"queueVoteSong(rightQueue.queue[' + j + '], 2)\" ></div><div class="buton_queue_right_4_pressed" onclick=\"queueVoteSong(rightQueue.queue[' + j + '], 3)\" ></div><div class="buton_queue_right_5" onclick=\"queueVoteSong(rightQueue.queue[' + j + '], 4)\" ></div><div class="buton_queue_right_6"></div></div>';
                        break;
                    }
                case 4:
                    {
                        rightSongButtons = '<div class="song_container_buttons"><div class="buton_queue_right_1" onclick=\"queueVoteSong(rightQueue.queue[' + j + '], 0)\" ></div><div class="buton_queue_right_2" onclick=\"queueVoteSong(rightQueue.queue[' + j + '], 1)\" ></div><div class="buton_queue_right_3" onclick=\"queueVoteSong(rightQueue.queue[' + j + '], 2)\" ></div><div class="buton_queue_right_4" onclick=\"queueVoteSong(rightQueue.queue[' + j + '], 3)\" ></div><div class="buton_queue_right_5_pressed" onclick=\"queueVoteSong(rightQueue.queue[' + j + '], 4)\" ></div><div class="buton_queue_right_6"></div></div>';
                        break;
                    }
            }

            destination.innerHTML = destination.innerHTML + '<div id="next_song_' + j + '" class="song_container_right">' + rightSongButtons + '<div id="right_cover_' + j + '" class="song_container_cover"></div><div class="song_container_artist">' + rightQueue.queue[j].Artists + '</div><div class="song_container_song">' + rightQueue.queue[j].SongName + '</div></div>';



            $("#right_cover_" + j).html('<img src="' + 'images/cover-art/' + rightQueue.queue[j].AlbumId + '.png' + '" alt="' + rightQueue.queue[j].Album + '" title="' + rightQueue.queue[j].Album + '" WIDTH="64" onerror="this.src=\'images/cover-art/-1.png\';"/>');
        }

        rightQueue.updateSize();

        $('.song_container_right').dblclick(function () {
            var index = this.id.split('next_song_')[1];
            rightQueue.add(rightQueue.queue[index], 0);
            MusicPlayer.finishedSong();
        });


        $('.buton_queue_right_6').click(function () {
            deleting = this.parentNode.parentNode.id;
            $("#" + deleting).remove();
            rightQueue.updateQueue();
            rightQueue.queueCheckContents();
        });


        //        $('.song_container_buttons').draggable({
        //            stop: function (event, ui) { alert(asd); }
        //        });

    },

    updateSize: function () { //actualizeaza dimensiunea containerului de melodii (in cazul adaugarii sau stergerii)
        var childCount = $("#queue_right > div").size();
        if (childCount > 0) {
            $("#queue_right").width(childCount * 100);
        }
    },

    updateQueue: function () { //actualizeaza componentele interne (in functie de continutul extern)
        var aux = [];
        var newQueue = [];
        var newQueueIndex = [];
        var index;
        aux = $("#queue_right").children();
        j = 0;
        for (var i = aux.length - 1; i >= 0; i--) {
            index = aux[i].id.split("next_song_")[1];

            // ATENTIE
            // trebuie sa verific si pt previous_song_ -> in cazul in care fac drag and drop din alta parte
            // ideal ar fi ca div-ul dropat sa primeasca un id cheie (sa nu ramana cu previous)


            newQueue.unshift(rightQueue.queue[index]);
            newQueueIndex[newQueueIndex.length] = j;
            j++;
        }
        rightQueue.queue = newQueue;
        rightQueue.queueIndex = newQueueIndex;
        rightQueue.insertInContainer();
        rightQueue.updateSize();
    }

}


var leftQueue = {

    queue: [], // vector cu obiectele melodiei - reprezentare interna, diferita (cel putin in unele momente) de melodiile din html
    queueIndex: [], //indexul melodiilor, folosit la asigurarea ordinii interne

    add: function (q) { //adauga melodia q in coada, pe pozitia pos
        leftQueue.queue.unshift(q);
        leftQueue.queueIndex[leftQueue.queueIndex.length] = leftQueue.queueIndex.length;
        leftQueue.insertInContainer();
    },

    isEmpty: function (s) {
        if (s == undefined) {
            s = 0;
        }
        if (leftQueue.queue.length < s + 1) {
            return true;
        }
        return false;
    },

    remove: function (s) {
        if (s == undefined) {
            index = 0;
        }
        else {
            index = s;
        }
        aux = leftQueue.queue.splice(index, 1);
        leftQueue.queueIndex.splice(index, 1);
        if (index == 0) {
            for (var i = 0; i < leftQueue.queueIndex.length; i++) {
                leftQueue.queueIndex[i]--;

            }
        }
        else {
            for (i = 0; i < leftQueue.queueIndex.length - 1; i++) {
                if (leftQueue.queueIndex[i + 1] - leftQueue.queueIndex[i] != 1) {
                    leftQueue.queueIndex[i + 1]--;
                }
            }
        }
        leftQueue.insertInContainer();
        return aux[0];

    },


    insertInContainer: function () { //actualizeaza componentele externe (in functie de starea celor interne)
        destination = document.getElementById('queue_left');
        destination.innerHTML = '';
        for (var j = 0; j < leftQueue.queue.length; j++) {

            var leftSongButtons = '';
            switch (leftQueue.queue[j].Vote) {
                case -1:
                    {
                        leftSongButtons = '<div class="song_container_buttons"><div class="buton_queue_left_1" onclick=\"queueVoteSong(leftQueue.queue[' + j + '], 0)\" ></div><div class="buton_queue_left_2" onclick=\"queueVoteSong(leftQueue.queue[' + j + '], 1)\" ></div><div class="buton_queue_left_3" onclick=\"queueVoteSong(leftQueue.queue[' + j + '], 2)\" ></div><div class="buton_queue_left_4" onclick=\"queueVoteSong(leftQueue.queue[' + j + '], 3)\" ></div><div class="buton_queue_left_5" onclick=\"queueVoteSong(leftQueue.queue[' + j + '], 4)\" ></div><div class="buton_queue_left_6"></div></div>';
                        break;
                    }
                case 0:
                    {
                        leftSongButtons = '<div class="song_container_buttons"><div class="buton_queue_left_1_pressed" onclick=\"queueVoteSong(leftQueue.queue[' + j + '], 0)\" ></div><div class="buton_queue_left_2" onclick=\"queueVoteSong(leftQueue.queue[' + j + '], 1)\" ></div><div class="buton_queue_left_3" onclick=\"queueVoteSong(leftQueue.queue[' + j + '], 2)\" ></div><div class="buton_queue_left_4" onclick=\"queueVoteSong(leftQueue.queue[' + j + '], 3)\" ></div><div class="buton_queue_left_5" onclick=\"queueVoteSong(leftQueue.queue[' + j + '], 4)\" ></div><div class="buton_queue_left_6"></div></div>';
                        break;
                    }
                case 1:
                    {
                        leftSongButtons = '<div class="song_container_buttons"><div class="buton_queue_left_1" onclick=\"queueVoteSong(leftQueue.queue[' + j + '], 0)\" ></div><div class="buton_queue_left_2_pressed" onclick=\"queueVoteSong(leftQueue.queue[' + j + '], 1)\" ></div><div class="buton_queue_left_3" onclick=\"queueVoteSong(leftQueue.queue[' + j + '], 2)\" ></div><div class="buton_queue_left_4" onclick=\"queueVoteSong(leftQueue.queue[' + j + '], 3)\" ></div><div class="buton_queue_left_5" onclick=\"queueVoteSong(leftQueue.queue[' + j + '], 4)\" ></div><div class="buton_queue_left_6"></div></div>';
                        break;
                    }
                case 2:
                    {
                        leftSongButtons = '<div class="song_container_buttons"><div class="buton_queue_left_1" onclick=\"queueVoteSong(leftQueue.queue[' + j + '], 0)\" ></div><div class="buton_queue_left_2" onclick=\"queueVoteSong(leftQueue.queue[' + j + '], 1)\" ></div><div class="buton_queue_left_3_pressed" onclick=\"queueVoteSong(leftQueue.queue[' + j + '], 2)\" ></div><div class="buton_queue_left_4" onclick=\"queueVoteSong(leftQueue.queue[' + j + '], 3)\" ></div><div class="buton_queue_left_5" onclick=\"queueVoteSong(leftQueue.queue[' + j + '], 4)\" ></div><div class="buton_queue_left_6"></div></div>';
                        break;
                    }
                case 3:
                    {
                        leftSongButtons = '<div class="song_container_buttons"><div class="buton_queue_left_1" onclick=\"queueVoteSong(leftQueue.queue[' + j + '], 0)\" ></div><div class="buton_queue_left_2" onclick=\"queueVoteSong(leftQueue.queue[' + j + '], 1)\" ></div><div class="buton_queue_left_3" onclick=\"queueVoteSong(leftQueue.queue[' + j + '], 2)\" ></div><div class="buton_queue_left_4_pressed" onclick=\"queueVoteSong(leftQueue.queue[' + j + '], 3)\" ></div><div class="buton_queue_left_5" onclick=\"queueVoteSong(leftQueue.queue[' + j + '], 4)\" ></div><div class="buton_queue_left_6"></div></div>';
                        break;
                    }
                case 4:
                    {
                        leftSongButtons = '<div class="song_container_buttons"><div class="buton_queue_left_1" onclick=\"queueVoteSong(leftQueue.queue[' + j + '], 0)\" ></div><div class="buton_queue_left_2" onclick=\"queueVoteSong(leftQueue.queue[' + j + '], 1)\" ></div><div class="buton_queue_left_3" onclick=\"queueVoteSong(leftQueue.queue[' + j + '], 2)\" ></div><div class="buton_queue_left_4" onclick=\"queueVoteSong(leftQueue.queue[' + j + '], 3)\" ></div><div class="buton_queue_left_5_pressed" onclick=\"queueVoteSong(leftQueue.queue[' + j + '], 4)\" ></div><div class="buton_queue_left_6"></div></div>';
                        break;
                    }
            }

            destination.innerHTML = destination.innerHTML + '<div id="previous_song_' + j + '" class="song_container_left">' + leftSongButtons + '<div id="left_cover_' + j + '" class="song_container_cover"></div><div class="song_container_artist">' + leftQueue.queue[j].Artists + '</div><div class="song_container_song">' + leftQueue.queue[j].SongName + '</div></div>';

            $("#left_cover_" + j).html('<img src="' + 'images/cover-art/' + leftQueue.queue[j].AlbumId + '.png' + '" alt="' + leftQueue.queue[j].Album + '" title="' + leftQueue.queue[j].Album + '" WIDTH="64" onerror="this.src=\'images/cover-art/-1.png\';" />');
        }

        leftQueue.updateSize();
        if (removingLeft == 1) {
            removingLeft = 0;
        }
        else {
            QueueHelper.updateScrollLeft();
        }

        $('.song_container_left').dblclick(function () {
            var index = this.id.split('previous_song_')[1];
            rightQueue.add(leftQueue.queue[index], 0);
            MusicPlayer.finishedSong();
        });


        $('.buton_queue_left_6').click(function () {
            deleting = this.parentNode.parentNode.id;
            $("#" + deleting).remove();
            removingLeft = 1;
            leftQueue.updateQueue();
        });
    },

    updateSize: function () { //actualizeaza dimensiunea containerului de melodii (in cazul adaugarii sau stergerii)
        var childCount = $("#queue_left > div").size();
        if (childCount > 0) {
            $("#queue_left").width(childCount * 100);
        }
    },

    updateQueue: function () { //actualizeaza componentele interne (in functie de continutul extern)
        var aux = [];
        var newQueue = [];
        var newQueueIndex = [];
        var index;
        aux = $("#queue_left").children();
        j = 0;
        for (var i = aux.length - 1; i >= 0; i--) {
            index = aux[i].id.split("previous_song_")[1];
            newQueue.unshift(leftQueue.queue[index]);
            newQueueIndex[newQueueIndex.length] = j;
            j++;
        }
        leftQueue.queue = newQueue;
        leftQueue.queueIndex = newQueueIndex;
        leftQueue.insertInContainer();
        leftQueue.updateSize();
    }
}


var QueueHelper = {
    updateScrollLeft: function () { //muta scrollul containerului 'recently played' la dreapta
        $("#queue_left_container").scrollLeft($("#queue_left").width() + 50);
    }
}

initializeQueue = function () {
    $("#queue_right").sortable({
        stop: function (event, ui) {
            rightQueue.updateQueue();
            leftQueue.updateQueue();
        },
        activate: function (event, ui) {
            soundDraggerPosition = ui.item.offset();
            ui.item.attr("id").split("next_song_")[1];
            soundDraggerObject = rightQueue.queue[ui.item.attr("id").split("next_song_")[1]];
        }
    });
    $("#queue_right").disableSelection();
    QueueHelper.updateScrollLeft();
    $("#queue_left").disableSelection();

    $("div#queue_container div.suggestion_off a.normal").css("background-image", "url(images/buttons/off_active.png)");


    $("#queue_left_container").droppable({
        drop: function (event, ui) {
            ui.draggable.offset(soundDraggerPosition);
            leftQueue.add(soundDraggerObject);
            rightQueue.remove(ui.draggable.attr("id").split("next_song_")[1]);
        }
    });



}



