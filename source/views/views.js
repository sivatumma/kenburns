/**
    For simple applications, you might define all of your views in this file.  
    For more complex applications, you might choose to separate these kind definitions 
    into multiple files under this folder.
*/
enyo.kind({
    name: "cls.MainView",
    kind: "FittableRows",
    viewName: "MainView",
    published: {
        kioskId: "",
        currentUser: null,
        selectedView: "",
        selectedIndexInfo: "",
        data: '',
        notificationTypeInfo: '',
        logOutInfo: ''
    },
    handlers: {
        hideOfferPopup: "hideOfferPopup",
        hideTourStopDetailPopup: "hideTourStopDetailPopup",
        viewSelectedScreen: "viewSelectedScreen",
        kioskApiCall: "kioskApiCall",
        offerInfoReceivedData: "offerInfoReceivedData"
    },
    components: [{
        kind: "Signals",
        messageReceived: "messageReceived",
        showApplicationWideMessage: "showApplicationWideMessage",
        showTourStopDetail: "showTourStopDetail",
        updateEventKisoksNearBy: "updateEventKisoksNearBy",
        kioskStatusSignal: "kioskStatusSignal"
    }, {
        name: "ApplicationWideMessage",
        kind: "Popup"
    }, {
        name: "authDialog",
        kind: "cls.authenticationDialog"
    }, {
        kind: "Panels",
        fit: true,
        name: "viewPanels",
        draggable: false,
        components: [{
            kind: "cls.homeView",
            name: "HOME"
        }, {
            kind: "cls.listView",
            name: "LISTVIEW"
        }, {
            kind: "cls.moreView",
            name: "MORE"
        }, {
            kind: "cls.cityInformationView",
            name: "CITYINFO"
        }, {
            kind: "cls.tourDetailView",
            name: "TOURDETAIL"
        }, {
            kind: "cls.tourPreview",
            name: "TOURPREVIEW"
        }, {
            kind: "cls.tourSuccess",
            name: "TOURSUCCESS"
        }, {
            kind: "cls.routeDirections",
            name: "TOURDIRECTIONS"
        }, {
            kind: "offerDetailsView",
            name: "OFFERDETAILSVIEW"
        }, {
            kind: "eventDetailsView",
            name: "EVENTDETAILSVIEW"
        }, {
            kind: "cls.realRouteDirections",
            name: "REALEVENTDIRECTIONS"
        }, {
            kind: "cls.realRouteOfferDirections",
            name: "REALOFFERDIRECTIONS"
        }, {
            kind: "cls.aboutChicagoView",
            name: "ABOUTCHICAGO"
        }, {
            kind: "cls.about",
            name: "ABOUT"
        }, {
            kind: "cls.termsOfUse",
            name: "TERMSOFUSE"
        }, {
            kind: "cls.privacyPolicy",
            name: "PRIVACYPOLICY"
        }, {
            kind: "cls.mapLayers",
            name: "MAPLAYERS"
        }, {
            kind: "pushOfferDetailsView",
            name: "PUSHOFFERDETAILS"
        }, {
            kind: "cls.cityOfficials",
            name: "CITYOFFICIALS"
        }, {
            kind: "cls.localOffersView",
            name: "LOCALOFFERS"
        }]
    }, {
        kind: "onyx.Popup",
        name: "offerPopup",
        floating: true,
        scrim: false,
        style: "width:100%;height:100%;background:none;padding:0",
        components: [{
            kind: "onyx.Drawer",
            style: "position:absolute;bottom:0px;left:0px;width:100%",
            name: "offerPopupContainer",
            open: false,
            components: [{
                kind: "geoLocOfferAndPromotion",
                name: "offerPromotion"
            }]
        }]
    }, {
        kind: "onyx.Popup",
        name: "kioskPopup",
        floating: true,
        scrim: false,
        style: "width:100%;height:100%;background:none;padding:0;",
        components: [{
            kind: "onyx.Drawer",
            style: "position:absolute;bottom:0px;left:0px;width:100%",
            name: "kioskPopupContainer",
            open: true,
            components: [{
                kind: "kioskNotificationPopup",
                name: "kioskPromotion"
            }]
        }]
    }, {
        kind: "enyo.Lightbox",
        name: "tourStopDetailPopup",
        components: [{
            kind: "onyx.Drawer",
            name: "tourStopDetailPopupContainer",
            open: false,
            components: [{
                kind: "tourStopDetail",
                name: "tourStopDetailInfo"
            }]
        }]
    }, {
        kind: "enyo.Lightbox",
        name: "KioskNotFoundPopUp",
        classes: "comingSoonPopup",
        components: [{
            content: "<p wrap='true'>Currently there is no kiosk near to your current location.</p>",
            allowHtml:true
        }]
    }, {
        kind: "onyx.Popup",
        name: "logoutPopup",
        floating: true,
        scrim: false,
        style: "width:100%;height:100%;background:none;padding:0;",
        components: [{
            kind: "onyx.Drawer",
            classes: "logoutPopupContainer-cls",
            name: "logoutPopupContainer",
            open: true,
            components: [{
                kind: "FittableRows",
                name: "logoutPanel",
                components: [{
                    name: "logoutMessage",
                    classes: "logoutMessage-cls",
                    // content: "Do you want to logout?"
                    content: "Are you sure you want to log out?"
                }, {
                    name: "logoutConfirmationButtons",
                    kind: "FittableColumns",
                    classes: "logoutConfirmationButtons-cls",
                    components: [{
                        name: "logoutButton",
                        kind: "Button",
                        content: "Cancel",
                        classes: "logout-confirmation-cls",
                        ontap: "logoutConfirmHandler"
                    }, {
                        name: "logoutCancelButton",
                        kind: "Button",
                        content: "Confirm",
                        classes: "logout-confirmation-cls",
                        ontap: "logoutConfirmHandler"
                    }]
                }]
            }]
        }]
    }],
    bindings: [{
        from: ".app.currentUser",
        to: ".currentUser",
        transform: function(v) {
            if (v && v.loggedIn) {
                this.$.authDialog.hide();
            }
        }
    }, {
        from: ".app.currentView",
        to: ".selectedView",
        transform: function(v) {
            if (v) {
                this.$.viewPanels.selectPanelByName(v);
                enyo.Signals.send("changedToView", {
                    newView: v
                });
                app.viewTranistioning = false;
            }
            return v;
        }
    }],
    rendered: function() {
        this.inherited(arguments);
        if (localStorage.getItem("loggedIn")) {
            AppConfig.log("loggedIn");
            UserModel.userObject = UserModel.userObject || {};
            UserModel.userObject.loggedIn = true;
            var headerInfo = localStorage.getItem("tokenDetails");
            AppConfig.log(headerInfo);
            if (headerInfo) {
                UserModel.responseHeader = JSON.parse(headerInfo);
            }
            app.setCurrentUser(UserModel.userObject);
        } else {
            this.$.authDialog.show();
        }
    },
    messageReceived: function(inSender, inEvent) {
        var message = inEvent.message;
        AnalyticsLogger.logAnalyticsData({
            event: "notificationReceived",
            data: message
        });
        message = JSON.parse(message);
        if (message) {
            PushModel.currentPushMessageShownStatus = true;
            if (message.notificationType == "Kiosk") {
                this.$.kioskPopup.show();
                this.setKioskId(message.notificationID);
            } else {
                // OfferModel.loadOffer(message.notificationID)
                if (message.notificationType.toLowerCase() == "location") {
                    this.setNotificationTypeInfo(message.notificationType.toLowerCase());
                    OfferNotificationModel.loadOffer(message.notificationID);
                } else {
                    OfferNotificationModel.loadOffer(message.notificationID);
                }
            }
        }
    },
    hideOfferPopup: function() {
        this.$.offerPopupContainer.setOpen(false);
        this.$.offerPopup.hide();
        this.$.kioskPopup.hide();
    },
    mapMarkerSelected: function(inSender, inEvent) {
        var markerData = inEvent.markerData;
        AnalyticsLogger.logAnalyticsData({
            event: "mapMarkerSelected",
            data: markerData
        });
        var itemData = app.$.allItemsCollection.find(markerData);
        if (itemData) {
            this.$.mapMarkerPopup.show();
            this.$.mapMarkerPopup.setTourStopTitle(tourStopObject.Name);
            //this.$.tourStopDetailInfo.setTourStopImage(dummy.tours[Math.floor((Math.random() * 5) + 0)].tourImage);
            this.$.mapMarkerPopup.setTourStopImage("assets/TourImages/" + tourStopObject.Name + ".jpg");
            this.$.mapMarkerPopup.setTourStopContent(tourStopObject.Content);
            this.$.mapMarkerPopupContainer.setOpen(true);
        }
    },
    showTourStopDetail: function(inSender, inEvent) {
        var tourStopObject = inEvent.tourStopObject;
        AnalyticsLogger.logAnalyticsData({
            event: "reachedTourStop",
            data: tourStopObject
        });
        this.$.tourStopDetailPopup.show();
        this.$.tourStopDetailInfo.setTourStopTitle(tourStopObject.Name);
        //this.$.tourStopDetailInfo.setTourStopImage(dummy.tours[Math.floor((Math.random() * 5) + 0)].tourImage);
        this.$.tourStopDetailInfo.setTourStopImage("assets/TourImages/" + tourStopObject.Name + ".jpg");
        this.$.tourStopDetailInfo.setTourStopContent(tourStopObject.Content);
        this.$.tourStopDetailPopupContainer.setOpen(true);
    },
    hideTourStopDetailPopup: function() {
        this.$.tourStopDetailPopupContainer.setOpen(false);
        this.$.tourStopDetailPopup.hide();
    },
    viewSelectedScreen: function(inSender, inEvent) {
        this.$.kioskPopup.hide();
        if (inEvent.value == "Events") {
            this.$.viewPanels.setIndex(2);
        } else if (inEvent.value == "Offers") {
            this.$.viewPanels.setIndex(3);
        }
    },
    sessionExpiresMethod: function() {
        var today = new Date();
        var expDay = new Date(UserModel.responseHeader.token_expires);
        if (today >= expDay) {
            enyo.Signals.send("bindLogoutEvent");
        }
    },
    kioskApiCall: function(inSender, inEvent) {
        this.setSelectedIndexInfo(inEvent.id);
        var kioskVal = this.kioskId;
        if (kioskVal != '') {
            var kiosk = {
                "documentation": "Set content for specified kiosk",
                "find": {
                    "kiosk": {
                        "id": kioskVal
                    }
                },
                "process": {
                    "set": {
                        "currentContentsInfo": [{
                            "id": this.selectedIndexInfo
                        }]
                    }
                }
            };
            KioskModel.loadKisoks(kiosk);
        } else {
            var loc = app.getCurrentLocation();
            var kisokNearBy = {
                "documentation": "Get kiosks near specified geocoordinates",
                "find": {
                    "var": {
                        "name": "queryPoint",
                        "geocoordinates": {
                            "latitude": loc.latitude,
                            "longitude": loc.longitude
                        }
                    },
                    "kiosk": {
                        "le": {
                            "target": "distance(this, queryPoint)",
                            "value": AppConfig.kioskQueryRange
                        }
                    }
                }
            };
            KioskNearByModel.loadKisoksNearBy(kisokNearBy, inEvent.viewType);
        }
    },
    updateEventKisoksNearBy: function(inSender, inEvent) {
        this.setKioskId(KioskNearByModel.kioskNeaByrObject);
        this.kioskOfferIdValInfo();
    },
    kioskOfferIdValInfo: function() {
        AppConfig.log(this.kioskId);
        if (this.kioskId.length == 0) {
            this.$.KioskNotFoundPopUp.show();
        } else {
            AppConfig.log(this.kioskId);
            var kiosk = {
                "documentation": "Set content for specified kiosk",
                "find": {
                    "kiosk": {
                        "id": this.kioskId[0].id
                    }
                },
                "process": {
                    "set": {
                        "currentContentsInfo": [{
                            "id": this.selectedIndexInfo
                        }]
                    }
                }
            };
            KioskModel.loadKisoks(kiosk);
        }
        this.setKioskId('');
    },
    kioskStatusSignal: function(inSender, inEvent) {
        if (inEvent.status[0] === "Error") {
            this.$.KioskNotFoundPopUp.show();
        } else {
            AppConfig.log(inEvent.status);
        }
    },
    showApplicationWideMessage: function(inSender, inEvent) {
        this.$.ApplicationWideMessage.setContent(inEvent.message);
        this.$.ApplicationWideMessage.show();
        var that = this;
        setTimeout(function() {
            that.$.ApplicationWideMessage.hide();
        }, 1000);
    },
    logoutConfirmHandler: function(inSender, inEvent) {
        if (inSender.content === "Confirm") {
            this.$.logoutPopup.hide();
            UserModel.logoutUser(UserModel.userObject.name, this.logoutSuccess, this.logoutError, this.getLogOutInfo());
        } else {
            this.$.logoutPopup.hide();
        }
    },
    logoutSuccess: function(inSender, inResponse) {
        localStorage.removeItem("loggedIn");
        localStorage.removeItem("userObject");
        localStorage.removeItem("tokenDetails");
        localStorage.removeItem("iminchicago");
        localStorage.removeItem("token");
        window.location.reload();
    },
    logoutError: function(inSender, inResponse) {
        localStorage.removeItem("iminchicago");
        localStorage.removeItem("loggedIn");
        localStorage.removeItem("token");
        window.location.reload();
    }
});
