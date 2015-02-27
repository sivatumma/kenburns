// base device model type so that different types of models can appear on featured screen
enyo.kind({
    // these are expected to exist
    defaults: {
        id: "",
        type: "unknown"
    },
    primaryKey: "id",
    readOnly: true, // not backed by the store (not making commits or deletes)
    name: "cls.DeviceModel",
    kind: "enyo.Model"
});
// Devices/device data
// Parking
enyo.kind({
    name: "cls.ParkingModel",
    kind: "cls.DeviceModel",
    defaults: {
        type: "parking"
    },
    parse: function(data) {
        return data;
    }
});
enyo.kind({
    name: "cls.ParkingCollection",
    kind: "enyo.Collection",
    model: "cls.ParkingModel",
    defaultSource: "ps_source",
    type: "parking",
    closestDevice: null,
    instanceAllRecords: true, // call parse on all records as they are created
    apiOptions: {
        endpoint: "api/parking",
        type: "POST",
        query: {
            "documentation": "Get parking space operated by specified organization",
            "find": {
                "parkingSpace": {
                    "operatedBy": "sensity-qa"
                }
            }
        }
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
        return data.event;
    }
});
// Lighting
enyo.kind({
    name: "cls.LightingModel",
    kind: "cls.DeviceModel",
    defaults: {
        type: "lighting"
    },
    parse: function(data) {
        return data;
    }
});
enyo.kind({
    name: "cls.LightingCollection",
    kind: "enyo.Collection",
    model: "cls.LightingModel",
    defaultSource: "ps_source",
    type: "lighting",
    instanceAllRecords: true, // call parse on all records as they are created
    apiOptions: {
        endpoint: "api/lights",
        type: "POST",
        query: {
            "find": {
                "light": {
                    "operatedBy": "sensity-qa",
                    "geocoordinates": {
                        "lat": "+41.887667" + "," + "51.887667",
                        "lon": "-84.632521" + "," + "-87.432521"
                    }
                }
            }
        }
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
        return data;
    }
});
// Kiosk
enyo.kind({
    name: "cls.KioskModel",
    kind: "cls.DeviceModel",
    defaults: {
        type: "kiosk"
    },
    parse: function(data) {
        return data;
    }
});
enyo.kind({
    name: "cls.KioskCollection",
    kind: "enyo.Collection",
    model: "cls.KioskModel",
    defaultSource: "ps_source",
    type: "kiosk",
    instanceAllRecords: true, // call parse on all records as they are created
    apiOptions: {
        endpoint: "api/kiosk",
        type: "POST",
        query: {
            "documentation": "Get kiosks near specified geocoordinates",
            "find": {
                "var": {
                    "name": "queryPoint",
                    "geocoordinates": {
                    }
                },
                "kiosk": {
                    "le": {
                        "target": "distance(this, queryPoint)",
                        "value": AppConfig.allKiosksRange
                    }
                }
            }
        }
    },
    fetch: function(opts) {
        // add collection specific properties
        if (opts && opts.query) {
            this.apiOptions.query = opts.query;
        }
        opts = enyo.mixin(opts, this.apiOptions);
        // add current location
        var loc = app.getCurrentLocation();
        opts.query.find.var.geocoordinates.latitude = loc.latitude;
        opts.query.find.var.geocoordinates.longitude = loc.longitude;

        // make the request       
        this.inherited(arguments);
    },
    parse: function(data) {
        return data.kiosk;
    }
});
// Traffic
enyo.kind({
    name: "cls.TrafficModel",
    kind: "cls.DeviceModel",
    defaults: {
        type: "traffic"
    },
    parse: function(data) {
        return data;
    }
});
enyo.kind({
    name: "cls.TrafficCollection",
    kind: "enyo.Collection",
    model: "cls.TrafficModel",
    defaultSource: "ps_source",
    type: "traffic",
    instanceAllRecords: true, // call parse on all records as they are created
    apiOptions: {
        endpoint: "api/smart-traffic",
        type: "POST",
        query: {
            "documentation": "Get viewports corresponding to medium density traffic operated by 'sensity-qa'",
            "find": {
                "traffic": {
                    "operatedBy": "sensity-qa"
                }
            }
        }
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
        return data;
    }
});
// Crowd
enyo.kind({
    name: "cls.CrowdModel",
    kind: "cls.DeviceModel",
    defaults: {
        type: "crowd"
    },
    parse: function(data) {
        return data;
    }
});
enyo.kind({
    name: "cls.CrowdCollection",
    kind: "enyo.Collection",
    model: "cls.CrowdModel",
    defaultSource: "ps_source",
    type: "crowd",
    instanceAllRecords: true, // call parse on all records as they are created
    apiOptions: {
        // temporary JSON data given
        // endpoint: "https://173.36.245.244/location_clients.json",
        endpoint: "api/mse/location/clients/", //cim.cisco.com       
        type: "GET"
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
        return data.Locations ? data.Locations.WirelessClientLocation : null;
    }
});
// Crowd
enyo.kind({
    name: "cls.CityAssetsModel",
    kind: "cls.DeviceModel",
    defaults: {
        type: "cityassets"
    },
    parse: function(data) {
        return data;
    }
});
enyo.kind({
    name: "cls.CityAssetsCollection",
    kind: "enyo.Collection",
    model: "cls.CityAssetsModel",
    defaultSource: "ps_source",
    type: "cityassets",
    instanceAllRecords: true, // call parse on all records as they are created
    apiOptions: {
        // Lists all city assets
        // endpoint: "/api/city-asset?Data.q=all",
        // Lists all city assets which are lying in current map view
        endpoint: "/api/city-asset?Data.q=bound&Data.BBoxLonMin=-87.71484375&Data.BBoxLatMin=41.83682786072714&Data.BBoxLonMax=-87.626953&Data.BBoxLatMax=41.90227",
        type: "GET"
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
        return data;
    }
});