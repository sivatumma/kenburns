enyo.kind({
    name: "kioskNotificationPopup",
    classes:"popup kiosk",
    kind: "FittableRows",
    components: [{
        classes: "header",
        ontap: "hidePopup",
        components:[{
            tag: "h1",
            content: "LOCAL OFFER"
        }]
    }, {
        classes: "geoLocOfferContent body",
        components: [{
            classes: "message",
            content: "<p>You are near a Kiosk. Select <span class='skyBlue'>Events</span> or <span class='skyBlue'>offers</span> to view on Kiosk</p>",
            allowHtml: true
        }, {
            classes: "buttonsContainer",
            components:[{
                classes: "button",
                kind: "enyo.Button",
                content: "Events",
                ontap:"openSelectedScreen"
            }, {
                classes:  "button",
                kind: "enyo.Button",
                content: "Offers",
                ontap:"openSelectedScreen"
            }]
        }]    }],
    hidePopup: function(argument) {
        this.bubbleUp("hideOfferPopup");
    },

    create: function() {
        this.inherited(arguments);
    },
    openSelectedScreen:function(inSender, inEvent){
        this.bubbleUp("viewSelectedScreen",{"value":inSender.content});
    }
});
