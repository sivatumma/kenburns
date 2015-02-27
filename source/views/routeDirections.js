enyo.kind({
    name: "cls.routeDirections",
    classes: "mapLayers",
    components: [{
        kind: "Signals",
        updateRoutes: "updateRoutes",
        updateRouteDirections: "updateRouteDirections",
        updateHeader: "updateHeader",
        changedToView: "viewChanged",
        startTour: "startTour"
    }, {
        kind: "enyo.FittableRows",
        classes: "maplayer",
        components: [{
            name: "mapLayersSection",
            classes:"mapLayersSection",
            components: [{
                name: "routeDirectionsMapContent",
                classes: "map mapHeight"
            }]
        }, {
            name: "mapFooter",
            kind: "cls.mainToolbar",
            classes:"mapFooter"
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
                this.map = this.$.routeDirectionsMapContent.createComponent({
                    name: "tourDirectionsMap",
                    kind: "LeafletMap",
                    classes: "map tourpreviewMap",
                    fit: true,
                    onInstructionUpdate: "instructionUpdated"
                }, {
                    owner: this
                });
                this.$.routeDirectionsMapContent.render();
                this.updateRouteDirections();
            }
            this.$.mapFooter.setMode("map_view");
        } else {
            if (this.map) {
                this.map.stopRouting();
            }
        }
    },
    updateRouteDirections: function() {
        if (this.map) {
            this.map.addPolyLine(RoutesDirectionModel.routesDirectionObject.Stops, true, true);
            // this.startTour();
        }
    },
    startTour: function() {
        if (this.map) {
            this.map.locate();
        }
    },
    instructionUpdated: function(inSender, inEvent) {
        this.$.mainHeader.setTitle(inEvent.instruction);
        // this.$.previewTourInstruction.setInstruction(inEvent.instruction);
    },
    // updateHeader: function(inSender, inEvent) {
    //     this.$.selectedTourTitle.setContent(inEvent.title);
    // }

});

enyo.kind({
    name: "instructionComponent",
    classes: "instructionComponent",
    kind: "FittableRows",
    published: {
        instruction: ""
    },
    components: [{
        kind: "FittableColumns",
        components: [{
            name: "instructionDirection",
            classes: "instructionDirection fa fa-location-arrow"
        }, {
            name: "instruction",
            content: ""
        }]
    }],
    create: function() {
        this.inherited(arguments);
        this.instructionChanged();
    },
    instructionChanged: function() {
        this.$.instruction.setContent(this.instruction);
    }
});
