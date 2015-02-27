enyo.kind({
  name: "AnalyticsLogger",
  statics:{
    loggerKey: "692039f6-5516-49e0-816c-5a1b9df72ce9",
    loggerHost: "https://logs-01.loggly.com",
    loggerURL: "",
    apiURL: "http://mtuity.loggly.com/api/facets/json.",
    appName: "CIM_Mobile",
    platformInfo: {name:'unknown'},
    _analyticsLogger: null,
    temp_udid: null,
    version: 2,
    heartbeatPrefix: null,
    initialize: function() {

      if ((typeof(_LTracker) != 'undefined') && _LTracker) {
        enyo.log('Analytics Initialized');
        AnalyticsLogger._analyticsLogger = _LTracker;
        AnalyticsLogger._analyticsLogger.push({'logglyKey': this.loggerKey });        
      } else {
        AnalyticsLogger._analyticsLogger = [];
        enyo.warn('analytics not available')
      }

      this.heartbeatPrefix = 'http' + ( ('https:' === document.location.protocol ? 's' : '') ) + '://'

      this.temp_udid = localStorage.getItem("temp_udid");
      if (!this.temp_udid) {
            // lifted from here -> http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/2117523#2117523
            this.temp_udid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
              var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
              return v.toString(16);
          });
          localStorage.setItem("temp_udid", this.temp_udid);     
      }
    },
    _sendLogData: function(logData) {
        // enyo.log('logging analytics:', logData);
        AnalyticsLogger._analyticsLogger.push(logData);
    },
    logAnalyticsData: function(logObj) {
      if (AnalyticsLogger._analyticsLogger) {
        var postData = {date: Date(), href: window.location.href, app: AnalyticsLogger.appName};
        // enyo.log('logging analytics (platformInfo):', AnalyticsLogger.platformInfo);
        // add the platform data
        enyo.mixin(postData,AnalyticsLogger.platformInfo);

        // add data that was passed in to the logging function
        enyo.mixin(postData,logObj);

        // add location
        postData.location = app.getCurrentLocation();
        this._sendLogData(postData);   
      } else {
        enyo.warn('unable to log analytics:'+ postData);
      }
    },
    logHeartbeat: function() {
      var heartbeatURL = this.heartbeatPrefix + "mqciscocls.mqidentity.net:8080/fid-LogMessageSink";
      if (this.heartbeatPrefix.indexOf("https") >= 0) {
        heartbeatURL = this.heartbeatPrefix + "mqciscocls.mqidentity.net:443/fid-LogMessageSink";
      }
      var ajax = new enyo.Ajax({
        url: heartbeatURL,
        method: "POST",
        contentType: "application/json", // not setting this treats the data a form
        cacheBust: false
      });
      var loc = app.getCurrentLocation();
      // var now = moment();
      var postBody = {
        message: "heartbeat",
        type: "heartbeat",
        timestamp: Date.now(), //now.format("X"),
        latitude: loc.latitude,
        longitude: loc.longitude,
        udid: this.temp_udid,
        version: this.version
      };

      AppConfig.log(postBody);
      ajax.postBody = postBody || {};
      ajax.error(this, "processError");
      ajax.go();
    },
    getAnalyticsData: function(resource, context, callback) {
      var ajax = new enyo.Ajax({
        url: this.apiURL + resource +'/',
        cacheBust: false,
        headers: {
          "Authorization": this.authHeader()
        }
      });
      ajax.response(context, callback);
      ajax.error(this, "processError");
      ajax.go();
    },
    authHeader: function() {
      var tok = "devtuity" + ':' + "dev2MTUITY";
      var hash = window.btoa(tok);
      return "Basic " + hash;
    },
    processError: function(inSender, inResponse) {
      console.error("*** Loggly API ERROR ***");
      console.error(inResponse);
    },
  },
});
