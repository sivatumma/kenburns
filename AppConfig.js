enyo.kind({
    name: "AppConfig",
    statics: {
        baseURL: "/", // should be used everywhere in the app
        prodURL: "/",
        // debugURL: "https://localhost/",
        // debugURL: "https://173.36.245.244/",
        debugURL: "https://cim.cisco.com/",
        currentLocation: true,
        secureid: "iotwf2014",
        ssid: "@City Wi-Fi IoT", //  As per Jason O Brien's suggestion (:))
        notificationTypes: ["offer", "event", "location"], // _lowercase_ values for notifications - notifications ("offers") with these types will generate a location based message
        notificationRange: 100 * 0.000189394, // distance to trigger a notification when the app reaches a location in miles, 100 ft in this case
        kioskRange: 50 * 0.000189394, // distance to trigger a icon update when a kiosk is nearby in miles, 50 ft in this case
        finalTourStopRange: 50 * 0.000189394, // distance to trigger a icon update when a kiosk is nearby in miles, 50 ft in this case
        simulateOtherLocation: false, // set to true to use hyatt location (doesn't update/not working)
        kioskQueryRange: "500ft", // distance passed to find nearby kiosks format defined by MQ API
        allKiosksRange: "5280ft", // distance for all kiosks to check so that we don't have to make API requests all the time (they don't move so might as well get them all)
        locationUpdateInterval: 5 * 1000, // 4 seconds
        dataLoadInterval: 20 * 1000,
        debugMode: false, //  Set this to true to enable console logging and alert() statements. 
        //  Set this to false,before deploying the app into production.
        developmentMode: true, //  Same as above, but meaningful. Would use at a later time.
        alertsEnabled: false, //  alert statements will only work if this is true & debugMode is true.
        consoleLoggingEnabled: true, //  console.log statements will only work if this is true & debugMode is true.
        logglyLoggingEnabled: false, //  AppConfig.log() Logs will go to loggly endpoints if this is set to true. 
        cityName: "Chicago", // Get all city information for specified city
        latitude: 41.887730, // default latitude pointing to Chicago
        longitude: -87.622326, // default logitude pointing to Chicago
        specialIcons: {
            'Wacker near Hyatt Regency': "assets/mapIcons/map_icon_nerv.svg",
            'Michigan Ave. Bridge': "assets/mapIcons/map_icon_bridge.svg",
            'Michigan & South Water St.': "assets/mapIcons/map_icon_connected-lights.svg",
            'Michigan Ave & Lake St.': "assets/mapIcons/map_icon_cta.svg",
            'E. Randolph St. Between Michigan & Stetson': "assets/mapIcons/map_icon_city-planning.svg",
            'Stetson Ave & Lake St.': "assets/mapIcons/map_icon_parking_taxi.svg",
            'Hyatt Regency': "assets/mapIcons/map_icon_hyatt-start.svg"
        },
        //  alert only if debugMode and alertsMode are true
        alert: function(message) {
            if (AppConfig.debugMode && AppConfig.alertsEnabled) {
                alert(message);
            }
        },
        log: function(message) {
            if (AppConfig.logglyLoggingEnabled) AnalyticsLogger.logAnalyticsData(message);
            // Log only if debugMode and logsMode are true. In production, logs will only goto loggly.
            if (AppConfig.debugMode && AppConfig.consoleLoggingEnabled) {
                console.log(message);
            }
        }
    },
    create: function() {
        this.inherited(arguments);
        if (!window.location.hostname || window.location.hostname.indexOf("localhost") >= 0) {
            AppConfig.baseURL = AppConfig.debugURL;
        }
    }
});