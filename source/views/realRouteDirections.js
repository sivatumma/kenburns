enyo.kind({
    name: "cls.realRouteDirections",
    kind: "FittableRows",
    components: [{
        kind: "Signals",
        updateRoutes: "updateRoutes",
        updateRealRouteDirections: "updateRealRouteDirections",
        changedToView: "viewChanged",
        startTour: "startTour"
    }, {
        kind: "enyo.FittableRows",
        classes: "maplayer",
        components: [{
            name: "mapLayersSection",
            classes: "mapLayersSection",
            components: [{
                // name: "routeDirectionsMapContent",
                name: "realRouteDirectionsMapContent",
                classes: "map mapHeight"
            }]
        }, {
            name: "mapFooter",
            kind: "cls.mainToolbar",
            classes: "mapFooter"
        }]
    }, {
        name: "mainHeader",
        kind: "cls.navHeader",
        classes: "overlay",
        title: "Loading Route...",
        smallText: true
    }],
    updateRoutes: function() {
        try {
            this.data = RoutesModel.routesObject;
            var record = this.data[0];
            this.$.tourTitle.setContent(record.ROUTE_NAME.slice(0, 14));
        } catch (e) {}
    },
    viewChanged: function(inSender, inEvent) {
        if (inEvent.newView == this.name) {
            if (!this.map) {
                this.map = this.$.realRouteDirectionsMapContent.createComponent({
                    name: "realTourDirectionsMap",
                    kind: "LeafletMap",
                    resetButton: true,
                    classes: "map tourpreviewMap",
                    onInstructionUpdate: "instructionUpdated"
                }, {
                    owner: this
                });
                this.$.realRouteDirectionsMapContent.render();
                this.updateRealRouteDirections();
            }
            this.$.mapFooter.setMode("map_view");
        }
    },
    updateRealRouteDirections: function() {
        if (this.map) {
            this.map.addDirectionPolyLine(RoutesDirectionRealModel.routesDirectionRealObject.RouteDirections);
            this.startTour();
        }
    },
    //  updateRealRouteDirections: function(inSender, inEvent) {
    //     if (this.map) {
    //         this.map.addDirectionPolyLine(inEvent.directionObject.RouteDirections);
    //         this.startTour();
    //     }
    // },
    startTour: function() {
        if (this.map && RoutesDirectionRealModel.routesDirectionRealObject) {
            this.map.routingStarted = true;
            this.map.locate(true, false);
            // if (app.getSelectedLayer()) {
            //     this.map.addMapLayer(app.getSelectedLayer());
            // }
        }
    },
    instructionUpdated: function(inSender, inEvent) {
        this.$.mainHeader.setTitle(inEvent.instruction);
    }
});
