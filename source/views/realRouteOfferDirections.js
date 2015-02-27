enyo.kind({
    name: "cls.realRouteOfferDirections",
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
                name: "realOfferDirectionsMapContent",
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
    create: function() {
        this.inherited(arguments);
    },
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
                this.map = this.$.realOfferDirectionsMapContent.createComponent({
                    name: "realOfferDirectionsMap",
                    kind: "LeafletMap",
                    resetButton: true,
                    classes: "map tourpreviewMap",
                    onInstructionUpdate: "instructionUpdated"
                }, {
                    owner: this
                });
                this.$.realOfferDirectionsMapContent.render();
                this.updateRealRouteDirections();
            }
            this.$.mapFooter.setMode("map_view");
        }
    },
    updateRealRouteDirections: function() {
        if (this.map) {
            this.map.addDirectionPolyLine(RoutesDirectionRealModel.routesDirectionRealOfferObject.RouteDirections);
            this.startTour();
        }
    },
    startTour: function() {
        if (this.map && RoutesDirectionRealModel.routesDirectionRealOfferObject) {
            this.map.locate(false, true);
            // if (app.getSelectedLayer()) {
            //     this.map.addMapLayer(app.getSelectedLayer());
            // }
        }
    },
    instructionUpdated: function(inSender, inEvent) {
        this.$.mainHeader.setTitle(inEvent.instruction);
    }
});
