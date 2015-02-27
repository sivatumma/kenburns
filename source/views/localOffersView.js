enyo.kind({
    name: "cls.localOffersView",
    components: [{
        name: "mainHeader",
        kind: "cls.navHeader",
        title: "Notifications"
    }, {
        kind: "localOffer"
    }]
});
enyo.kind({
    name: "localOffer",
    classes: "offerKind",
    kind: "Scroller",
    published: {
        data: "",
        offerImage: null,
        offerTitle: null,
        offerDescription: null,
        offerDistance: null,
        offerLocationLabel: null,
        offerLocation: null
    },
    components: [{
        name: "localOfferRepeater",
        kind: "enyo.DataList",
        components: [{
            classes: "oneOfferItem",
            published: {
                selectedOfferIndex: ''
            },
            ontap: "showOfferDetail",
            components: [{
                name: "offerImage",
                imageURL: null,
                classes: "offerImage inline",
                style: "background-size:100% 100%;height: 80px;width: 80px;",
                ontap: "showOfferDetail"
            }, {
                name: "offerContentAreaBesideImage",
                classes: "offerContentAreaBesideImage inline",
                components: [{
                    name: "offerTitle",
                    classes: "offerTitle",
                    ontap: "showOfferDetail"
                }, {
                    name: "offerLocation",
                    classes: "offerLocation inline"
                }]
            }, {
                name: "offerDescription",
                classes: "offerDescription",
                content: ""
            }, {
                name: "offerId",
                content: "",
                style: "display:none;"
            }],
            bindings: [{
                from: ".model._id",
                to: ".selectedOfferIndex"
            }, {
                from: ".model.title",
                to: ".$.offerTitle.content"
            }, {
                from: ".model.thumb",
                to: ".$.offerImage.imageURL",
                transform: function(v) {
                    this.$.offerImage.applyStyle("background-image", "url(" + v + ")");
                },
            }, {
                from: ".model.description",
                to: ".$.offerDescription.content",
                transform: function(v) {
                    var eventsDesc = Utils.snippet(v, 90);
                    return eventsDesc;
                }
            }, {
                from: ".model.location",
                to: ".$.offerLocation.content"
            }],
        }]
    }],
    bindings: [{
        from: ".app.$.localOfferCollection",
        to: ".$.localOfferRepeater.collection"
    }],
    showOfferDetail: function(inSender, inEvent) {
        // app.setSelectedOffer(inSender.owner.model);
        AppConfig.log(inSender, inEvent);
        var offerObj = _.find(app.$.localOfferCollection.raw(), function(item) {
            return item._id == inSender.selectedOfferIndex;
        }, this);
        app.pushView("PUSHOFFERDETAILS");
        enyo.Signals.send("updateOfferDetailNotification", {
            offerNotificationObject: offerObj
        });
    }
});