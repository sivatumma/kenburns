enyo.kind({
    name: "cls.tourDetailView",
    classes: "tourDetailView",
    published: {
        data: ''
    },
    components: [{
        kind: "Signals",
        changedToView: "viewChanged",
        updateRouteDirections: "updateRouteDirections",
        updateRoutes: "updateRoutes"
    }, {
        name: "mainHeader",
        kind: "cls.navHeader",
        classes: "overlay",
        title: "",
    }, {
        name: "tourDetailContent",
        classes: "tourDetailContent tour-details-bg",
        name: "itemImage",
        imageURL: null,
        components: [{
            kind: "FittableRows",
            classes: "tour-details-bg-overlay",
            components: [{
                name: "filler",
                fit: true
            },{
                classes: "tour-details-area",
                kind: "FittableRows",
                components: [{
                    name: "tourSubTitle",
                    classes: "tour-details-title",
                    content: "Welcome"
                }, {
                    name: "tourDescription",
                    kind:"enyo.Scroller",
                    touchScrolling: true,
                    strategyKind: (enyo.platform.ios >= 5) ? "TransitionScrollStrategy" : undefined,
                    classes: "tour-details-description"
                }, {
                    kind: "FittableColumns",
                    classes: "tour-time-date-row",
                    components: [{
                        kind: "FittableColumns",
                        classes: "tour-time-date-right",
                        fit: true,
                        components: [{
                            name: "eventTimeLabel",
                            classes: "tour-time-date-label short-text",
                            content: "Time:"
                        }, {
                            name: "tourEstimatedTime",
                            classes: "tour-time-date-text short-text",
                            fit: true
                        }]
                    },{
                        kind: "FittableColumns",
                        classes: "tour-time-date-left",
                        components: [{
                            name: "eventLocationLabel",
                            classes: "tour-time-date-label short-text",
                            content: "Distance:"
                        }, {
                            name: "tourDistance",
                            classes: "tour-time-date-text short-text",
                            fit: true
                        }]
                    }]
                }, {
                    name: "tourButtons",
                    classes: "tour-details-button-area",
                    components: [{
                        kind: "Button",
                        content: "Tour A",
                        classes: "tour-preview-button greenBG",
                            ontap: "previewTourA"
                        }, {
                            kind: "Button",
                            content: "Tour B",
                        classes: "tour-preview-button redBG",
                            ontap: "previewTourB"
                        }]
                }]
            }]
        }]
    }],
    bindings: [{
        from: ".app.selectedTour.title",
        to: ".$.mainHeader.title"
    },{
        from: ".app.selectedTour.body",
        to: ".$.tourDescription.content"
    }, {
        from: ".app.selectedTour.imageURL",
        to: ".$.itemImage.imageURL",
        transform: function(v) {
        // set background image
        this.$.itemImage.applyStyle("background-image", "url(" + v + ")");
            return v;
        }
    }, {
        from: ".app.selectedTour.DISTANCE",
        to: ".$.tourDistance.content",
        transform: function(v) {
            var roundedDistance = Math.round(v*100)/100;
            return roundedDistance + " " + app.selectedTour.get('DISTANCEUNIT').toLowerCase();;
        }
    }, {
        from: ".app.selectedTour.TIME",
        to: ".$.tourEstimatedTime.content",
        transform: function(v) {
            var roundedTime = Math.round(v*100)/100;
            return roundedTime + " " + app.selectedTour.get('TIMEUNIT').toLowerCase();;
        }
    }],
    backToTourScreen: function(inSender, inEvent) {
        app.popView();
    },
    previewTourA: function(inSender, inEvent) {
        RoutesDirectionModel.loadRoutesDirection(1);
        app.pushView("TOURPREVIEW");
    },
    previewTourB: function(inSender, inEvent) {
        RoutesDirectionModel.loadRoutesDirection(2);
        app.pushView("TOURPREVIEW");
    },
    viewChanged: function(inSender, inEvent) {
        var that = this;
        if (inEvent.newView == this.name) {
        }
    },
    updateRouteDirections: function() {
        if (this.map) {
            AppConfig.log(RoutesDirectionModel.routesDirectionObject.Stops);
            this.map.addPolyLine(RoutesDirectionModel.routesDirectionObject.Stops, true, false);
        }
    }
});
