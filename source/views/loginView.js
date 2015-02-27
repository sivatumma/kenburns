enyo.kind({
    name: "cls.loginView",
    classes: "clsMobileLogin auth-dialog-padding",
    kind: "Scroller",
    constructor: function() {
        // enyo.load(['https://connect.facebook.net/en_US/all.js'], function() {
        //     // this gets called when the facebook js-sdk is loaded
        //     window.fbAsyncInit = function() {
        //         FB.init({
        //             appId: '687493867994191',
        //             status: false,
        //             cookie: true,
        //             xfbml: true,
        //             version: 'v2.1'
        //         });
        //     };
        // });
        this.inherited(arguments);
    },
    components: [{
            kind: "Signals",
            loginFromKeyBoard: "loginFromKeyBoard",
            loginFromRegistration:"loginFromRegistration"
        }, {
            kind: "branding",
            classes: "branding"
        }, {
            name: "heading",
            classes: "heading"
        }, {
            name: "subHeading",
            content: "Login via Facebook or create an account",
            classes: "subHeading"
        },
        // {
        //     name: "loginUsingFacebookButton",
        //     kind: "loginUsingFacebookButton",
        //     ontap: "doFacebookLogin"
        // }, 
        // {
        //     name: "clsLineSeparator",
        //     classes: "clsLineSeparator"
        // }, 
        {
            name: "alertMessgae",
            classes: "alertMessage"
        }, {
            name: "username",
            kind: "enyo.Input",
            content: "",
            placeholder: "Username or Email",
            value: "IOTWF"
        }, {
            name: "password",
            kind: "enyo.Input",
            content: "",
            placeholder: "Password",
            value: "CISCO",
            attributes: {
                type: "password"
            }
        }, {
            name: "clsMobileLoginSubmitButton",
            kind: "Button",
            classes: "clsMobileLoginSubmitButton",
            content: "Log In",
            ontap: "submitLoginForm"
        }, {
            tag: "a",
            content: strings_en_US.login.links.register,
            classes: "anchor",
            ontap: "showRegistrationScreen"
        }
        // ,{content:"|", classes:"inline"},{tag:"a", content:strings_en_US.login.links.forgot_password, classes:"anchor"}
    ],
    submitLoginForm: function() {
        // for debugging


        if (this.$.username.getValue() == "iminchicago") {
            localStorage.setItem("iminchicago", true);
            AppConfig.simulateOtherLocation = true;
        } else {
            localStorage.removeItem("iminchicago");            
        }
        // var username = this.$.username.getValue().toLowerCase();
        //@TODO: remove hard coded values - letting the user enter anything for now
        var username = "IOTWF";//this.$.username.getValue() || "IOTWF";
        var password = "CISCO";//this.$.password.getValue() || "CISCO";
        if (username == '' || username == 'Username') {
            this.$.username.addStyles("border:1px solid red;");
            this.$.alertMessgae.show();
            this.$.alertMessgae.setContent("Please enter your Username");
            return false;
        } else if (password == '' || password == 'Password') {
            this.$.password.addStyles("border:1px solid red;");
            this.$.alertMessgae.show();
            this.$.alertMessgae.setContent("Please enter your password");
            return false;
        } else {
            this.$.username.addStyles("border:1px solid silver;");
            this.$.password.addStyles("border:1px solid silver;");
            this.$.alertMessgae.hide();
            UserModel.loginUser(username, password, 'web', this.loginSuccess, this.loginError, this);
        }
        // var cryptedMessage = CryptoJS.SHA3(username + password); //  Probable forthcoming change - keep this 
    },
    loginSuccess: function(response) {
        //  Setting parameters to maintain session
        var session_params = {
            token: response.xhrResponse.headers.token,
            token_created: response.xhrResponse.headers.token_created,
            token_expires: response.xhrResponse.headers.token_expires
        };
        localStorage.setItem("loggedIn", true);
        // Since we are directly logging in with known credentials for now, 
        // Setting the registrationComplete flag would not show the secureid screen everytime.
        localStorage.setItem("registrationComplete", true);
        localStorage.setItem("userIdVal", response.postBody.username);
        localStorage.setItem("loginStatus", !response.failed);
        sessionStorage.setItem("token", session_params.token);
        localStorage.setItem("tokenDetails", JSON.stringify(response.xhrResponse.headers));
        UserModel.responseHeader = response.xhrResponse.headers;
        this.$.alertMessgae.show();
        this.$.alertMessgae.setContent("Please wait... ");
        UserModel.userObject = UserModel.userObject || {};
        UserModel.userObject.loggedIn = true;
        app.setCurrentUser(UserModel.userObject);
        AnalyticsLogger.logAnalyticsData({
            event: "loginSuccess"
        });
    },
    loginError: function(response) {
        UserModel.userObject = UserModel.userObject || {};
        UserModel.userObject.loggedIn = false;
        this.$.alertMessgae.show();
        AnalyticsLogger.logAnalyticsData({
            event: "loginFailure"
        });
        if (response.xhrResponse.body) this.$.alertMessgae.setContent(JSON.parse(response.xhrResponse.body).message);
        // The below line is uncommented in local box so as to avoid logging in everytime while testing
        // new cls.MainView().renderInto(document.body);
    },
    // statusChangeCallback: function(response) {
    //     var that = this;
    //     if (response.status === 'connected') {
    //         FB.api('/me', function(response) {
    //             if (strings_en_US) that.$.alertMessgae.setContent(strings_en_US.login.alerts.fb_connected + response.name + "...");
    //             that.$.alertMessgae.show();
    //             that.$.alertMessgae.setContent("Please wait... ");
    //             UserModel.loginUser(response.id, 'testing', 'facebook', that.loginSuccess, that.loginError, that);
    //         });
    //     } else if (response.status === 'not_authorized') {
    //         // The person is logged into Facebook, but not your app.
    //         FB.login(function(response) {
    //             if (response.authResponse) {
    //                 FB.api('/me', function(response) {
    //                     UserModel.loginUser(response.id, 'testing', 'facebook', that.loginSuccess, that.loginError, that);
    //                 });
    //             } else {
    //             }
    //         }, {
    //             scope: 'public_profile,email,user_likes,publish_actions',
    //             return_scopes: true
    //         });
    //     } else {
    //         // The person is not logged into Facebook, so we're not sure if
    //         // they are logged into this app or not.
    //         FB.login(function(response) {
    //             if (response.authResponse) {
    //                 FB.api('/me', function(response) {
    //                     UserModel.loginUser(response.id, 'testing', 'facebook', that.loginSuccess, that.loginError, that);
    //                 });
    //             } else {
    //             }
    //         }, {
    //             scope: 'email',
    //             return_scopes: true
    //         });
    //     }
    // },
    // doFacebookLogin: function() {
    //     this.$.alertMessgae.show();
    //     this.$.alertMessgae.setContent("Please wait... ");
    //     var that = this;
    //     FB.getLoginStatus(function(response) {
    //         that.statusChangeCallback(response);
    //     });
    // },
    showRegistrationScreen: function(inSender, inEvent) {
        enyo.Signals.send("showRegistrationScreen", {});
    },
    loginFromKeyBoard: function(inSender, inEvent) {
        this.submitLoginForm();
    },
    loginFromRegistration:function(inSender, inEvent){
        UserModel.loginUser(inEvent.username, inEvent.password, 'web', this.loginSuccess, this.loginError, this);
    }
});
//  Face book logo along with our customized text
// enyo.kind({
//     name: "loginUsingFacebookButton",
//     classes: "loginUsingFacebookButton",
//     ontap: "doFacebookLogin",
//     components: [{
//         tag: "i",
//         classes: "inline fa fa-facebook",
//     }, {
//         content: "Log In using Facebook",
//         classes: "inline flogotext"
//     }]
// });
enyo.kind({
    name: "branding",
    classes: "branding",
    components: [{
        classes: "smartCityLogo",
        components: [{
            kind: "Image",
            src: "assets/smartcity-chicago-logo-blue-trans.png",
            classes: "logo"
        }]
    }, {
        content: strings_en_US.login.branding.heading,
        classes: "heading"
    }, {
        content: strings_en_US.login.branding.subHeading,
        classes: "subHeading"
    }]
});
