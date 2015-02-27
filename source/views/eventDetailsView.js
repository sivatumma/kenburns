enyo.kind({
    name: "eventDetailsView",
    content: "eventDetails View",
    classes: "eventDetailsView",
    kind: "FittableRows",
    handlers: {
        showDirections: "showDirections"
    },
    published: {
        // selectedEvent: null,
        selectedIndexInfo: '',
        eventDetailTitle: null // style: "text-align:center;vertical-align:middle;font-size:50px;position: absolute;top: 40%;",
    },
    components: [{
        name: "mainHeader",
        kind: "cls.navHeader",
        title: "",
    }, {
        kind: "Scroller",
        name: "eventDetailsInfoScreenScroller",
        horizontal: "hidden",
        vertical: "auto",
        classes: "eventDetailsInfoScreenScroller list-card-image",
        components: [{
            kind: "FittableRows",
            name: "eventDetailsInfoScreen",
            classes: "eventDetailsInfoScreen-cls",
            components: [{
                name: "eventDetailsObject",
                kind: "eventDetailKind",
                fit: true
            }, {
                style: "position: inherit;margin-top: 54px;",
                components: [{
                    name: "offerKiosk",
                    kind: "onyx.Button",
                    classes: "kiosk-details-button-cls",
                    content: "View on Kiosk",
                    ontap: "onTapKioskButton"
                }, {
                    kind: "eventDetailOptionButtons"
                }]
            }, {
                classes: "mildLine"
            }, {
                name: "deviceToolbar",
                kind: "cls.listItemToolbar",
                fit: true,
            }]
        }]
    }],
    bindings: [{
        from: ".app.selectedEvent.title",
        to: ".$.mainHeader.title",
        transform: function(v) {
            var eventDetailTitle = Utils.snippet(v, 25);
            // update the device status toolbar
            var deviceStatus = app.selectedEvent.get('deviceStatus');
            if (deviceStatus) {
                this.$.deviceToolbar.updateStatus(deviceStatus);
            }

            return eventDetailTitle;
        }
    }],
    //  handlers
    back: function(inSender, inEvent) {
        app.popView();
    },
    onTapKioskButton: function(inSender, inEvent) {
        this.setSelectedIndexInfo(app.selectedEvent.attributes.id);
        this.bubbleUp("kioskApiCall", {
            "id": this.selectedIndexInfo,
            "viewType": "EVENT"
        });
    },
    toggleeventDetailsViewFilterButtons: function(inSender, inEvent) {
        var originator = inEvent.originator;
        if (originator.getContent() == "Today's eventDetails") {
            this.$.eventDetailsViewContentArea.setIndex(0);
        } else {
            this.$.eventDetailsViewContentArea.setIndex(1);
        }
        return true;
    },
    showEventDetail: function(inSender, inEvent) {},
    // eventTitleBinder: function(inSender, inEvent) {
    //     this.$.eventDetailTitle.setContent(inEvent.title);
    // },
    showDirections: function() {
        var geocoordinates = this.$.eventDetailsObject.getGeocoordinates();
        //Start point is pointed to Tour start point statucally
        // RoutesDirectionRealModel.loadRealRoutesDirection(41.888189, -87.623, geocoordinates.latitude, geocoordinates.longitude, this.realEventDirections);
        var loc = app.getCurrentLocation() || {
            latitude: 41.87938,
            longitude: -87.624551,
            accuracy: 100
        };
        RoutesDirectionRealModel.loadRealRoutesDirection(loc.latitude, loc.longitude, geocoordinates.latitude, geocoordinates.longitude, this.realEventDirections);
        app.pushView("REALEVENTDIRECTIONS");
    },
    realEventDirections: function(inSender, inEvent) {
        if (inEvent) {
            RoutesDirectionRealModel.routesDirectionRealObject = inEvent.Output[0];
            enyo.Signals.send("updateRealRouteDirections", {
                directionObject: inEvent.Output[0]
            });
        }
    },
});
enyo.kind({
    name: "eventDetailKind",
    classes: "eventDetailKind",
    kind: "FittableRows",
    published: {
        geocoordinates: ""
    },
    components: [{
        name: "eventImageArea",
        kind: "FittableRows",
        imageURL: null,
        classes: "event-details-image-area",
        components: [{
            name: "filler",
            style: "height:60%"
        }, {
            kind: "Scroller",
            fit: true,
            components: [{
                name: "eventDescription",
                classes: "event-details-text"
            }]
        }]
    }, {
        name: "eventContentAreaBelowImage",
        classes: "eventContentAreaBelowImage",
        kind: "FittableRows",
        components: [{
                name: "eventTitle",
                classes: "event-details-other-title"
            }, {
                name: "eventTime",
                classes: "eventDetailTime"
            }, {
                name: "eventLocationLabel",
                classes: "event-details-small-title",
                content: "Location:"
            }, {
                name: "eventLocationStreet",
                classes: "event-details-small-title"
            }, {
                name: "eventDetailStreet2",
                classes: "event-details-small-title"
            }, {
                name: "eventLocationCity",
                classes: "event-details-small-title"
            },
            // {
            //     name: "eventLocationStateCode",
            //     classes: "eventLocationStateCode inline",
            //     allowHtml:true
            // },{
            //     name: "eventLocationPIN",
            //     classes: "eventLocationPIN inline",
            //     allowHtml:true
            // }
        ],
    }],
    bindings: [{
        from: ".app.selectedEvent.imageURL",
        to: ".$.eventImageArea.imageURL",
        transform: function(v) {
            this.$.eventImageArea.applyStyle("background-image", "url(" + v + ")");
        }
    }, {
        from: ".app.selectedEvent.title",
        to: ".$.eventTitle.content",
        transform: function(v) {
            // using this to set the address. I don't think you can bind to an array item, just top level properties
            var addressObj = app.selectedEvent.get("address");
            if (addressObj && addressObj[0]) {
                var address = addressObj[0];
                this.$.eventLocationStreet.setContent(address.street1 || "");
                this.$.eventLocationCity.setContent(address.city || "");
                this.geocoordinates = address.geocoordinates;
                // this.doEventLocUpdate({
                //     eventLat: address.geocoordinates.latitude,
                //     eventLong: address.geocoordinates.longitude
                // })
                // this.$.eventLocationStateCode.setContent(address.state || "");
                // this.$.eventLocationStreet.setContent(address.zip || "");
            }
            // return the title value
            return v;
        }
    }, {
        from: ".app.selectedEvent.body",
        to: ".$.eventDescription.content"
    }, {
        from: ".app.selectedEvent.street1",
        to: ".$.eventLocationStreet.content"
    }, {
        from: ".app.selectedEvent.street1",
        to: ".$.eventLocationStreet2.content"
    }, {
        from: ".app.selectedEvent.city",
        to: ".$.eventLocationCity.content"
    }, {
        from: ".app.selectedEvent.startTime",
        to: ".$.eventTime.content",
        transform: function(v) {
            // v is the value of .selectedEvent.startTime
            return app.createFriendlyDateString(v);
        }
    }, {
        from: ".app.selectedEvent.cityName",
        to: ".$.eventLocation.content"
    }],
});
enyo.kind({
    name: "navBack",
    // content: "< Back",
    classes: "navBack",
    components: [{
        classes: "fa fa-chevron-left inline"
    }, {
        content: "Back",
        classes: "inline"
    }]
});
enyo.kind({
    name: "eventDetailTitle",
    content: "Dynamic Title...",
    classes: "eventDetailTitle"
});
enyo.kind({
    name: "eventDetailOptionButtons",
    content: "Buttons",
    classes: "eventDetailOptionButtons",
    events: {
        onEventLocUpdate: ""
    },
    published: {
        eventLatitude: "",
        eventLongitude: ""
    },
    components: [{
        kind: "Button",
        content: "Get Directions",
        ontap: "onTapGetDirections"
    }],
    onTapGetDirections: function(inSender, inEvent) {
        this.bubble("showDirections");
        // RoutesDirectionRealModel.loadRealRoutesDirection(startLat, startLong, this.eventLatitude, this.eventLongitude);
        // app.pushView("TOURREALDIRECTIONS");
        // this.bubbleUp("showEventDirections", {
        //     "screen": 2
        // });
    }
});
