// clasa care se ocupa cu initializarea aplicatiei
function AppLoaderClass() {

    this.checkUserState = function () {
        if (UserAuth == null) {
            UserAuth = new UserAuthClass();

            $.post("GetSession.ashx", function (data) {
                if (data == "false") {
                    UserAuth.loginUser();
                }
                else {
                    if (Mm == null) {
                        Mm = new MmClass();
                        Mm.session.userId = data.UserId;
                        Mm.session.firstName = data.FirstName;
                        Mm.session.lastName = data.LastName;
                        Mm.session.isModerator = data.isModerator;
                        Mm.session.isUploader = data.isUploader;
                        Mm.session.isAdmin = data.isAdmin;
                    }
                    Mm.isActive = true;
                    Mm.refreshCurrentUserState();
                }
            });
        }
        else {
            UserAuth.loginUser();
        }
    }

    this.checkUserState();

    
}

var AppLoader = null;

$(function () {
    AppLoader = new AppLoaderClass();
});