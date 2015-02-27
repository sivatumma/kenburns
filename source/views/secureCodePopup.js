enyo.kind({
    name: "cls.secureCodePopup",
    classes:"",
    kind: "FittableRows",
    components: [{
                    name:"secureIdError",
                    classes:"secureIdError",
                    content:"Please provide valid secure id..."
                },{
            name: "secureCode",
            classes:"secureCode",
            kind: "enyo.Input",
            content: "",
            placeholder: "Secure Code"
        }, {
                kind: "enyo.Button",
                name:"secureEnterButton",
                classes: "button secureEnterButton",
                content: "Enter",
                ontap:"openRegistration"
            }],
    hidePopup: function(argument) {
        // this.bubbleUp("hideOfferPopup");
    },

    create: function() {
        this.inherited(arguments);
        this.$.secureIdError.hide();
    },
    openRegistration:function(inSender, inEvent){
        // this.bubbleUp("viewSelectedScreen",{"value":inSender.content});
        AppConfig.log(this.$.secureCode.value);
        if(this.$.secureCode.value==AppConfig.secureid){
            this.$.secureIdError.hide();
            localStorage.setItem("secureId", this.$.secureCode.value);
            enyo.Signals.send("showRegistrationScreen");
        }
        else{
           this.$.secureIdError.show(); 
        }
    }
});