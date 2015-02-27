enyo.kind({
    name: "cls.tourSuccess",
    kind: "FittableRows",
    published: {
        record: '',
        // default value is four
        rate: 4,
    },
    components: [{
        kind: "Signals",
        startTour: "startTour"
    }, {
        name: "tourPreviewnav",
        classes: "tourDetailnav",
        kind: "FittableColumns",
        components: [{
            name: "backButton",
            classes: "backButton",
            components: [{
                tag: "i",
                classes: "fa fa-chevron-left backIcon"
            }, {
                content: "Back",
                classes: "backContent"
            }],
            ontap: "backToToursView"
        }, {
            fit: true,
            name: "tourTitle",
            classes: "tourTitle tourTitleAB",
            content: ""
        }]
    }, {
        name: "tourId",
        classes: "tourId",
        content: "",
        style: "display:none"
    }, {
        name: "successContent",
        kind: "Scroller",
        classes: "successContent",
        style: "height: 100%",
        components: [{
            content: "Congratulations",
            classes: "tourSuccessCongrats"
        }, {
            content: "You made it to the end of the tour. Please help us improve the tour.",
            classes: "tourSuccessMessage"
        }, {
            content: "Rate the tour",
            classes: "ratetourtitle"
        }, {
            name: "ratingSection",
            kind: "FittableColumns",
            classes: "ratingSection",
            components: [{
                name: "rate1",
                classes: "fa fa-star ratingstar selectedrate",
                ontap: "selectRate"
            }, {
                name: "rate2",
                classes: "fa fa-star ratingstar selectedrate",
                ontap: "selectRate"
            }, {
                name: "rate3",
                classes: "fa fa-star ratingstar selectedrate",
                ontap: "selectRate"
            }, {
                name: "rate4",
                classes: "fa fa-star ratingstar selectedrate",
                ontap: "selectRate"
            }, {
                name: "rate5",
                classes: "fa fa-star ratingstar",
                ontap: "selectRate"
            }]
        }, {
            content: "Add a Comment",
            classes: "addcommenttitle"
        }, {
            name: "commentArea",
            kind: "enyo.TextArea",
            classes: "commentsarea",
            placeholder: "Enter your comment here"
        }, {
            name: "footerButtons",
            classes: "footerButtons",
            components: [{
                kind: "Button",
                classes: "tourSuccessSubmitButton",
                content: "Submit",
                ontap: "backToToursView"
            }]
        }, {
            style: "height: 250px"
        }]
    }],
    bindings: [
        // {
        //     from: ".app.selectedTour.title",
        //     to: ".$.tourTitle.content"
        // },
        {
            from: ".app.selectedTour.ROUTE_ID",
            to: ".$.tourId.content"
        }
    ],
    create: function() {
        this.inherited(arguments);
    },
    backToToursView: function() {
        var tourSucessObj = {
            "tour_id": this.$.tourTitle.getContent(),
            "user_id": localStorage.userIdVal,
            "comment": this.$.commentArea.getValue(),
            "rating": this.rate
        };
        var routeIdInfo = this.$.tourTitle.getContent();
        TourSuccessModel.loadTourSuccess(tourSucessObj, routeIdInfo);
        enyo.Signals.send("startTourAgain");
        // pop this view
        app.popView();
        // pop the tour view
        app.popView();
    },
    // updateRoutes: function() {
    //     var data = RoutesModel.routesObject;
    //     AppConfig.log(data);
    //     this.$.tourTitle.setContent(data.ROUTE_NAME);
    // },
    // tourTitleUpdated: function(inSender, inEvent) {
    //     this.$.tourTitle.setContent(inEvent.tourTitle.attributes.TOUR_NAME);
    //     this.setRecord(inEvent.tourTitle.attributes);
    // },
    selectRate: function(inSender, inEvent) {
        this.setRate(null);
        this.$.rate5.removeClass("selectedrate");
        this.$.rate4.removeClass("selectedrate");
        this.$.rate3.removeClass("selectedrate");
        this.$.rate2.removeClass("selectedrate");
        this.$.rate1.removeClass("selectedrate");
        switch (inSender.name) {
            case "rate5":
                this.$.rate4.addClass("selectedrate");
                if (this.rate == null) this.setRate(5);
            case "rate4":
                this.$.rate3.addClass("selectedrate");
                if (this.rate == null) this.setRate(4);
            case "rate3":
                this.$.rate2.addClass("selectedrate");
                if (this.rate == null) this.setRate(3);
            case "rate2":
                this.$.rate1.addClass("selectedrate");
                if (this.rate == null) this.setRate(2);
                break;
            default:
                this.$.rate1.addClass("selectedrate");
                if (this.rate == null) this.setRate(1);
                break;
        }
        inSender.addClass("selectedrate");
    },
    startTour: function() {
        this.$.tourTitle.setContent(cls.tourPreview.currentTour);
    }
});
