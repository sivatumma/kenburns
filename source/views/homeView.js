enyo.kind({
    name: "cls.homeView",
    classes: "home-view",
    bgImageNumber: 0,
    numBgImages: 4,
    imageDuration: 8*1000,
    currentTimeoutID: 0,
    components: [{
        name: "animatedBackground",
        id: "slideshow",
        components: [{
            name: "image0", kind: "Image"
        },{
            name: "image1", kind: "Image"
        },{
            name: "image2", kind: "Image"
        },{
            name: "image3", kind: "Image"
        }]
    }, {
        kind: "FittableRows",
        classes: "home-view",
        components: [{
            name: "tourDetailContent",
            kind: "FittableRows",
            fit: true,
            components: [{
                name: "mainMenu",
                classes: "main-screen-top-area",
                kind: "cls.homeMenu"
            }]
        }, {
            name: "toolbar",
            kind: "cls.mainToolbar",
        }]
    }],
    rendered: function() {
        this.inherited(arguments);
        this.setupBackgrounds();
        if (!this.currentTimeoutID) {
            this.currentTimeoutID = window.setTimeout(enyo.bind(this, "updateKenBurns"), this.imageDuration);
        }
    },
    viewChanged: function(inSender, inEvent) {
        if (inEvent.newView == this.name) {
            // you can increase or decrease this value to get different effects
            this.currentTimeoutID = window.setTimeout(enyo.bind(this, "updateKenBurns"), this.imageDuration);       
        } else if (this.currentTimeoutID) {
            window.clearTimout(this.currentTimeoutID);
            this.currentTimeoutID = null;
        }
    },
    updateKenBurns: function() {
        var i = this.bgImageNumber;

        if (i==this.numBgImages) {
            i = 0;
        }
        this.$["image"+i].addClass("fx");

        // we can't remove the class from the previous element or we'd get a bouncing effect so we clean up the one before last
        // (there must be a smarter way to do this though)
        if(i===0){ this.$["image"+(this.numBgImages-2)].removeClass("fx");}
        else if(i===1){ this.$["image"+(this.numBgImages-1)].removeClass("fx");}
        else if(i>1){ this.$["image"+(i-2)].removeClass("fx");}
        i++;
        this.bgImageNumber = i;
        this.currentTimeoutID = window.setTimeout(enyo.bind(this, "updateKenBurns"), this.imageDuration);       
    },
    setupBackgrounds: function() {
        /**
         * See: http://www.css-101.org/articles/ken-burns_effect/css-transition.php
         */

        /**
         * The idea is to cycle through the images to apply the "fx" class to them every n seconds. 
         * We can't simply set and remove that class though, because that would make the previous image move back into its original position while the new one fades in. 
         * We need to keep the class on two images at a time (the two that are involved with the transition).
         */

        // we set the 'fx' class on the first image when the page loads
        var currentHour = moment().format("H")
        var timeString =  (currentHour > 6 && currentHour < 18) ? "day" : "night";
        var imageNumberArray = [];

        // create an array of image names and then randomize it
        var i;
        for (i = 1; i <= this.numBgImages; i++) {
            imageNumberArray.push("assets/bg/"+timeString+"-0"+i+".jpg");
        };

        // randomize the image numbers
        imageNumberArray = _.shuffle(imageNumberArray);

        for (i = 0; i < this.numBgImages; i++) {
            this.$["image"+i].setSrc(imageNumberArray.shift());
        }
        this.$.image1.addClass("fx");
    }
});

enyo.kind({
    name: "cls.homeMenu",
    // classes: "home-menu",

    kind: "FittableRows",
    components: [{
        kind: "FittableColumns",
        classes: "home-nav-row",
        components: [{
            classes: "home-nav-button",
            ontap: "menuTapHandler",
            components: [{
                name: "TourIcon",
                content: "Attractions",
                classes: "home-nav-text"
                // classes: "fa fa-binoculars main-menu-icon"
            }],
            viewName: "TOURS"
        }, {
            classes: "home-nav-button",
            ontap: "menuTapHandler",
            components: [{
                name: "EventIcon",
                content: "Events",
                classes: "home-nav-text events-tool-bar"
                // classes: "fa fa-ticket main-menu-icon"
            }],
            viewName: "EVENTS"
        }, {
            classes: "home-nav-button",
            ontap: "menuTapHandler",
            components: [{
                name: "OfferIcon",
                content: "Shopping",
                classes: "home-nav-text shopping-tool-bar"
                // classes: "fa fa-tags main-menu-icon"
            }],
            viewName: "OFFERS"
        }, {
            classes: "home-nav-button",
            ontap: "menuTapHandler",
            components: [{
                name: "NotifylIcon",
                content: "Notifications",
                classes: "home-nav-text notifications-tool-bar"
                // classes: "fa fa-warning main-menu-icon"
            }],
            viewName: "NOTIFICATIONS"
        }, {
            classes: "home-nav-icon",
            ontap: "menuTapHandler",
            components: [{
                name: "MoreIcon",
                classes: "glyph icon-more home-nav-webfont-icon more-tool-bar"
            }],
            viewName: "MORE"
        }]
    }, {
        classes: "main-menu-featured-row main-menu-featured-image",
        fit: true,
        name: "Featured",
        ontap: "menuTapHandler",
        viewName: "FEATURED"
    }],
    create: function() {
        this.inherited(arguments);
        this.$.Featured.applyStyle('background-image', 'url(assets/feature.png)');
    },
    menuTapHandler: function(inSender, inEvent) {
        // don't let this event get handled somewhere else (in leaflet map to be exact)
        inEvent.preventDefault();
        var view = inSender.viewName;
        switch (view) {
            case "TOURS":
            case "OFFERS":
            case "EVENTS":
                app.setListContent(view);
                app.pushView("LISTVIEW");
                break;
            case "MORE":
                app.pushView(view);
                break;
            case "NOTIFICATIONS":
                app.pushView("LOCALOFFERS");
                AppConfig.log("pushed loval offer view");
                break;
            case "FEATURED":
                // select the featured item and go the appropriate view
                var featuredItem = app.getFeaturedContent();
                if (featuredItem) {
                    var itemType = featuredItem.get('type');
                    switch (itemType) {
                        case "event":
                            app.setSelectedEvent(featuredItem);
                            app.pushView("EVENTDETAILSVIEW");
                        case "offer":
                            app.setSelectedOffer(featuredItem);
                            app.pushView("OFFERDETAILSVIEW");
                        case "tour":
                            app.setSelectedTour(featuredItem);
                            app.pushView("TOURDETAIL");
                    }
                }
                break;
            default:
                break;
        }
        return true;
    }
});