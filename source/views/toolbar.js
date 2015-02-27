enyo.kind({
    name: "cls.Toolbar",
    classes: "toolbarContainer",
    kind: "FittableColumns",
    activeButtonObject: null,
    events: {
        onSelectedViewChanged: ""
    },
    components: [{
        kind: "Signals",
        changedToView: "changedToView"
    }, {
        kind: "toolbarNavButton",
        classes: "activeToolbarIcons",
        components: [{
            name: "FeaturedIcon",
            tag: "i",
            classes: "fa fa-star toolbarIcons"
        }, {
            content: "Featured",
            classes: "toolbarText"
        }],
        viewName: "FEATURED",
        active: true,
        index: 0
    }, {
        kind: "toolbarNavButton",
        components: [{
            name: "ToursIcon",
            tag: "i",
            classes: "fa fa-list toolbarIcons"
        }, {
            content: "Attractions",
            classes: "toolbarText"
        }],
        viewName: "TOURS",
        index: 1
    }, {
        kind: "toolbarNavButton",
        components: [{
            name: "EventsIcon",
            tag: "i",
            classes: "fa fa-calendar-o toolbarIcons"
        }, {
            content: "Events",
            classes: "toolbarText"
        }],
        viewName: "EVENTS",
        index: 2
    }, {
        kind: "toolbarNavButton",
        components: [{
            name: "OffersIcon",
            tag: "i",
            classes: "fa fa-dollar toolbarIcons"
        }, {
            content: "Shopping",
            classes: "toolbarText"
        }],
        viewName: "OFFERS",
        index: 3
    }, {
        kind: "toolbarNavButton",
        components: [{
            name: "MoreIcon",
            tag: "i",
            classes: "fa fa-ellipsis-h toolbarIcons"
        }, {
            content: "More",
            classes: "toolbarText"
        }],
        viewName: "MORE",
        index: 4
    }],
    changedToView: function(inSender, inEvent) {
        if (inEvent.newView == "TOURDETAIL" || inEvent.newView == "TOURPREVIEW") {
            inEvent.newView = "TOURS";
        } else if (inEvent.newView == "EVENTDETAILSVIEW") {
            inEvent.newView = "EVENTS";
        } else if (inEvent.newView == "OFFERDETAILSVIEW") {
            inEvent.newView = "OFFERS";
        }
        var that = this;
        _.each(that.children, function(child) {
            if (child.viewName == inEvent.newView) {
                child.addClass("activeToolbarIcons");
            } else {
                child.removeClass("activeToolbarIcons");
            }
            // if (panel.viewName == view) {
            //     that.$.viewPanels.setIndex(index);
            //     return;
            // }
        });
        //         this.$.FeaturedIcon.removeClass("toolbarIcons");
        // this.$.FeaturedIcon.addClass("activeToolbarIcons");  
    }
});
enyo.kind({
    name: "toolbarNavButton",
    classes: "toolbarNavButton",
    tap: function(inSender, inEvent) {
        var view = this.viewName;
        switch (view) {
            case "FEATURED":
            case "TOURS":
            case "OFFERS":
            case "EVENTS":
            case "MORE":
                app.pushView(view);
                break;
            default:
                break;
        }
    }
});