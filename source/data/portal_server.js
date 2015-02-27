// base model type so that different types of models can appear on featured screen
enyo.kind({
    // these are expected to exist
    defaults: {
        title: "",
        body: "",
        id: "",
        imageURL: "",
        type: "unknown",
        sortOrder: ""
    },
    primaryKey: "id",
    readOnly: true, // not backed by the store (not making commits or deletes)
    name: "cls.ItemModel",
    kind: "enyo.Model"
});
// holds all the records from the various models so they can be sorted and displayed on the featured screen
enyo.kind({
    name: "cls.AllItemCollection",
    kind: "enyo.Collection",
    model: "cls.ItemModel",
    getSortedList: function(data, maxLength) {
        var featuredList = [];
        var recordList = [];
        var addedFeaturedAppItem = false;
        _.each(data, function(record) {
            // give them a fake index for now...
            if (record.get('featured')) {
                // make sure any items marked as featured get sorted near the top (and the first one is index 0)
                if (!addedFeaturedAppItem) {
                    // first featured item, make it the main featured item for the main app
                    app.setFeaturedContent(record);
                    addedFeaturedAppItem = true;
                }
                featuredList.push(record);
            } else if ((record.get('type') == "ad") || (enyo.irand(100) < 6)) {
                // make sure any items marked as ads get sorted near the top (and the first one is index 10)
                record.set('featured', true);
                featuredList.push(record);
            } else {
                record.featuredIndex = enyo.irand(1000) + 1;
                recordList.push(record);
            }
        })
        // cap the number of records being returned
        var numRecords = Math.min(maxLength - featuredList.length, recordList.length)
            // throw away the last normal record if the length is odd
        if (recordList.length % 2) {
            recordList = _.first(recordList, recordList.length - 1);
        }
        recordList = _.sortBy(recordList, function(record) {
            return record.featuredIndex;
        });
        AppConfig.log("returning " + recordList.length + " normal items and " + featuredList.length + " featured items.")
        var lastInsertIndex = 0;
        _.each(featuredList, function(record, index) {
            // insert the first item at the beginning and the rest on the right boundry so there aren't any gaps
            // ()
            var insertIndex = index * (enyo.irand(4) * 2 + 2) + (index % 2);
            // don't let the random choose an index lower than the last one
            insertIndex = (lastInsertIndex > insertIndex ? lastInsertIndex + 2 : insertIndex);
            lastInsertIndex = insertIndex;
            AppConfig.log("inserting featured " + record.get('type') + " at " + insertIndex);
            recordList.splice(insertIndex, 0, record);
        })
        return recordList;
    },
});
// specific data models and collections
// Ads
// created manually in app.js for now, no collection or source...
enyo.kind({
    name: "cls.AdModel",
    kind: "cls.ItemModel",
    defaults: {
        type: "ad"
    },
});
// Events
enyo.kind({
    name: "cls.EventModel",
    kind: "cls.ItemModel",
    defaults: {
        type: "event"
    },
    parse: function(data) {
        data.imageURL = data.mediaType == "Image" ? data.media : "assets/TourImages/Route1.png";
        var addressObj = data.address ? data.address[0] : {};
        data.location = addressObj.street1 || addressObj.city;
        data.street1 = addressObj.street1;
        data.street2 = addressObj.street2;
        data.city = addressObj.city;
        AppConfig.log("EventModel",data.imageURL);
        data.geocoordinates = addressObj.geocoordinates;
        return data;
    }
});
enyo.kind({
    name: "cls.EventCollection",
    kind: "enyo.Collection",
    model: "cls.EventModel",
    defaultSource: "ps_source",
    type: "events",
    instanceAllRecords: true, // call parse on all records as they are created
    apiOptions: {
        endpoint: "api/city-info",
        type: "POST"
    },
    fetch: function(opts) {
        // add collection specific properties
        if (opts && opts.query) {
            this.apiOptions.query = opts.query;
        }
        opts = enyo.mixin(opts, this.apiOptions);
        // make the request
        this.inherited(arguments);
    },
    parse: function(data) {
        // incoming data contains {event:[]}
        AppConfig.log(data, data.event)
        return data.event;
    }
});
// Offers
enyo.kind({
    name: "cls.OfferModel",
    kind: "cls.ItemModel",
    defaults: {
        type: "offer"
    },
    parse: function(data) {
        data.imageURL = data.image;
        // data.imageURL = "assets/offer/shop" + Math.floor((Math.random() * 3) + 1) + ".png";
        // data.title = "Bloomingdale's Chicago";
        // data.body = "Present your out of town identification to the Visitors Center on 3 and enjoy a 10% off savings certificate and gift with minimum purchase.";
        var addressObj = data.address ? data.address[0] : {};
        data.location = addressObj.street1 || addressObj.city;
        data.street1 = addressObj.street1;
        data.street2 = addressObj.street2;
        data.city = addressObj.city;
        data.state = addressObj.state;
        data.zip = addressObj.zip;
        data.geocoordinates = addressObj.geocoordinates;
        AppConfig.log("EventModel",data.imageURL);
        return data;
    }
});
enyo.kind({
    name: "cls.OfferCollection",
    kind: "enyo.Collection",
    model: "cls.OfferModel",
    defaultSource: "ps_source",
    type: "offers",
    instanceAllRecords: true, // call parse on all records as they are created
    apiOptions: {
        endpoint: "api/smart-deal",
        type: "POST"
    },
    parse: function(data) {
        AppConfig.log("OfferCollection - parse", data);
        // incoming data contains {deal:[]}
        return data.deal;
    },
    fetch: function(opts) {
        if (opts && opts.query) {
            this.apiOptions.query = opts.query;
        }
        this.apiOptions.query = opts.query;
        opts = enyo.mixin(opts, this.apiOptions);
        // make the request
        this.inherited(arguments);
    }
});
// Routes
enyo.kind({
    name: "cls.RouteModel",
    kind: "cls.ItemModel",
    defaults: {
        type: "tour"
    },
    createBodyFromRouteData: function(data) {
        if (!data.body) {
            data.body = data.DESCRIPTION;
            if (data.DISTANCE) {
                data.body += ", " + data.DISTANCE + " " + data.DISTANCEUNIT;
            }
            if (data.TIME) {
                data.body += ", " + data.TIME + " " + data.TIMEUNIT;
            }
        }
        return data.body;
    },
    parse: function(data) {
        AppConfig.log(data);
        // data.imageURL = data.image || dummy.tours[0].tourImage;
        data.imageURL = data.image || "assets/TourImages/Route" + data.ROUTE_ID + ((data.ROUTE_ID == 1) ? ".png" : ".jpg");
        data.title = data.ROUTE_NAME;
        data.body = this.createBodyFromRouteData(data);
        AppConfig.log("RouteModel",data.imageURL);
        // force tours to be "featured" for now...
        data.featured = true;
        return data;
    }
});
enyo.kind({
    name: "cls.RouteCollection",
    kind: "enyo.Collection",
    model: "cls.RouteModel",
    defaultSource: "ps_source",
    type: "tours",
    instanceAllRecords: true, // call parse on all records as they are created
    apiOptions: {
        endpoint: "api/routes?Data.q=all",
        type: "GET"
    },
    parse: function(data) {
        AppConfig.log("OfferCollection - parse", data);
        // incoming data contains {Output:[]}
        return data.Output;
    },
    fetch: function(opts) {
        AppConfig.log("OfferCollection - fetch", opts);
        // add collection specific properties
        if (opts && opts.query) {
            this.apiOptions.query = opts.query;
        }
        opts = enyo.mixin(opts, this.apiOptions);
        // make the request
        this.inherited(arguments);
    }
});
enyo.kind({
    name: "cls.LocalOfferModel",
    kind: "cls.ItemModel",
    parse: function(data) {
        if (data.imageURL && data.imageURL.indexOf("http") != 0) {
            AppConfig.log(data.imageURL);
            data.imageURL = AppConfig.baseURL + "offer-images/" + data.imageURL;
        }
        if (data.latlng) {
            data.geocoordinates = {
                latitude: data.latlng.lat,
                longitude: data.latlng.lng
            };
        }
        AppConfig.log(data);
        return data;
    }
});
enyo.kind({
    name: "cls.LocalOfferCollection",
    kind: "enyo.Collection",
    model: "cls.LocalOfferModel",
    defaultSource: "ps_source",
    instanceAllRecords: true, // call parse on all records as they are created
    apiOptions: {
        endpoint: "offers",
        type: "GET"
    },
    parse: function(data) {
        AppConfig.log("OfferCollection - parse", data);
        // incoming data contains {deal:[]}
        return data;
    },
    fetch: function(opts) {
        if (opts) {
            this.apiOptions.query = opts.query;
        }
        this.apiOptions.query = opts.query;
        opts = enyo.mixin(opts, this.apiOptions);
        // make the request
        this.inherited(arguments);
    }
});
// portal source used for all collections that get their data from portal server
enyo.kind({
    name: "cls.portalServerSource",
    kind: "enyo.Source",
    fetch: function(rec, opts) {
        AppConfig.log("portalServerSource - fetch", opts, AppConfig.baseURL);
        var query = opts && opts.query ? {
            query: opts.query
        } : null;
        var endpoint = opts.endpoint.indexOf("http") < 0 ? AppConfig.baseURL + opts.endpoint : opts.endpoint;
        AjaxAPI.simpleAjaxRequest(endpoint, this, opts.success, opts.fail, opts.type, query);
    },
    commit: function(rec, opts) {
        // read only
    },
    destroy: function(rec, opts) {
        // read only
    }
});
enyo.store.addSources({
    ps_source: "cls.portalServerSource"
});
enyo.store.ignoreDuplicates = true;