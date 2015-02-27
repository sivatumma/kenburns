enyo.kind({
    name: "cls.cityInformationView",
    kind: "FittableRows",
    classes: "moreView cityInfo",
    components: [{
        name: "mainHeader",
        kind: "cls.navHeader",
        title: "Chicago"
    }, {
        name: "cityHeroImage",
        classes: "cityHeroImage"
    }, {
        name: "cityInformationOptions",
        fit: true,
        components: [{
            classes: "moreOption",
            kind: "FittableColumns",
            ontap: "showAboutChicago",
            components: [{
                content: "About Chicago",
                classes: "moreOptionTitle",
            }, {
                tag: "i",
                classes: "fa fa-chevron-right moreOptionIcon"
            }]
        }, {
            classes: "moreOption",
            kind: "FittableColumns",
            ontap: "showCityOfficial",
            components: [{
                content: "City Officials",
                classes: "moreOptionTitle"
            }, {
                tag: "i",
                classes: "fa fa-chevron-right moreOptionIcon"
            }]
        }]
    }],
    backToMoreScreen: function(inSender, inEvent) {
        app.popView();
    },
    showAboutChicago: function() {
        app.pushView("ABOUTCHICAGO");
    },
    showCityOfficial: function() {
        app.pushView("CITYOFFICIALS");
    }
});