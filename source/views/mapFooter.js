enyo.kind({
    kind: "FittableRows",
    name: "mapFooter",
    components: [{
        kind: "FittableColumns",
        name: "mapFooterHeader",
        classes: "mapFooter-cls",
        components: [{
            name: "mapFooterHeaderName",
            fit: true,
            classes: "mapFooterHeaderName-cls",
            content: "Map Layers"
        }, {
            components: [{
                name: "mapFooterHeaderUpArrow",
                style: "height:100%; width: 65px;",
                components: [{
                    name: "mapFooterHeaderUpArrowImage",
                    kind: "Image",
                    src: "assets/upArrow.png",
                    classes: "mapFooterHeaderUpArrow-cls",
                    ontap: "showMenuList"
                }, {
                    name: "mapFooterHeaderDownArrowImage",
                    kind: "Image",
                    src: "assets/DownArrow.png",
                    classes: "mapFooterHeaderUpArrow-cls mapFooterHeaderDownArrow-cls",
                    ontap: "applyLayers"
                }]
            }]
        }]
    }, {
        kind: "addLayersComponent",
        name: "mapLayersContainer",
        classes: "mapLayersContainer"
    }],
    create: function() {
        this.inherited(arguments);
        this.$.mapFooterHeaderDownArrowImage.hide();
    },
    showMenuList: function(inSender, inEvent) {
        inSender.hide();
        this.addClass("mapFooter-main-cls");
        this.$.mapFooterHeaderDownArrowImage.show();
        this.$.mapLayersContainer.createCheckBoxComponents(inSender, inEvent);
        this.$.mapLayersContainer.show();
    },
    applyLayers: function(inSender, inEvent) {
        inSender.hide();
        this.removeClass("mapFooter-main-cls");
        this.$.mapFooterHeaderUpArrowImage.show();
        _.each(this.$.mapLayersContainer.$.checkBoxContainer.children, function(child) {
            if (child.getValue()) {
                enyo.Signals.send("showLoader");
            }
            LayersModel.changeLayerStatus(child.content, child.getValue());
        });
        // enyo.Signals.send("applyLayers");
        this.$.mapLayersContainer.hide();
    }
});
/*Add Layer popup*/
enyo.kind({
    name: "addLayersComponent",
    kind: "FittableRows",
    // classes:"addLayersComponent",
    published: {
        layers: ""
    },
    components: [{
        name: "layerSelectionInfo",
        classes: "layerSelectionInfo",
        components: [{
            kind: "Scroller",
            classes: "checkBoxScrollercontainer",
            horizontal: "hidden",
            /*Layers to be added dynamicaly*/
            components: [{
                name: "checkBoxContainer",
                classes: "checkBoxContainer"
            }]
        }]
    }],
    create: function() {
        this.inherited(arguments);
    },
    createCheckBoxComponents: function(inSender, inEvent) {
        var that = this;
        this.layers = LayersModel.layersObj;
        this.$.checkBoxContainer.children = [];
        _.each(LayersModel.layersObj, function(layer) {
            that.$.checkBoxContainer.createComponent({
                kind: "layersSelectionComponent",
                checkedStatus: layer.active,
                layer: layer.layerName,
            }, {
                owner: that
            });
            that.$.checkBoxContainer.render();
        });
    },
    hidePopup: function(argument) {
        this.bubbleUp("hideLayerPopup");
    }
});
/*Reusable component to be used for each layer*/
enyo.kind({
    name: "layersSelectionComponent",
    kind: "onyx.Checkbox",
    classes: "layersSelectionComponent layerSelectionCheckbox",
    content: "",
    published: {
        layer: "",
        checkedStatus: false
    },
    create: function() {
        this.inherited(arguments);
        this.layerChanged();
        this.checkedStatusChanged();
    },
    checkedStatusChanged: function() {
        this.setValue(this.checkedStatus);
    },
    layerChanged: function() {
        this.setContent(this.layer);
    },
    checkboxSelected: function(inSender) {}
});