enyo.kind({
    name: "cls.mainToolbar",
    classes: "main-toolbar",
    kind: "FittableColumns",
    published: {
        focusedMapLayer: null,
        userLocation: null,
        deviceStatus: null,
        selectedLayer: "",
        mode: "home_view"
    },
    components: [{
        //     classes: "main-toolbar-button-col0 hidden",
        //     name: "checkMarkColumn",
        //     kind: "FittableRows",
        //     components: [{
        //         name: "CCheck",
        //         classes: "glyph icon-crowds main-toolbar-button",
        //         ontap: "tapHandler",
        //         ondragstart: "dragStartHandler",
        //         dataLayerName: "crowd",
        //         mapLayer: "CROWD"
        //     },{
        //         name: "SCheck",
        //         classes: "glyph icon-lighting main-toolbar-button",
        //         ontap: "tapHandler",
        //         ondragstart: "dragStartHandler",
        //         dataLayerName: "lights",
        //         mapLayer: "SPECIAL"
        //     },{
        //         name: "KCheck",
        //         classes: "glyph icon-kiosk main-toolbar-button",
        //         ontap: "tapHandler",
        //         ondragstart: "dragStartHandler",
        //         dataLayerName: "kiosks",
        //         mapLayer: "KIOSKS"
        //     },{
        //         name: "TCheck",
        //         classes: "glyph icon-traffic main-toolbar-button",
        //         ontap: "tapHandler",
        //         ondragstart: "dragStartHandler",
        //         dataLayerName: "traffic",
        //         mapLayer: "TRAFFIC"
        //     },{
        //         name: "PCheck",
        //         classes: "glyph icon-parking main-toolbar-button",
        //         ontap: "tapHandler",
        //         ondragstart: "dragStartHandler",
        //         dataLayerName: "parking",
        //         mapLayer: "PARKING"
        //     }]
        // },{        
        classes: "main-toolbar-button-col1",
        kind: "FittableRows",
        components: [{
            name: "CIcon",
            classes: "glyph icon-crowds main-toolbar-button-blue",
            ontap: "tapHandler",
            ondragstart: "dragStartHandler",
            dataLayerName: "crowd",
            mapLayer: "CROWD"
        }, {
            name: "SIcon",
            classes: "glyph icon-lighting main-toolbar-button-blue",
            ontap: "tapHandler",
            ondragstart: "dragStartHandler",
            dataLayerName: "lights",
            mapLayer: "SPECIAL"
        }, {
            name: "KIcon",
            classes: "glyph icon-kiosk-v2 main-toolbar-button-blue",
            ontap: "tapHandler",
            ondragstart: "dragStartHandler",
            dataLayerName: "kiosks",
            mapLayer: "KIOSKS"
        }, {
            name: "TIcon",
            classes: "glyph icon-traffic-v2 main-toolbar-button-blue",
            ontap: "tapHandler",
            ondragstart: "dragStartHandler",
            dataLayerName: "traffic",
            mapLayer: "TRAFFIC"
        }, {
            name: "PIcon",
            classes: "glyph icon-parking-taxi main-toolbar-button-blue",
            ontap: "tapHandler",
            ondragstart: "dragStartHandler",
            dataLayerName: "parking",
            mapLayer: "PARKING"
        }]
    }, {
        classes: "main-toolbar-button-col2-normal",
        name: "labelColumn",
        kind: "FittableRows",
        ontap: "tapHandler",
        components: [{
            name: "CTitle",
            content: "Crowd",
            classes: "main-toolbar-text-item-blue",
            ontap: "tapHandler",
            dataLayerName: "crowd",
            mapLayer: "CROWD"
        }, {
            name: "STitle",
            content: "Light",
            classes: "main-toolbar-text-item-blue",
            ontap: "tapHandler",
            dataLayerName: "lights",
            mapLayer: "SPECIAL"
        }, {
            name: "KTitle",
            content: "Kiosks",
            classes: "main-toolbar-text-item-blue",
            ontap: "tapHandler",
            dataLayerName: "kiosks",
            mapLayer: "KIOSKS"
        }, {
            name: "TTitle",
            content: "Traffic",
            classes: "main-toolbar-text-item-blue",
            ontap: "tapHandler",
            dataLayerName: "traffic",
            mapLayer: "TRAFFIC"
        }, {
            name: "PTitle",
            content: "Vehicle",
            classes: "main-toolbar-text-item-blue",
            ontap: "tapHandler",
            dataLayerName: "parking",
            mapLayer: "PARKING"
        }]
    }, {
        classes: "main-toolbar-button-col3",
        name: "activeColumn",
        kind: "FittableRows",
        ontap: "tapHandler",
        components: [{
            kind: "FittableRows",
            name: "CActive",
            classes: "main-toolbar-nearby inactive",
            ontap: "tapHandler",
            dataLayerName: "crowd",
            mapLayer: "CROWD",
            components: [{
                name: "CActiveText",
                content: "Near By >",
                classes: "main-toolbar-active-text",
            }, {
                name: "CLevelBar",
                kind: "ColorProgressBar",
                classes: "main-toolbar-active-bar",
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
        }, {
            kind: "FittableRows",
            name: "SActive",
            classes: "main-toolbar-nearby inactive",
            ontap: "tapHandler",
            dataLayerName: "lights",
            mapLayer: "SPECIAL",
            components: [{
                name: "SActiveText",
                content: "Near By >",
                classes: "main-toolbar-active-text"
            }, {
                name: "SLevelBar",
                kind: "ColorProgressBar",
                classes: "main-toolbar-active-bar",
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
        }, {
            kind: "FittableRows",
            classes: "main-toolbar-nearby inactive",
            name: "KActive",
            ontap: "tapHandler",
            dataLayerName: "kiosks",
            mapLayer: "KIOSKS",
            components: [{
                name: "KActiveText",
                content: "Near By >",
                classes: "main-toolbar-active-text"
            }, {
                name: "KLevelBar",
                kind: "ColorProgressBar",
                classes: "main-toolbar-active-bar",
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
        }, {
            kind: "FittableRows",
            name: "TActive",
            classes: "main-toolbar-nearby inactive",
            ontap: "tapHandler",
            dataLayerName: "traffic",
            mapLayer: "TRAFFIC",
            components: [{
                name: "TActiveText",
                content: "Near By >",
                classes: "main-toolbar-active-text"
            }, {
                name: "TLevelBar",
                kind: "ColorProgressBar",
                classes: "main-toolbar-active-bar",
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
        }, {
            kind: "FittableRows",
            name: "PActive",
            classes: "main-toolbar-nearby inactive",
            ontap: "tapHandler",
            dataLayerName: "parking",
            mapLayer: "PARKING",
            components: [{
                name: "PActiveText",
                content: "Near By >",
                classes: "main-toolbar-active-text",
            }, {
                name: "PLevelBar",
                kind: "ColorProgressBar",
                classes: "main-toolbar-active-bar",
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
    }],
    bindings: [{
        from: ".app.focusedMapLayer",
        to: ".focusedMapLayer"
    }, {
        from: ".app.selectedLayer",
        to: ".selectedLayer"
    }, {
        from: ".app.currentLocation",
        to: ".userLocation"
    }, {
        from: ".app.appStatus",
        to: ".deviceStatus"
    }],
    rendered: function() {
        this.inherited(arguments);
        this.userLocationChanged();
    },
    deviceStatusChanged: function(inOldVal) {

    },
    setMode: function(mode) {
        AppConfig.log("setting mode to " + mode);
        this.mode = mode;
        switch (this.mode) {
            case "map_view":
                this.$.activeColumn.setShowing(false);
                // this.$.labelColumn.addRemoveClass("main-toolbar-button-col2-normal", false);
                // this.$.labelColumn.addRemoveClass("main-toolbar-button-col2-small", true);
                break;
            default:
                this.$.activeColumn.setShowing(true);
                // this.$.labelColumn.addRemoveClass("main-toolbar-button-col2-normal", true);
                // this.$.labelColumn.addRemoveClass("main-toolbar-button-col2-small", false);
                break;
        }
        this.focusedMapLayerChanged();
    },
    userLocationChanged: function(oldValue) {
        var lat = null,
            lng = null,
            accuracy = null;
        if (this.userLocation) {
            lat = this.userLocation ? this.userLocation.latitude : null;
            lng = this.userLocation ? this.userLocation.longitude : null;
            accuracy = this.userLocation ? this.userLocation.accuracy : null;
        }

        var status = {};

        if (app.appStatus) {
            status["P"] = app.appStatus["P"] ? app.appStatus["P"] : -1;
            status["K"] = app.appStatus["K"] ? app.appStatus["K"] : -1;

            status["C"] = (lng ? cls.mapUtils.getHashValue(lng) % 100 : -1);
            status["S"] = (lng ? cls.mapUtils.getHashValue(lng + lat) % 100 : -1);
            status["T"] = (lat ? cls.mapUtils.getHashValue(lat + "" + accuracy) % 100 : -1);

            AppConfig.log("mapToolbar * * * * * * * location changed", app.appStatus);

            var names = ["P", "C", "K", "S", "T"];

            _.each(names, function(typeName) {
                var activeObj = this.$[typeName + "Active"];
                var iconObj = this.$[typeName + "Icon"];
                var pbarObj = this.$[typeName + "LevelBar"];
                var active = (status[typeName] > 0);
                AppConfig.log("mapToolbar * * * * * * * location changed", typeName, active, status[typeName]);

                pbarObj.setProgress(status[typeName]);
                iconObj.addRemoveClass("active", active);
                iconObj.addRemoveClass("inactive", !active);
                activeObj.addRemoveClass("active", active);
                activeObj.addRemoveClass("inactive", !active);
            }, this);
        }
    },
    focusedMapLayerChanged: function(oldValue) {
        var iconsOnly = this.mode == "map_view";
        var names = ["P", "C", "K", "S", "T"];

        // this.$.checkMarkColumn.addRemoveClass("hidden", !iconsOnly);

        _.each(names, function(typeName) {
            var titleObj = this.$[typeName + "Title"];
            var iconObj = this.$[typeName + "Icon"];
            var mapLayer = iconObj.mapLayer;

            // iconObj.addRemoveClass("main-toolbar-button", !iconsOnly);
            // iconObj.addRemoveClass("main-toolbar-button-blue", iconsOnly);
            // titleObj.addRemoveClass("main-toolbar-text-item", !iconsOnly);
            // titleObj.addRemoveClass("main-toolbar-text-item-blue", iconsOnly);

            if (titleObj) {
                if (!iconsOnly) {
                    titleObj.applyStyle("width", "100%");
                    iconObj.addRemoveClass("white-text", true);
                    iconObj.addRemoveClass("gray-text", false);
                    // titleObj.addRemoveClass("blue");
                } else {
                    iconObj.addRemoveClass("white-text", app.enabledMapLayers[mapLayer]);
                    iconObj.addRemoveClass("gray-text", !app.enabledMapLayers[mapLayer]);
                    // titleObj.removeClass("blue");
                    if (this.focusedMapLayer == mapLayer) {
                        titleObj.removeClass("main-toolbar-text-item-hidden");
                        titleObj.applyStyle("width", "80%");
                    } else {
                        titleObj.addClass("main-toolbar-text-item-hidden");
                        titleObj.applyStyle("width", app.enabledMapLayers[mapLayer] ? "10%" : "0");
                    }
                }
            }
        }, this);
    },
    dragStartHandler: function(inSender, inEvent) {
        var mapLayer = inSender.mapLayer;
        switch (mapLayer) {
            case "PARKING":
            case "CROWD":
            case "KIOSKS":
            case "SPECIAL":
            case "TRAFFIC":
                if (this.mode == "map_view") {
                    if (mapLayer == app.getFocusedMapLayer()) {
                        // do nothing when tapping on currently focused layer on the map
                    } else {
                        // add the selected layer
                        app.setFocusedMapLayer(mapLayer);
                        app.enabledMapLayers[mapLayer] = true;
                        LayersModel.changeLayerStatus(inSender.dataLayerName, true);
                        // this.focusedMapLayerChanged();
                    }
                }
                break;
            default:
                break;
        }
        return true;
    },
    tapHandler: function(inSender, inEvent) {
        var mapLayer = inSender.mapLayer;
        AppConfig.log(inSender.mapLayer);
        this.layerHandler(mapLayer, inSender.dataLayerName);
        return true;
    },
    selectedLayerChanged: function() {
        if (this.selectedLayer) {
            this.layerHandler(this.selectedLayer.mapLayer, this.selectedLayer.dataLayerName);
        }
    },
    layerHandler: function(mapLayer, dataLayerName) {
        switch (mapLayer) {
            case "PARKING":
            case "CROWD":
            case "KIOSKS":
            case "SPECIAL":
            case "TRAFFIC":
                if (this.mode == "map_view") {
                    if (mapLayer == app.getFocusedMapLayer()) {
                        // do nothing when tapping on currently focused layer on the map
                    } else {
                        if (app.enabledMapLayers[mapLayer]) {
                            // clicked the same layer twice, so remove it
                            app.enabledMapLayers[mapLayer] = null;
                            LayersModel.changeLayerStatus(dataLayerName, false);
                        } else {
                            // add the selected layer
                            app.enabledMapLayers[mapLayer] = true;
                            LayersModel.changeLayerStatus(dataLayerName, true);
                        }
                    }
                } else {
                    // set focus layer to this layer and add it if it isn't in the enabled layers list
                    app.setFocusedMapLayer(mapLayer);
                    app.enabledMapLayers[mapLayer] = true;
                    LayersModel.changeLayerStatus(dataLayerName, true);
                    // show the map if not already viewing it
                    if (app.currentView != "MAPLAYERS") {
                        app.pushView("MAPLAYERS");
                    }
                }
                this.focusedMapLayerChanged();
                break;
            default:
                break;
        }
    }
});
