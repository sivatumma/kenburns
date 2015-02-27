enyo.kind({
    name: "geoLocOfferAndPromotion",
    classes: "geoLocOfferAndPromotion",
    kind: "FittableRows",
    img: '',
    published: {
        thumb: '',
        offerLocation: '',
        crowdLevel: '',
        description: '',
        data: ''
    },
    components: [{
        kind: "Signals",
        updateOfferNotification: "offerInfoReceived"
    }, {
        classes: "geoLocOfferHeader",
        kind: "FittableRows",
        components: [{
            tag: "i",
            classes: "fa fa-chevron-down localOfferIcon"
        }, {
            name: "offerNotificationTitle",
            content: "LOCAL OFFER"
        }],
        ontap: "hidePopup"
    }, {
        classes: "geoLocOfferContent",
        components: [{
            kind: "Image",
            name: "offerImage",
            classes: "geoLocOfferQRCode"
        }, {
            content: "1 Block Away",
            name: "offerLocation",
            classes: "geoLocOfferMessage"
        }, {
            content: "Description",
            name: "description",
            classes: "geoLocOfferDesc"
        }, {
            kind: "onyx.Button",
            name: "viewNotificationOffer",
            content: "View Offer",
            classes: "geoLocOfferButton",
            ontap: "viewOfferDetails"
        }, {
            // kind: "FittableColumns",
            name: "geoLocOfferCrowdLevel",
            classes: "geoLocOfferCrowdLevel",
            components: [{
                classes: "crowdLevelContent",
                content: "Crowd level at store"
            }, {
                name: "crowdlevelHighlighter",
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
    }],
    hidePopup: function(argument) {
        this.bubbleUp("hideOfferPopup");
    },
    create: function() {
        this.inherited(arguments);
        this.descriptionChanged();
        var progress = (enyo.irand(100) + 1);
        this.$.crowdlevelHighlighter.setProgress(progress);
    },
    descriptionChanged: function() {
        this.$.description.setContent(this.description);
        this.$.offerImage.setSrc(this.thumb);
        this.$.offerLocation.setContent(this.offerLocation);
        // if (!this.img && this.thumb) {
        //     this.img = this.$.geoLocOfferCrowdLevel.createComponent({
        //         tag: "a",
        //         style: "width: 30px;height: 30px;background: #fff;",
        //         attributes: {
        //             // target: "_blank",
        //             download: "download",
        //             href: this.thumb
        //         }
        //     }, {
        //         owner: this
        //     });
        //     this.$.geoLocOfferCrowdLevel.render();
        // }

    },
    viewOfferDetails: function() {

        app.pushView("PUSHOFFERDETAILS");
        AppConfig.log(this.data);
        enyo.Signals.send("updateOfferDetailNotification", {
            offerNotificationObject: this.data
        });
        AppConfig.log(this);
        // //Hiding the popup on getting details 
        // this.bubbleUp("offerInfoReceivedData", {
        //        "offerData": this.data
        //    });
        this.hidePopup();
    },

    offerInfoReceived: function(inSender, inEvent) {
        this.$.viewNotificationOffer.show();
        this.$.geoLocOfferCrowdLevel.show();
        this.$.offerNotificationTitle.setContent("LOCAL OFFER");
        this.setData(OfferNotificationModel.offerNotificationObject);
        if (this.owner.notificationTypeInfo == "location") {
            this.$.viewNotificationOffer.hide();
            this.$.geoLocOfferCrowdLevel.hide();
            this.$.offerNotificationTitle.setContent("CURRENT LOCATION");
            this.owner.setNotificationTypeInfo("");
        }
        this.setOfferLocation(this.data.location);
        if (this.data.thumb && this.data.thumb.indexOf("http") != 0) {
            this.data.thumb = AppConfig.baseURL + "offer-images/" + this.data.thumb;
        }
        this.setThumb(this.data.thumb);
        this.setDescription(this.data.description);
        this.descriptionChanged();
        this.owner.$.offerPopup.show();
        this.owner.$.offerPopupContainer.setOpen(true);
    }
});
