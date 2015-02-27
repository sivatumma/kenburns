// enyo.kind({name:"offerDetailsView", content:"HI EVENT DETAILS !!"});
enyo.kind({
    name: "offerDetailsView",
    content: "offerDetails View",
    classes: "offerDetailsView",
    published: {
        offerIdVal: '',
        selectedIndexInfo: ''
    },
    handlers: {
        showOfferDirections: "showOfferDirections"
    },
    components: [{
        kind: "Signals"
    }, {
        name: "mainHeader",
        kind: "cls.navHeader",
        title: "",
    }, {
        kind: "Scroller",
        // classes:"offerDetailsContentArea",
        horizontal: "hidden",
        components: [{
            kind: "offerDetailKind",
            name: "offerDetailsObject"
        }, {
            name: "offerDetailsKiosk",
            kind: "onyx.Button",
            classes: "kiosk-details-button-cls",
            content: "View on Kiosk",
            ontap: "onTapKioskOfferDetailsButton"
        }, {
            kind: "offerDetailOptionButtons"
        }, {
            classes: "mildLine"
        }, {
            classes: "crowdLevelLabel",
            content: "Crowd Level at Event:"
        }, {
            name: "crowdOfferLevelBar",
            kind: "ColorProgressBar",
            classes: "indicator-bar",
            maxColor: "#f44",
            minColor: "#40f040",
            progress: 0,
            barClasses: "onyx-dark"
        }, {
            name: "geocoordinates"
        }, {
            name: "deviceToolbar",
            kind: "cls.listItemToolbar",
            fit: true,
        }]
    }],
    bindings: [{
        from: ".app.selectedOffer.title",
        to: ".$.mainHeader.title",
        transform: function(v) {
            var deviceStatus = app.selectedOffer.get('deviceStatus');
            if (deviceStatus) {
                this.$.deviceToolbar.updateStatus(deviceStatus);
            }

            return Utils.snippet(v, 30);
        }
    }, {
        from: ".app.selectedOffer.geocoordinates",
        to: ".geocoordinates",
        transform: function(v) {
            AppConfig.log(v);
            if (v) {
                var pdata = {
                    "query": {
                        "documentation": "Get nearby parking spots (distance in miles)",
                        "find": {
                            "var": {
                                "name": "queryPoint",
                                "geocoordinates": {
                                    "latitude": v.latitude,
                                    "longitude": v.longitude
                                }
                            },
                            "parkingSpace": {
                                "le": {
                                    "target": "distance(this.parkingSpots, queryPoint)",
                                    "value": "1.0"
                                }
                            }
                        }
                    }
                };
                ParkingModel.loadParkingData(pdata);
            }
            return v;
        }
    }],
    back: function(inSender, inEvent) {
        app.popView();
    },
    toggleofferDetailsViewFilterButtons: function(inSender, inEvent) {
        var originator = inEvent.originator;
        if (originator.getContent() == "Today's offerDetails") {
            this.$.offerDetailsViewContentArea.setIndex(0);
        } else {
            this.$.offerDetailsViewContentArea.setIndex(1);
        }
        return true;
    },
    showEventDetail: function(inSender, inEvent) {},
    offerTitleBinder: function(inSender, inEvent) {
        this.$.offerDetailTitle.setContent(inEvent.title);
    },
    onTapKioskOfferDetailsButton: function(inSender, inEvent) {
        this.setSelectedIndexInfo(app.selectedOffer.attributes.id);
        this.bubbleUp("kioskApiCall", {
            "id": this.selectedIndexInfo,
            "viewType": "OFFER"
        });
    },
    showOfferDirections: function() {
        var geocoordinates = this.$.offerDetailsObject.getGeocoordinates();
        //Start point is pointed to Tour start point statucally
        // RoutesDirectionRealModel.loadRealRoutesDirection(41.888189, -87.623, geocoordinates.latitude, geocoordinates.longitude, this.realOfferDirections);
        var loc = app.getCurrentLocation() || {
            latitude: 41.87938,
            longitude: -87.624551,
            accuracy: 100
        };
        RoutesDirectionRealModel.loadRealRoutesDirection(loc.latitude, loc.longitude, geocoordinates.latitude, geocoordinates.longitude, this.realOfferDirections);
        app.pushView("REALOFFERDIRECTIONS");
    },
    realOfferDirections: function(inSender, inEvent) {
        if (inEvent) {
            RoutesDirectionRealModel.routesDirectionRealOfferObject = inEvent.Output[0];
            enyo.Signals.send("updateRealRouteDirections", {
                directionObject: inEvent.Output[0]
            });
        }
    },
});
enyo.kind({
    name: "offerDetailKind",
    classes: "offerDetailKind offerDetailMini",
    // kind: "Scroller",
    published: {
        data: "",
        geocoordinates: ""
    },
    create: function() {
        this.inherited(arguments);
    },
    constructor: function() {
        this.inherited(arguments);
    },
    components: [{
        kind: "Signals",
        bindSelectedOffer: "bindSelectedOffer"
    }, {
        name: "offerDetailImage",
        imageURL: null,
        classes: "offerDetailImage"
    }, {
        name: "offerContentAreaBelowImage",
        classes: "offerContentAreaBelowImage",
        components: [{
            name: "offerTitle",
            classes: "offerDetailTitle"
        }, {
            name: "offerDescription",
            classes: "offerDetailDescription"
        }, {
            name: "offerLocation",
            classes: "offerDetailLocation"
        }]
    }],
    bindings: [{
        from: ".app.selectedOffer.imageURL",
        to: ".$.offerDetailImage.imageURL",
        transform: function(v) {
            this.$.offerDetailImage.applyStyle("background-image", "url(" + v + ")");
        }
    }, {
        from: ".app.selectedOffer.title",
        to: ".$.offerTitle.content"
    }, {
        from: ".app.selectedOffer.body",
        to: ".$.offerDescription.content"
    }, {
        from: ".app.selectedOffer.location",
        to: ".$.offerLocation.content"
    }, {
        from: ".app.selectedOffer.geocoordinates",
        to: ".geocoordinates"
    }]
});
enyo.kind({
    name: "offerDetailOptionButtons",
    content: "Buttons",
    classes: "offerDetailOptionButtons",
    components: [{
        kind: "Button",
        content: "Get Directions",
        ontap: "getDirections"
    }],
    getDirections: function(inSender, inEvent) {
        this.bubble("showOfferDirections");
    }
});
