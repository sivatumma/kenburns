enyo.kind({
    name: "cls.authenticationDialog",
    kind: "onyx.Popup",
    classes: "auth-dialog",
    components: [{
        kind: "Signals",
        showRegistrationScreen: "showRegistrationScreen",
        showLoginScreen: "showLoginScreen",
        secureCodeHandler: "secureCodeHandler"
    }, {
        kind: "Panels",
        classes: "auth-panel",
        name: "authenticationPanels",
        draggable: false,
        components: [{
            kind: "Scroller",
            components: [{
                kind: "cls.accessCode",
                viewName: "ACCESSCODE",
            }]
        }, {
            kind: "Scroller",
            components: [{
                kind: "cls.registrationView",
                viewName: "REGISTRATION"
            }]
        }, {
            kind: "Scroller",
            components: [{
                kind: "cls.loginView",
                viewName: "LOGIN"
            }]
        }]
    }],
    create: function() {
        this.inherited(arguments);
        if (localStorage.getItem("secureId") == AppConfig.secureid) {
            if (localStorage.getItem("registrationComplete")) {
                this.showLoginScreen();
            } else {
                this.showLoginScreen();
            }
        } else {
            this.secureCodeHandler();
        }
    },
    showRegistrationScreen: function(inSender, inEvent) {
        this.$.authenticationPanels.setIndex(1);
    },
    showLoginScreen: function(inSender, inEvent) {
        this.$.authenticationPanels.setIndex(2);
    },
    secureCodeHandler: function(inSender, inEvent) {
        this.$.authenticationPanels.setIndex(0);
    }
});