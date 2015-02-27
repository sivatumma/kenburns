enyo.kind({
    name: "cls.aboutChicagoView",
    classes: "aboutChicago",
    components: [{
        name: "mainHeader",
        kind: "cls.navHeader",
        title: "About Chicago"
    }, {
        kind: "Scroller",
        classes:"content-section",
        components: [{
            tag: "p",
            content: "The City of Chicago covers an  area of 60,000 hectares and sits 176 meters (578 feet) above sea level on the southwestern shore of Lake Michigan. At 190 km wide and 495 km long, its the 5th largest body of fresh water in the world. The city is traversed by the Chicago and Calumet rivers. Chicago's extensive parklands, including 3,000 hectares of city parks attract an estimated 86 million visitors annually."
        }, {
            tag: "P",
            content: "As a multicultural city that thrives on the harmony and diversity of its neighborhoods, Chicago today embodies the values of America's heartland-integrity, hard work and community and reflects the ideals in the social fabric of  its 77 distinct neighborhoods."
        }, {
            tag: "P",
            content: "Chicago is recognized across the United States as a very passionate sports town."
        }, {
            tag: "P",
            content: "Chicago is a leader in reforming public schools, enhancing public safety and security initiatives, providing affordable housing in attractive and economically sound communities, ensuring accessibility for all and fostering, social, economic and environmental sustainability."
        }]
    }],
    backToCityInfo: function(inSender, inEvent) {
        app.popView();
    }
});