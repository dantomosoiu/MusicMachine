// clasa care se ocupa cu autentificarea utilizatorului
function UserAuthClass() {

    this.loginUser = function () {
        $('#app_container').after('<div id="LogInPanel"> \n\
        <div id = "logoContainer">\n\
            <img src="images/imagine_header2.png" />\n\
            <img id="loadingImg" src="images/ajax-loader2.gif" alt="" />\n\
        </div>\n\
        <table class="UserAuthTables" id="LogInTable"> \n\
        <tr> \n\
            <td> \n\
                E-mail \n\
            </td> \n\
            <td>\n\
                <input class="inputFieldLogIn" id="EmailInput" type="text" />\n\
            </td>\n\
        </tr>\n\
        <tr>\n\
            <td>\n\
                Password\n\
            </td>\n\
            <td>\n\
                <input class="inputFieldLogIn" id="PasswordInput" type="password" />\n\
            </td>\n\
        </tr>\n\
        <tr class="middle" >\n\
            <td style="height: 50px;" colspan="2">\n\
                <input type="button" id="logInButton" value="Log In" onclick = "UserAuth.LogIn(0);"/> or \n\
                <input type="button" id="GoToSignUpButton" value="Sign Up" onclick="UserAuth.SignUpUser()" disabled="disabled" />\n\
            </td>\n\
        </tr>\n\
        <tr class="middle">\n\
            <td id="logInValidator" class="middle" colspan="2">\n\
            </td>\n\
        </tr>\n\
    </table>\n\
    <div style="position: absolute; left:30px; top:30px;">Registration closed. <br/> This is a private webiste. <br/> Its purpose is strictly demonstrative. <br/> Its use is neither commercial nor private.</div>\n\
    </div>');
        $("#logInButton").button();
        $("#GoToSignUpButton").button();
        $("#LogInPanel").fadeIn("slow");

        $('#loadingImg').css('visibility', 'hidden');

        $('.inputFieldLogIn').keypress(function (event) {
            if (event.which == '13') {
                UserAuth.LogIn(0);
            }
        });
    }

    this.LogIn = function (source) {
        var eemail;
        var ppassword;

        if (source == 0) {
            eemail = $('#EmailInput').val();
            ppassword = $.md5($('#PasswordInput').val() + "10i4tr");
        }
        if (source == 1) {
            eemail = $('#EmailInput2').val();
            ppassword = $.md5($('#PasswordInput2').val() + "10i4tr");
        }

        $('#loadingImg').css('visibility', 'visible');
        $.post("LogInAttempt.ashx", { 'email': eemail, 'password': ppassword }, function (data) {
            $('#loadingImg').css('visibility', 'hidden');
            if (data == "false") {
                $("#logInValidator").text("Log In failed! Incorrect e-mail and/or password");
            }
            else {
                $("#LogInPanel").fadeOut("slow");
                $("#LogInPanel").remove();

                if (Mm == null) {
                    Mm = new MmClass();
                }
                Mm.session.userId = data.UserId;
                Mm.session.firstName = data.FirstName;
                Mm.session.lastName = data.LastName;
                Mm.session.isModerator = data.isModerator;
                Mm.session.isUploader = data.isUploader;
                Mm.session.isAdmin = data.isAdmin;

                Mm.refreshCurrentUserState();

                Mm.isActive = true;                
            }
        }, "json");        
    }

    this.SignUpUser = function () {
        $("#LogInPanel").fadeOut("fast");

        $('#app_container').after('<div id="SignUpPanel"> \n\
        <div id = "logoContainer">\n\
            <img src="images/imagine_header2.png" />\n\
            <img id="loadingImg" src="images/ajax-loader2.gif" alt="" />\n\
        </div>\n\
        <table class="UserAuthTables" id="SignUpTable"> \n\
        <tr>\n\
            <td>\n\
                First Name \n\
            </td> \n\
            <td>\n\
                <input class="inputFieldSignUp" id="FirstNameInput" type="text" />\n\
            </td>\n\
        </tr>\n\
        <tr>\n\
            <td>\n\
                Last Name \n\
            </td> \n\
            <td>\n\
                <input class="inputFieldSignUp" id="LastNameInput" type="text" />\n\
            </td>\n\
        </tr>\n\
        <tr>\n\
            <td>\n\
                E-mail \n\
            </td> \n\
            <td>\n\
                <input class="inputFieldSignUp" id="EmailInput2" type="text" />\n\
            </td>\n\
        </tr>\n\
        <tr>\n\
            <td>\n\
                Password\n\
            </td>\n\
            <td>\n\
                <input class="inputFieldSignUp" id="PasswordInput2" type="password" />\n\
            </td>\n\
        </tr>\n\
        <tr>\n\
            <td>\n\
                Repeat password\n\
            </td>\n\
            <td>\n\
                <input class="inputFieldSignUp" id="RepeatPasswordInput2" type="password" />\n\
            </td>\n\
        </tr>\n\
        <tr class="middle" >\n\
            <td style="height: 50px;" colspan="2">\n\
                <input type="button" id="SignUpButton" value="Sign Up" onclick="UserAuth.SignUp()" />\n\
                <input type="button" id="CancelSignUpButton" value="Cancel"/> \n\
            </td>\n\
        </tr>\n\
        <tr class="middle">\n\
            <td id="SignUpValidator" class="middle" colspan="2">\n\
            </td>\n\
        </tr>\n\
    </table>\n\
    </div>');
        $("#CancelSignUpButton").click(function () {
           $("#SignUpPanel").fadeOut("fast");
           $("#LogInPanel").fadeIn("slow");
       });

       $('.inputFieldSignUp').keypress(function (event) {
           if (event.which == '13') {
               UserAuth.SignUp();
           }
       });

        $("#SignUpButton").button();
        $("#CancelSignUpButton").button();
        $("#SignUpPanel").fadeIn("slow");

        $('#loadingImg').css('visibility', 'hidden');
        
    }

    this.SignUp = function () {
        if ($('#EmailInput2').val() == "" || $('#FirstNameInput').val() == "" || $('#LastNameInput').val() == "" || $('#PasswordInput2').val() == "" || $('#RepeatPasswordInput2').val() == "") {
            $("#SignUpValidator").text("All fields must be completed!");
        }
        else {
            if ($('#PasswordInput2').val() != $('#RepeatPasswordInput2').val()) {
                $("#SignUpValidator").text("'Password field' must be equal to 'Repeat password' field!");
            }
            else {
                var em = $('#EmailInput2').val();
                var fn = $('#FirstNameInput').val();
                var ln = $('#LastNameInput').val();
                var pw = $.md5($('#PasswordInput2').val() + "10i4tr");

                $('#loadingImg').css('visibility', 'visible');
                $.post("SignUpAttempt.ashx", { 'email': em, 'firstName': fn, 'lastName': ln, 'password': pw }, function (data) {
                    $('#loadingImg').css('visibility', 'hidden');
                    if (data == "0") {
                        UserAuth.LogIn(1);
                        $("#SignUpPanel").fadeOut("slow");
                        $("#SignUpPanel").remove();
                    }
                    if (data == "1") {
                        $("#SignUpValidator").text("This e-mail is already registered!");
                    }
                }, "json");
            }
        }
    }    
}

// definesc aici obiectele ca sa fie publice
var UserAuth = null;