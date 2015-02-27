enyo.kind({
    name: "pushOfferDetailsView",
    content: "offerDetails View",
    classes: "offerDetailsView",
    published: {
        offerIdVal: ''
    },
    components: [{
        kind: "Signals",
        updateOfferDetailNotification: "updateOfferDetailNotification"
    }, {
        name: "mainHeader",
        kind: "cls.navHeader",
        title: ""
    }, {
        kind: "Scroller",
        horizontal: "hidden",
        components: [{
            kind: "pushOfferDetailKind"
        }, {
            classes: "mildLine"
        }, {
            classes: "crowdLevelLabel",
            content: "Crowd Level at Event:"
        }, {
            name: "offerCrowdLevelBar",
            kind: "ColorProgressBar",
            classes: "indicator-bar",
            maxColor: "#f44",
            minColor: "#40f040",
            colorStops: [{
                stop: 0.5,
                color: "#40f040"
            }, {
                stop: 0.75,
                color: "#f0f040"
            }, {
                stop: 0.9,
                color: "#f44"
            }],
            progress: 0,
            barClasses: "onyx-dark"
        }, {
            tag: "hr"
        }, {
            classes: "crowdLevelLabel",
            content: "Parking Availability at Event:"
        }, {
            name: "offerparkingAvailabilityLevelBar",
            kind: "ColorProgressBar",
            classes: "indicator-bar",
            maxColor: "#f44",
            minColor: "#40f040",
            colorStops: [{
                stop: 0.5,
                color: "#40f040"
            }, {
                stop: 0.75,
                color: "#f0f040"
            }, {
                stop: 0.9,
                color: "#f44"
            }],
            progress: 0,
            barClasses: "onyx-dark"
        }]
    }],
    create: function() {
        this.inherited(arguments);
        var progress = (enyo.irand(100) + 1);
        this.$.offerCrowdLevelBar.setProgress(progress);
        var parkingProgress = (enyo.irand(100) + 1);
        this.$.offerparkingAvailabilityLevelBar.setProgress(parkingProgress);
    },
    updateOfferDetailNotification: function(inSender, inEvent) {
        this.$.mainHeader.setTitle(inEvent.offerNotificationObject.title);
    },
    back: function(inSender, inEvent) {
        app.popView();
    }
});
enyo.kind({
    name: "pushOfferDetailKind",
    classes: "offerDetailKind offerDetailMini",
    published: {
        data: ""
    },
    components: [{
        kind: "Signals",
        updateOfferDetailNotification: "updateOfferDetailNotification",
    }, {
        kind: "Image",
        name: "pushOfferThumbImage",
        classes: "offerDetailImage"
    }, {
        name: "pushOfferContentArea",
        classes: "offerContentAreaBelowImage",
        components: [{
            content: "Coupon Image:",
            classes: "offerDetailTitle"
        }, {
            kind: "Image",
            classes: "pushOfferCouponImage",
            name: "pushOfferCouponImage"
        }, {
            name: "pushOfferTitle",
            classes: "offerDetailTitle"
        }, {
            name: "pushOfferDescription",
            classes: "offerDetailDescription"
        }, {
            name: "pushOfferLocation",
            classes: "offerDetailLocation"
        }]
    }],
    create: function() {
        this.inherited(arguments);
    },

    updateOfferDetailNotification: function(inSender, inEvent) {
        var offerNotification = inEvent.offerNotificationObject;
        if (offerNotification.thumb && offerNotification.thumb.indexOf("http") != 0) {
            offerNotification.thumb = AppConfig.baseURL + "offer-images/" + offerNotification.thumb;
        }
        this.$.pushOfferThumbImage.setSrc(offerNotification.thumb);
        if (offerNotification.coupon && offerNotification.coupon.indexOf("http") != 0) {
            offerNotification.coupon = AppConfig.baseURL + "offer-images/" + offerNotification.coupon;
        }
        this.$.pushOfferCouponImage.setSrc(offerNotification.coupon);
        this.$.pushOfferTitle.setContent(offerNotification.title);
        this.$.pushOfferDescription.setContent(offerNotification.description);
        this.$.pushOfferLocation.setContent(offerNotification.location);
    }
});
