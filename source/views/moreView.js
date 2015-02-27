enyo.kind({
    name: "cls.moreView",
    classes: "moreView",
    kind: "FittableRows",
    components: [{
        kind: "Signals",
        bindLogoutEvent: "bindLogoutEvent"
    }, {
        name: "moreOptions",
        fit: true,
        components: [{
            name: "mainHeader",
            kind: "cls.navHeader",
            title: "More Info"
        }, {
            classes: "moreOption",
            kind: "FittableColumns",
            ontap: "showCityInfo",
            components: [{
                content: "City Info",
                classes: "moreOptionTitle"
            }, {
                tag: "i",
                classes: "fa fa-chevron-right moreOptionIcon"
            }]
        }, {
            classes: "moreOption",
            kind: "FittableColumns",
            ontap: "showMapLayers",
            components: [{
                content: "Map",
                classes: "moreOptionTitle",
            }, {
                tag: "i",
                classes: "fa fa-chevron-right moreOptionIcon"
            }]
        }, {
            classes: "moreOption",
            kind: "FittableColumns",
            ontap: "showAbout",
            components: [{
                content: "About",
                classes: "moreOptionTitle"
            }, {
                tag: "i",
                classes: "fa fa-chevron-right moreOptionIcon"
            }]
        }, 
        // {
        //     classes: "moreOption",
        //     kind: "FittableColumns",
        //     ontap: "showMyOffers",
        //     components: [{
        //         content: "Notifications",
        //         classes: "moreOptionTitle"
        //     }, {
        //         tag: "i",
        //         classes: "fa fa-chevron-right moreOptionIcon"
        //     }]
        // }, 
        {
            classes: "moreOption",
            kind: "FittableColumns",
            ontap: "doLogout",
            components: [{
                content: "Logout",
                classes: "moreOptionTitle"
            }, {
                tag: "i",
                classes: "fa fa-chevron-right moreOptionIcon"
            }]
        }]
    }, {
        name: "poweredByContainer",
        classes: "poweredByContainer",
        components: [{
            kind: "Image",
            src: "assets/Cisco.png",
            classes: "ciscoImage"
        }]
    }],
    showCityInfo: function() {
        app.pushView("CITYINFO");
    },
    bindLogoutEvent: function(inSender, inResponse) {
        UserModel.logoutUser(UserModel.userObject.name, this.logoutSuccess, this.logoutError, this);
    },
    doLogout: function(inSender, inResponse) {
        AppConfig.log(this.owner);
        this.owner.setLogOutInfo(this);
        this.owner.$.logoutPopup.show();
        // UserModel.logoutUser(UserModel.userObject.name, this.logoutSuccess, this.logoutError, this);
    },
    // logoutSuccess: function(inSender, inResponse) {
    //     UserModel.userObject = inResponse;
    //     window.location.reload();
    //     app.setViewDirect("LOGIN");
    //     sessionStorage.removeItem("token");
    //     this.bubble('onAssignUserRole');
    // },
    // logoutError: function(inSender, inResponse) {
    //     sessionStorage.removeItem("token");
    //     // window.location.href = AppConfig.debugURL + "portal";
    // },
    showAbout: function() {
        app.pushView("ABOUT");
    },
    showMapLayers: function() {
        app.pushView("MAPLAYERS");
    },
    showMyOffers: function() {
        AppConfig.log("My Offers");
        app.pushView("LOCALOFFERS");
    }
});
