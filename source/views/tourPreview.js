enyo.kind({
    name: "cls.tourPreview",
    kind: "FittableRows",
    handlers: {
        onSelectStop: "onSelectStop"
    },
    components: [{
        kind: "Signals",
        updateRoutes: "updateRoutes",
        updateRouteDirections: "updateRouteDirections"
    }, {
        name: "mainHeader",
        kind: "cls.navHeader",
        title: "",
    }, {
        name: "mapAndStepTab",
        classes: "mapAndStepTab",
        fit: true,
        kind: "FittableRows",
        components: [{
            kind: "Signals",
            changedToView: "viewChanged",
            startTourAgain: "startTourAgain"
        }, {
            name: "tourTabBar",
            classes: "eventsViewFilterButtons list-view-filter-buttons",
            kind: "onyx.RadioGroup",
            components: [{
                content: "Map",
                active: true,
                classes: "rButton list-view-filter-button",
                ontap: "switchTabs",
                index: 0
            }, {
                content: "Step by Step",
                classes: "rButton list-view-filter-button",
                ontap: "switchTabs",
                index: 1
            }],
        }, {
            name: "AppViews",
            fit: true,
            kind: "Panels",
            components: [{
                name: "mapContent",
                components: []
            }, {
                name: "stepByStepContent",
                components: [{
                    name: "stepByStepTours",
                    kind: "tourStops",
                    data: ""
                }]
            }]
        }, {
            name: "footerContent",
            classes: "footerContent",
            components: [{
                kind: "onyx.Button",
                name: "tourStartButton",
                content: "Start Tour",
                ontap: "startTour",
                classes: "startTourButton"
            }, {
                kind: "onyx.Button",
                name: "tourViewButton",
                content: "View Tour",
                ontap: "viewTour",
                classes: "startTourButton"
            }]
        }]
    }],
    bindings: [{
        from: ".app.selectedTour.title",
        to: ".$.mainHeader.title"
    }],
    create: function() {
        this.inherited(arguments);
        this.$.tourViewButton.hide();
    },
    backToTourDetailScreen: function() {
        app.popView();
    },
    switchTabs: function(inSender, inResponse) {
        this.$.AppViews.setIndex(inResponse.originator.index);
    },
    updateRoutes: function() {
        try {
            this.data = RoutesModel.routesObject;
            var record = this.data[0];
            this.$.mainHeader.setTitle(record.ROUTE_NAME);
        } catch (e) {}
    },
    viewChanged: function(inSender, inEvent) {
        if (inEvent.newView == this.name) {
            if (!this.map) {
                this.map = this.$.mapContent.createComponent({
                    name: "tourPreviewMap",
                    kind: "LeafletMap",
                    classes: "map tourpreviewMap"
                }, {
                    owner: this
                });
                this.$.mapContent.render();
                // this.$.AppViews.reflow();
            // } else {
            //     this.resized();
            }
            this.updateRouteDirections();
            if (app.selectedTour.get('title') == "Smart City Walking Tour") {
                this.$.mainHeader.setTitle("Smart City Tour " + (RoutesDirectionModel.tourType || "A"));
            }           
        }
    },
    updateRouteDirections: function() {
        if (this.map) {
            this.map.addPolyLine(RoutesDirectionModel.routesDirectionObject.Stops, true, true);
            this.$.stepByStepTours.setData(RoutesDirectionModel.routesDirectionObject.Stops);
        }
    },
    startTour: function() {
        app.pushView("TOURDIRECTIONS");
        cls.tourPreview.currentTour = this.$.mainHeader.getTitle();
        enyo.Signals.send("startTour");
        AnalyticsLogger.logAnalyticsData({
            event: "tourStart"
        });
        this.$.tourStartButton.hide();
        this.$.tourViewButton.show();
    },
    viewTour: function() {
        // tperry, returning not working, trying restarting the tour for now
        this.startTour();
        // app.pushView("TOURDIRECTIONS");
    },
    startTourAgain: function() {
        this.$.tourStartButton.show();
        this.$.tourViewButton.hide();
    },
    applyLayers: function() {
        LayersModel.changeLayerStatus("lights", true);
    },
    onSelectStop: function() {
        this.$.AppViews.setIndex(0);
    }
});
enyo.kind({
    name: "tourStops",
    classes: "tourDirectionSteps",
    kind: "Scroller",
    touch: true,
    touchOverscroll: false,
    published: {
        data: "",
        // flag: 0
    },
    components: [{
        kind: "enyo.Repeater",
        name: "stopsRepeater",
        onSetupItem: "setupItem",
        components: [{
            ontap: "selectStop",
            name: "StopUnit",
            classes: "tourStop",
            components: [{
                classes: "tourStopDetail",
                kind: "FittableColumns",
                components: [{
                    tag: "i",
                    classes: "fa fa-map-marker tourstopmarker"
                }, {
                    fit: true,
                    name: "tourStopContent",
                    classes: "tourStopContent",
                    components: [{
                        name: "tourStopTitle",
                        classes: "tourStopTitle",
                        content: "Stop"
                    }, {
                        name: "tourStopDistanceTime",
                        classes: "tourStopDistanceTime",
                        components: [{
                            name: "tourStopDistance",
                            classes: "tourStopUnit tourStopFirstUnit"
                        }, {
                            name: "tourStopDistanceUnit",
                            classes: "tourStopUnit"
                        }, {
                            name: "tourStopTime",
                            classes: "tourStopUnit"
                        }, {
                            name: "tourStopTimeUnit",
                            classes: "tourStopUnit"
                        }]
                    }, {
                        name: "tourStopDescription",
                        classes: "tourStopDescription"
                    }]
                }, {
                    tag: "i",
                    classes: "fa fa-chevron-right tourstoprightIcon"
                }]
            }, {
                name: "crowdLevel",
                classes: "tourCrowdLevel",
                components: [{
                    // kind: "FittableColumns",
                    classes: "tourPreviewCrowdLevel",
                    components: [{
                        classes: "crowdLevelContent",
                        content: "Crowd Level at Stop"
                    }, {
                        name: "tourCrowdLevelBar",
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
                }]
            }]
        }]
    }],
    create: function() {
        this.inherited(arguments);
        this.dataChanged();
    },
    setupItem: function(inSender, inEvent) {
        var record = this.data[inEvent.index];
        var dataLength = this.data.length;
        if (inEvent.index == 0) {
            inEvent.item.$.tourStopTitle.setContent("Tour Start");
        } else if (inEvent.index == (dataLength - 1)) {
            inEvent.item.$.tourStopTitle.setContent("Tour End");
            inEvent.item.$.tourStopDistanceTime.hide();
        } else {
            inEvent.item.$.tourStopTitle.setContent(record.Name);
        }
        inEvent.item.$.tourStopDescription.setContent(record.Description);
        inEvent.item.$.tourStopDistance.setContent(record.Distance);
        inEvent.item.$.tourStopDistanceUnit.setContent(record.DistanceUnit);
        inEvent.item.$.tourStopTime.setContent(record.Time);
        inEvent.item.$.tourStopTimeUnit.setContent(record.TimeUnit);
        // /*Random Crowd level*/
        var progress = (enyo.irand(100) + 1);
        AppConfig.log(progress);
        inEvent.item.$.tourCrowdLevelBar.setProgress(progress);
        inEvent.item.$.tourCrowdLevelBar.progressChanged();
    },
    selectStop: function(inSender, inEvent) {
        enyo.Signals.send("showTourStopDetail", {
            tourStopObject: RoutesDirectionModel.routesDirectionObject.Stops[inEvent.index]
        });
        this.bubble("onSelectStop");
    },
    dataChanged: function() {
        if (this.data) {
            this.$.stopsRepeater.set("count", 0);
            this.$.stopsRepeater.set("count", this.data.length);
        }
    }
});
