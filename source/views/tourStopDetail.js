enyo.kind({
    name: "tourStopDetail",
    classes: "tourStopDetail",
    kind: "FittableRows",
    published: {
        tourStopTitle: "",
        tourStopImage: "",
        tourStopContent: ""
    },
    components: [{
        name: "tourPreviewnav",
        classes: "tourDetailnav",
        kind: "FittableColumns",
        ontap: "hideTourStopPopup",
        components: [{
            name: "tourStopTitle",
            classes: "tourTitle",
            content: "Tour Name"
        }]
    }, {
        kind: "Image",
        name: "tourStopImage",
        style: "height:200px;width:100%;background-size:cover",
        classes: "tourStopImage"
    }, {
        kind: "Scroller",
        style: "height:270px;width:100%;",
        components: [{
            name: "tourStopContent",
            classes: "tourStopContent"
        }]
    }],
    create: function() {
        this.inherited(arguments);
        this.tourStopTitleChanged();
        this.tourStopImageChanged();
        this.tourStopContentChanged();
    },
    tourStopTitleChanged: function(inSender, inEvent) {
        this.$.tourStopTitle.setContent(this.tourStopTitle);
    },
    tourStopImageChanged: function(inSender, inEvent) {
        this.$.tourStopImage.setSrc(this.tourStopImage);
    },
    tourStopContentChanged: function(inSender, inEvent) {
        this.$.tourStopContent.setContent(this.tourStopContent);
    },
    hideTourStopPopup: function(argument) {
        this.bubbleUp("hideTourStopDetailPopup");
    }
});