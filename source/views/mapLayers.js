enyo.kind({
    name: "cls.mapLayers",
    classes: "mapLayers",
    published: {
        data: '',
        color: "#FFFFFF", //Any HEX color works
        diameter: "30",
        defaultLayers: null
    },
    components: [{
        kind: "Signals",
        changedToView: "viewChanged",
        showLoader: "showLoader",
        hideLoader: "hideLoader"
    }, {
        name: "spinnerSection",
        style: "display:none",
        components: [{
            kind: "jmtk.Spinner",
            name: "spinner",
            classes: "mySpinner",
            content: "Loading...",
        }]
    }, {
        kind: "enyo.FittableRows",
        classes: "maplayer",
        components: [{
            name: "mapLayersSection",
            classes:"mapLayersSection",
            components: [{
                name: "mapLayersArea",
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
        title: "Smart City Map"
    }],
    create: function() {
        this.inherited(arguments);
        // this.defaultLayers = ["events","tours"];// TOO MANY OF THESE - need to optimize,"Key City Assets"];
        this.defaultLayers = ["events","tours","Key City Assets"];
    },
    rendered: function() {
        this.inherited(arguments);
        this.colorChanged();
        this.diameterChanged();
    },
    viewChanged: function(inSender, inEvent) {
        if (inEvent.newView == this.name) {
            if (!this.map) {
                this.map = this.$.mapLayersArea.createComponent({
                    name: "mapLayers",
                    kind: "LeafletMap",
                    classes: "map mapHeight",
                    zoom: 19
                });
                this.$.mapLayersArea.render();
                // load city bldgs, tours and events
                _.each(this.defaultLayers, function(layerName) {
                    LayersModel.changeLayerStatus(layerName, true);
                });
            }
            this.$.mapFooter.setMode("map_view");
        }
    },
    colorChanged: function() {
        this.$.spinner.setColor(this.color);
    },
    diameterChanged: function() {
        this.$.spinner.setDiameter(this.diameter);
    },
    showLoader: function(inSender, inEvent) {
        this.$.spinnerSection.show();
    },
    hideLoader: function(inSender, inEvent) {
        this.$.spinnerSection.hide();
    }
});