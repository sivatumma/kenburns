enyo.kind({
    name: "amobeeAdArea",
    classes: "amobee-adrequest",
    create: function() {
        this.inherited(arguments);
        $.getScript("http://julyprod.amobee.com/tag?type=ad", function() {
            new amobee.adrequest({
                as: '48345',
                asyncDocWrite: true,
                parameters: {
                    // adw: '320',
                    // adh: '50',
                    acc: '108834530'
                }
            });
        })
    }
});
