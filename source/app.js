/**
    Define and instantiate your enyo.Application kind in this file.  Note,
    application rendering should be deferred until DOM is ready by wrapping
    it in a call to enyo.ready().
*/
enyo.kind({
    name: "cls.Application",
    kind: "enyo.Application",
    view: "cls.MainView",
    storageVersion: "2.3",
    published: {
        currentUser: null,
        currentLocation: null,
        lastLocation: null,
        locationDelta: null,
        featuredContent: null,
        selectedLayer: null,
        selectedTour: null,
        selectedOffer: null,
        selectedEvent: null,
        eventCount: 0,
        routeCount: 0,
        offerCount: 0,
        totalCount: 0,
        focusedMapLayer: null,
        enabledMapLayers: null,
        currentView: "",
        viewstack: 0,
        maxFeaturedItems: 24,
        //  If this is a device, it makes sense to keep the mac address here
        //  Is there any concrete way to find if this is handheld device btw ?
        currentMacAddress: null,
        locationUpdateCount: 0, // quick way to change frequency of updates based on location updates
        appStatus: null,
        viewTranistioning: false // try to prevent quick taps causing a problem
    },
    components: [{
            kind: "Signals",
            updateParkingData: "updateParkingData"
        },
        // collections of items
        {
            name: "listViewCollection",
            kind: "cls.AllItemCollection"
        }, {
            name: "homeItemsCollection",
            kind: "cls.AllItemCollection"
        }, {
            name: "eventsCollection",
            kind: "cls.EventCollection"
        }, {
            name: "toursCollection",
            kind: "cls.RouteCollection"
        }, {
            name: "offersCollection",
            kind: "cls.OfferCollection"
        }, {
            name: "localOfferCollection",
            kind: "cls.LocalOfferCollection"
        }, {
            name: "incorrectWifiPopup",
            kind: "enyo.Lightbox",
            classes: "comingSoonPopup",
            components: [{
                name: "incorrectWifiPopupContent",
                content: "Please Connect to Chicogo city Wifi."
            }]
        },
        // collections of devices
        {
            name: "parkingCollection",
            kind: "cls.ParkingCollection"
        }, {
            name: "lightingCollection",
            kind: "cls.LightingCollection"
        }, {
            name: "kiosksCollection",
            kind: "cls.KioskCollection"
        }, {
            name: "trafficCollection",
            kind: "cls.TrafficCollection"
        }, {
            name: "crowdCollection",
            kind: "cls.CrowdCollection"
        }, {
            name: "cityAssetsCollection",
            kind: "cls.CityAssetsCollection"
        }
    ],
    bindings: [{
        from: ".$.eventsCollection.length",
        to: ".eventCount"
    }, {
        from: ".$.toursCollection.length",
        to: ".routeCount"
    }, {
        from: ".$.offersCollection.length",
        to: ".offerCount"
    }],
    rendered: function() {
        this.inherited(arguments);
        // app is now rendered, so hide the splash screen - (Uncommented this and have put in a separted window.onload event.)
        // if (typeof(nativeBridge) != "undefined") {
        //     nativeBridge.removeSplashScreen();
        // }
    },
    computed: {
        // function is called whenever any of [property1, property2, ...] change
        homeItemsUpdated: ["eventCount", "routeCount", "offerCount"]
    },
    homeItemsUpdated: function() {
        this.setTotalCount(this.eventCount + this.routeCount + this.offerCount);
        // update the homeItemsCollection used to display all items on the featured page
        // only get the first 10 of each type of items
        var maxPerCategory = 10;
        // always start with tours so that the IoT tour will be first
        var newRecords = _.first(this.$.toursCollection.records, maxPerCategory);
        newRecords = newRecords.concat(_.first(this.$.eventsCollection.records, maxPerCategory));
        newRecords = newRecords.concat(_.first(this.$.offersCollection.records, maxPerCategory));
        // create a single ad
        newRecords.push(new cls.AdModel());
        // recreate list, limiting total to this.maxFeaturedItems
        this.$.homeItemsCollection.removeAll();
        this.$.homeItemsCollection.reset(this.$.homeItemsCollection.getSortedList(newRecords, this.maxFeaturedItems));
    },
    setListContent: function(view) {
        var listCollection = null;
        switch (view) {
            case "TOURS":
                listCollection = this.$.toursCollection;
                break;
            case "OFFERS":
                listCollection = this.$.offersCollection;
                break;
            case "EVENTS":
                listCollection = this.$.eventsCollection;
                break;
        }
        AppConfig.log("App::setListContent", view, listCollection);
        if (listCollection) {
            this.$.listViewCollection.type = listCollection.type;
            this.$.listViewCollection.reset(listCollection.records);
        }
    },
    selectedTourChanged: function(oldVal) {
        // load the route info for the selected tour
        // @TODO: this needs to be hooked up to the selected tour (right now there's only one)
        RoutesDirectionModel.loadRoutesDirection(1);
    },
    getCurrentPosition: function() {
        cls.mapUtils.getCurrentPosition();
        // log the current location
        AnalyticsLogger.logHeartbeat();
        // log the current location
        AnalyticsLogger.logAnalyticsData({
            event: "heartbeat"
        });
    },
    currentLocationChanged: function(inOldValue) {
        var forceShortUpdate = false;
        AppConfig.log("CHECKING currentLocationChanged");
        // update it again in AppConfig.locationUpdateInterval
        if (!this.lastLocation) {
            this.lastLocation = this.currentLocation;
            forceShortUpdate = true;
        } else {
            this.deltaLocation.latitude = this.currentLocation.latitude - this.lastLocation.latitude;
            this.deltaLocation.longitude = this.currentLocation.longitude - this.lastLocation.longitude;
        }
        AppConfig.log(this.currentLocation);
        AppConfig.log(this.lastLocation);
        AppConfig.log(this.deltaLocation);
        var distanceInMiles = cls.mapUtils.calculateDistance(app.currentLocation, app.lastLocation);
        if (distanceInMiles > 0.0001) {
            this.lastLocation = this.currentLocation;
            AppConfig.log("checkForLocationBasedNotification");
            this.checkForLocationBasedNotification();
            // update parking info
            this.getNearbyParkingData();
            // update kiosk info
            this.getNearbyKioskData();
        }
        this.locationUpdateCount++;
        setTimeout(enyo.bind(this, "getCurrentPosition"), forceShortUpdate ? 500 : AppConfig.locationUpdateInterval);
        //RoutesDirectionModel.loadRoutesDirection(1);
    },
    updateDistances: function(collection) {
        if (collection && collection.records) {
            _.each(collection.records, function(record) {
                var distance = record.get('geocoordinates');
                if (distance) {
                    // calculate distance from current location
                    record.set('DISTANCE', cls.mapUtils.calculateDistance(record.get('geocoordinates'), app.currentLocation));
                } else {
                    record.set('DISTANCE', 10000);
                }
            }, this);
        }
    },
    checkForLocationBasedNotification: function() {
        // only do this if the user is logged in
        //@TODO: use the correct attribute to determine logged in
        if (UserModel.responseHeader && UserModel.responseHeader.token) {
            _.each(this.$.localOfferCollection.records, function(notification) {
                var notificationType = notification.get('model') || "undefined";
                notificationType = notificationType.toLowerCase();
                // check if it a supported type
                if (AppConfig.notificationTypes.indexOf(notificationType) >= 0) {
                    // calculate distance
                    var distance = notification.get('geocoordinates');
                    if (distance) {
                        // calculate distance from current location
                        notification.set('DISTANCE', cls.mapUtils.calculateDistance(distance, app.currentLocation));
                    } else {
                        notification.set('DISTANCE', 10000);
                    }
                }
            }, this);
            // sort them all by distance
            var sortedList = _.sortBy(this.$.localOfferCollection.records, function(record) {
                return record.get('DISTANCE');
            });
            AppConfig.log(sortedList);
            var notificationObject = _.find(sortedList, function(notification) {
                var notificationSent = notification.get('notificationSent');
                var distance = notification.get('DISTANCE');
                AppConfig.log("CHECKING notificationObject:", notificationSent, distance, AppConfig.notificationRange);
                return (!notificationSent && (distance < AppConfig.notificationRange));
            }, this);
            if (notificationObject) {
                // found one, so send it
                var notificationType = notificationObject.get('model') == "Kiosk" ? "Kiosk" : "location";
                //@TODO: add support for kiosk, offer, location
                var message = {
                    notificationType: "location",
                    notificationID: notificationObject.get('_id')
                };
                AppConfig.log("SENDING notification ******", message);
                notificationObject.set('notificationSent', true);
                onReceiveMessage(JSON.stringify(message));
            }
        }
    },
    currentUserChanged: function(oldVal) {
        AppConfig.log(this.currentUser, oldVal);
        // AppConfig.alert(this.currentUser, oldVal);
        // load the home screen data
        app.$.offersCollection.fetch({
            replace: true,
            destroyLocal: true,
            query: {
                documentation: "Get nearby deals in specified time frame, of specified categories",
                find: {
                    deal: {
                        category: {
                            name: "All Categories"
                        }
                    }
                }
            }
        });
        app.$.eventsCollection.fetch({
            replace: true,
            destroyLocal: true,
            query: {
                documentation: "Get all city information for specified city",
                find: {
                    event: {
                        cityName: AppConfig.cityName ? AppConfig.cityName : ""
                    }
                }
            }
        });
        app.$.localOfferCollection.fetch({
            replace: true,
            destroyLocal: true
        });
        app.$.toursCollection.fetch({
            replace: true,
            destroyLocal: true
        });
    },
    // view/navigation related methods
    currentViewChanged: function(inOldValue) {
        if (this.currentView !== inOldValue) {
            switch (this.currentView) {
                default: break;
            }
        }
    },
    setViewDirect: function(viewName) {
        this.viewstack = []; // reset the stack
        AppConfig.log("setViewDirect", viewName);
        this.pushView(viewName);
    },
    pushView: function(viewName) {
        if (viewName) {
            // use when you want to return from a view
            if (!this.viewTranistioning && (viewName != this.currentView)) {
                this.viewstack.push(viewName);
                AppConfig.log("Pushed:" + viewName, this.viewstack);
                this.viewTranistioning = true;
                this.setCurrentView(viewName);
            }
        }
    },
    popView: function() {
        var previousView = this.viewstack.pop();
        var newView = this.viewstack.length ? this.viewstack[this.viewstack.length - 1] : "";
        if (!this.viewTranistioning && newView) {
            this.viewTranistioning = true;
            this.setCurrentView(newView);
            AppConfig.log("Popped:" + previousView + ", setting view to:" + newView, this.viewstack);
        } else {
            this.setViewDirect("HOME");
        }
    },
    constructor: function() {
        // low-level or esoteric initialization, usually not needed at all
        this.enabledMapLayers = {};
        this.inherited(arguments);
        // check local storage version
        AppConfig.log(localStorage.getItem("storageVersion"), +this.storageVersion);
        if (localStorage.getItem("storageVersion") != this.storageVersion) {
            this.clearLocalStorage();
            localStorage.setItem("storageVersion", this.storageVersion);
        }
    },
    create: function() {
        this.inherited(arguments);
        AppConfig.log("========== APP/CODE CONSOLE OUTPUT STARTS HERE ==========");
        this.appStatus = {};
        this.viewstack = [];
        this.sortOrderPerList = {};
        this.enabledMapLayers = {};
        this.deltaLocation = {};
        this.selectedTourChanged();
        // get the current location
        cls.mapUtils.getCurrentPosition();
        this.enabledMapLayers = {};
        AppConfig.simulateOtherLocation = localStorage.getItem("iminchicago") || AppConfig.simulateOtherLocation;
        this.setViewDirect("HOME");
    },
    clearLocalStorage: function() {
        AppConfig.log("clearLocalStorage");
        localStorage.removeItem("loggedIn");
        localStorage.removeItem("token");
        localStorage.removeItem("secureId");
        localStorage.removeItem("iminchicago");
        localStorage.clear();
    },
    createFriendlyDateString: function(dateValue, shortVersion) {
        var now = moment();
        var date = moment(dateValue);
        var timeString = date.calendar();
        if (date.diff(now, 'weeks') >= 1) {
            if (shortVersion) {
                timeString = date.format("dddd, MMMM Do");
            } else {
                timeString = date.format("dddd, MMMM Do, h:mm a");
            }
        }
        return timeString;
    },
    getMobileOperatingSystem: function() {
        var userAgent = navigator.userAgent || navigator.vendor || window.opera;
        if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i) || userAgent.match(/iPod/i)) {
            return 'iOS';
        } else if (userAgent.match(/Android/i)) {
            return 'Android';
        } else {
            return 'unknown';
        }
    },
    updateParkingData: function() {
        var parkingProgress = -1;
        if (ParkingModel.parkingObject && ParkingModel.parkingObject.length) {
            AppConfig.log("CHECKING parking:", ParkingModel.parkingObject[0].state.occupied, ParkingModel.parkingObject[0].state.total);
            parkingProgress = (ParkingModel.parkingObject[0].state.occupied * 100 / ParkingModel.parkingObject[0].state.total);
        }
        this.appStatus["P"] = parkingProgress;
    },
    getNearbyKioskData: function() {
        // if ((this.locationUpdateCount % 4) == 0) {
        if (this.$.kiosksCollection.records && this.$.kiosksCollection.records.length) {
            this.updateDistances(this.$.kiosksCollection);
            var nearby = _.filter(this.$.kiosksCollection.records, function(kiosk) {
                var distance = kiosk.get('DISTANCE');
                AppConfig.log("CHECKING kiosk:", distance, AppConfig.notificationRange);
                return (distance < AppConfig.kioskRange);
            });
            this.appStatus["K"] = (nearby.length * 100) / this.$.kiosksCollection.length;
        } else {
            this.$.kiosksCollection.fetch({});
        }
        // }
    },
    getNearbyParkingData: function() {
        // do it every 3rd update
        if ((this.locationUpdateCount % 3) == 0) {
            if (this.currentLocation && this.currentLocation.latitude && this.currentLocation.longitude) {
                var pdata = {
                    "query": {
                        "documentation": "Get nearby parking spots (distance in miles)",
                        "find": {
                            "var": {
                                "name": "queryPoint",
                                "geocoordinates": {
                                    "latitude": this.currentLocation.latitude,
                                    "longitude": this.currentLocation.longitude
                                }
                            },
                            "parkingSpace": {
                                "le": {
                                    "target": "distance(this.parkingSpots, queryPoint)",
                                    "value": "1.0"
                                }
                            }
                        }
                    }
                };
                ParkingModel.loadParkingData(pdata);
            }
        }
    }
});
enyo.ready(function() {
    // create this first so that the paths are set up for the app
    var appConfig = new AppConfig();
    var logger = new AnalyticsLogger();
    AnalyticsLogger.initialize();
    new cls.Application({
        name: "app"
    });
    AnalyticsLogger.logAnalyticsData({
        event: "launch"
    });
});

function onReceiveMessage(message) {
    AppConfig.log(message);
    AppConfig.log("THE MESSAGE IS : " + message);
    PushModel.currentPushMessageShownStatus = false;
    PushModel.currentPushMessage = message;
    enyo.Signals.send("messageReceived", {
        message: message
    });
}

function onReceiveMacAddress(macAddress) {
    UserModel.MAC_ADDRESS = macAddress;
    UserModel.deviceOS = 'iOS';
}

function getUserLocation() {   
    if (typeof(nativeBridge) != "undefined") {                         
        var loc = nativeBridge.getUserLocation();                            
        if (loc) {                             
            var latlng = JSON.parse(loc);  //No need to parse in the case of iOS 
            if (latlng.lat && latlng.lng) {
                return {
                    latitude: latlng.lat,
                    longitude: latlng.lng,
                    accuracy: 10
                };                            
            }
        }  
    }
    return false;
}

function onTapSubmit() {                                   
    enyo.Signals.send("loginFromKeyBoard");
}

window.onload = function(){
    //  remove the splash screen now. not then.
    AppConfig.log("Window.load() executed now: " + new Date());
    if (typeof(nativeBridge) != "undefined") {
        nativeBridge.removeSplashScreen();
    }
}