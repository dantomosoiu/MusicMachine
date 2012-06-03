var MmInstSync;

// clasa centrala a aplicatiei pe partea de client
function MmClass() {
    this.isActive = false;
    this.totalLoadingActivities = 0;
    this.session = {};

    /*
    Parseaza un obiect primit de la server si verifica daca semnaleaza ca utilizatorul nu (mai) este autentificat.
    Intoarce:
    - true: se poate continua executia aplicatiei
    - false: nu se continua executia aplicatiei, iar proprietatea Mm.isActive devine false
    */
    this.checkAppState = function (serverSerializedObject) {
        if (serverSerializedObject) {
            if (serverSerializedObject._serverStatus) {
                if (serverSerializedObject._serverStatus == 'no_session') {
                    alert("Your session has expired. Please log back in.");
                    location.reload();
                }
                else if (serverSerializedObject._serverStatus == 'error') {
                    alert("An error has occured. Please try again.");
                    Mm.forceHideLoading();
                }
                return false;
            }
            else {
                return true;
            }
        }
        else {
            return true;
        }
    }

    // incarc interfata initiala
    $(function () {

        $('#app_container').fadeIn('slow');

        $.fx.off = true;
        Panels.add(panelHome);
        Panels.add(panelPlaylists);
        $.fx.off = false;

        // Astept sa fie instantiat obiectul Mm inainte sa instantiez celelalte obiecte. Motivul este ca daca unul din ele vrea
        // sa citeasca din sesiune (Mm.session) ceva, ar fi obtinut o eroare (Mm is null) daca obiectul Mm nu ar fi terminat instantierea.
        MmInstSync = setInterval(function () {
            if (Mm) {
                clearInterval(MmInstSync);

                home = new HomeClass();
                playlists = new PlaylistsClass();
                lyrics = new LyricsClass();
                suggestions = new SuggestionsClass();
                search = new SearchClass();
                myprofile = new MyprofileClass();
                friends = new FriendsClass();
                topmusic = new TopMusicClass();
                reportSong = new ReportSongClass();

                if (Mm.session.isUploader == "True") {
                    upload = new UploadClass();
                }
                if (Mm.session.isModerator == "True") {
                    moderator = new ModeratorClass();
                }

                UrlObject = new UrlFrameworkClass();
                RecommendObject = new RecommendClass();

                shortcut.add("Ctrl+Q", Mm.forceHideLoading);
                shortcut.add("Ctrl+E", Panels.closeCurrent);
            }
        }, 50);

        initializeQueue();
        initializePlayer();

        $('.button_toolbar').buttonset();
        $('.button').button();
        $('#ajax_loading_img').click(function () { Mm.forceHideLoading() });

    });

    this.showLoading = function () {
        this.totalLoadingActivities++;
        $('#ajax_loading_img').css('visibility', 'visible');
    }

    this.hideLoading = function () {
        this.totalLoadingActivities--;
        if (this.totalLoadingActivities <= 0) {
            $('#ajax_loading_img').css('visibility', 'hidden');
            this.totalLoadingActivities = 0;
        }
    }

    this.forceHideLoading = function () {
        $('#ajax_loading_img').css('visibility', 'hidden');
        this.totalLoadingActivities = 0;
    }

    this.sanitizeString = function (strInput) {
        return sanitizeString(strInput);
    }

    this.refreshCurrentUserState = function () {
        if (Mm.session.firstName) {
            $("#header_current_user_first_name").text(Mm.session.firstName);
            $("#header_logout_link").unbind('click');
            $("#header_logout_link").click(function () {
                $.post("LogOut.ashx", function (data) {
                    Mm.session = {};
                    location.reload();
                });
            });
        }
    }
}

// definesc aici obiectele ca sa fie publice
var Mm = null;

function sanitizeString(strInput) {
    strInput = strInput.replace(/"/g, "");
    strInput = strInput.replace(/</g, "");
    strInput = strInput.replace(/>/g, "");
    strInput = strInput.replace(/'/g, "");
    strInput = strInput.replace(/@/g, "");
    strInput = strInput.replace(/#/g, "");
    strInput = strInput.replace(/\$/g, "");
    strInput = strInput.replace(/%/g, "");
    strInput = strInput.replace(/&/g, "");
    return strInput;
}