enyo.kind({
    name: "cls.cityOfficials",
    classes: "cityOfficials",
    kind: "FittableRows",
    components: [{
        name: "mainHeader",
        kind: "cls.navHeader",
        title: "City Officials"
    }, {
        kind: "Scroller",
        classes:"content-section",
        fit: true,
        components: [{
            classes: "heading",
            content: "About the Mayor"
        }, {
            classes: "image"
        }, {
            classes: "content",
            content: "Rahm Emanuel has served as the 55th mayor of the city of Chicago since 2011. During that time he has made the tough choices necessary to secure Chicago’s future as a global capital. The Mayor added more than 200 hours to the school day and year, taking Chicago from having the least educational time of any large school district in the country to being on par with its peers. He implemented full-day kindergarten for every Chicago child, and fought for and won new accountability measures to ensure every teacher and principal had the necessary resources to succeed. The Mayor’s comprehensive public safety strategy is focused on expanded prevention programs for at-risk youth, smarter policing strategies, and empowering parents and communities to reduce violence in their neighborhoods. He attracted numerous companies to Chicago and helped to build the next generation of start-ups, while investing in the infrastructure, public transportation, open space and cultural attractions that make Chicago a great place to live, work, and play. And he has worked to make our government more effective, to deliver better services at a more competitive price, and to open government to the public."
        }, {
            classes: "content",
            content: "Prior to becoming Mayor, Emanuel served as the White House Chief of Staff to President Barack Obama and served three terms in the U.S. House of Representatives representing Chicago’s 5th District. He previously served as a key member of the Clinton administration from 1993 to 1998, rising to serve as Senior Advisor to the President for Policy and Strategy."
        }, {
            classes: "content",
            content: "Mayor Emanuel graduated from Sarah Lawrence College in 1981 and received a Master's Degree in Speech and Communication from Northwestern University in 1985. He is married to Amy Rule, and they have three children."
        }, {
            classes: "heading contact",
            content: "Contact Us"
        }, {
            classes: "heading2",
            content: "By Mail:"
        }, {
            classes: "content conactInfo",
            allowHtml: true,
            content: "City Hall<br>121 N. LaSalle Street<br>Chicago, Illinois 60602"
        }, {
            classes: "heading2",
            content: "By Phone:"
        }, {
            classes: "content conactInfo",
            allowHtml: true,
            content: "Dial 311 (within Chicago)<br>If calling from outside of Chicago, call: 312.744.5000"
        }]
    }],
    backToCityInfo: function(inSender, inEvent) {
        app.popView();
    }
});