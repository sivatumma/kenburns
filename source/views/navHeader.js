enyo.kind({
    name: "cls.navHeader",
    classes: "titlebar",
    kind: "FittableColumns",
    published: {
        title: "",
        showHome: true,
        showBack: true,
        smallText: false,
    },
    components: [{
        name: "backButton",
        classes: "backbutton glyph icon-back",
        ontap: "goBack",
        // components: [{
        //     classes: ""
        //     ontap: "goBack",
        // }]
    }, {
        name: "title",
        classes: "pagetitle short-text",
        fit: true
    }, {
        name: "homeButton",
        classes: "backbutton"
    }],
    create: function() {
        this.inherited(arguments);
        this.showHomeChanged();
        this.showBackChanged();
        this.titleChanged();
    },
    showHomeChanged: function(oldValue) {
        this.$.homeButton.setShowing(this.showHome);
    },
    showBackChanged: function(oldValue) {
        this.$.backButton.setShowing(this.showBack);
    },
    titleChanged: function(oldValue) {
        this.$.title.addRemoveClass("nav-title-small-text", this.smallText);
        this.$.title.setContent(this.title);
    },
    goBack: function(inSender, inEvent) {
        if (this.showBack) {
            app.popView();
        }
    },
    goHome: function(inSender, inEvent) {
        if (this.showHome) {
            app.setViewDirect("HOME");
        }
    }
});