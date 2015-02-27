enyo.kind({
    name: "cls.about",
    classes: "aboutApp",
    components: [{
        name: "mainHeader",
        kind: "cls.navHeader",
        title: "About"
    }, {
        kind: "FittableRows",
        fit: true,
        components: [{
            classes: "title",
            content: "Smart City Chicago"
        }, {
            classes: "content",
            content: "Version 1.0"
        }, {
            classes: "content",
            content: "All content have copyrights © 1992-2014"
        }, {
            classes: "content",
            content: "Cisco Systems Inc. All rights reserved."
        }, {
            classes: "linksContainer",
            components: [{
                classes: "link",
                kind: "Button",
                content: "Terms of Use",
                ontap: "showTermsOfUSe"
            }, {
                classes: "link",
                kind: "Button",
                content: "Privacy Policy",
                ontap: "showPrivacyPolicy"
            }]
        }]
    }],
    backToMoreScreen: function(inSender, inEvent) {
        app.popView();
    },
    showTermsOfUSe: function(inSender, inEvent) {
        app.pushView("TERMSOFUSE");
    },
    showPrivacyPolicy: function(inSender, inEvent) {
        app.pushView("PRIVACYPOLICY");
    }
});