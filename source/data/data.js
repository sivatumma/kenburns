/**
    For simple applications, you might define all of your models, collections,
    and sources in this file.  For more complex applications, you might choose to separate
    these kind definitions into multiple files under this folder.
*/
enyo.kind({
    name: "AjaxAPI",
    statics: {
        //You can make the API request using:
        //  DeviceDetailApi.getConnections(["172.16.255.16"], this, this.test);
        doLogout: function(errorReason) {
            // @TODO: show error popup with ok button instead of alert
            var logoutUrl = AppConfig.baseURL + "logout.jsp";
            if (errorReason) {
                logoutUrl += "?type=" + errorReason;
            }
            window.location = logoutUrl;
            responseHandled = false;
        },
        //In the object that makes the call, you can do handle the response:
        //  test: function(inSender, inEvent){
        //   }
        defaultErrorHandler: function(inSender, inResponse) {
            var responseHandled = false;
            AppConfig.alert(inResponse);
            switch (inResponse) {
                case 0:
                    enyo.Signals.send("onAjaxError", {
                        errorMessage: "Unable to connect to the server. You will be logged out automatically.",
                        forceLogout: true,
                        errorReason: "unreachable"
                    });
                    break;
                case 'timeout':
                    enyo.Signals.send("onAjaxError", {
                        errorMessage: "Request Timed Out"
                    });
                    break;
                default:
                    if (inSender.xhrResponse.body) {
                        enyo.Signals.send("onAjaxError", {
                            errorMessage: "Error: " + inSender.xhrResponse.body
                        });
                    } else {
                        enyo.Signals.send("onAjaxError", {
                            errorMessage: "Error: Unknown"
                        });
                    }
                    // log the user out
                    break;
            }
            return responseHandled;
        },
        unifiedSuccessHandler: function(inSender, inResponse) {
            var responseHandled = true;
            if (inResponse !== null && (inResponse === "" || typeof inResponse === 'object') || inSender.contentType === "application/octet-stream") {
                // return false so that the local success handler can process the response
                responseHandled = false;
            } else {
                // log the user out
                enyo.Signals.send("onAjaxError", {
                    errorMessage: "Session Expired.\n You will be logged out automatically.",
                    errorReason: "session_expired",
                    forceLogout: true
                });
            }
            return responseHandled;
        },
        // request URL - url to call (baseURL + requestURL)
        // ipArray - array of IPs to add to the request or null for none
        // context - context for successCallback or errorCallback
        // successCallback - success handler (parser for the json)
        // errorCallback - optional error handler
        makeAjaxRequest: function(requestURL, ipArray, context, successCallback, errorCallback, method, postBody, contentType, timeoutValue, token) {
            // set url (stripping leadding '/' from requestURL)
            if (requestURL.charAt(0) == "/") {
                requestURL = requestURL.replace("/", "");
            }
            var urlText = requestURL;
            if (urlText.indexOf(AppConfig.baseURL) != 0) {
                if (AppConfig.baseURL.charAt(AppConfig.baseURL.length - 1) == "/") {
                    urlText = AppConfig.baseURL + requestURL;
                } else {
                    urlText = AppConfig.baseURL + "/" + requestURL;
                }
            }
            if (ipArray) {
                urlText = this.generateParamsText(urlText, ipArray);
            }
            // log.debug("*** makeAjaxRequest: " + urlText);
            var methodType = (method && method !== "") ? method.toUpperCase() : "GET";
            var ajax = new enyo.Ajax({
                url: urlText,
                cacheBust: false,
                method: methodType,
                timeout: timeoutValue || AppConfig.defaultTimeoutInterval,
                headers: token,
                contentType: contentType || "application/json", // not setting this treats the data a form
                postBody: postBody
            });
            if (postBody) {
                switch (methodType) {
                    case "POST":
                    case "PUT":
                        ajax.postBody = postBody || {};
                        ajax.handleAs = "json";
                        break;
                    default:
                        log.error("Post Body passed to request, but method type is " + methodType, urlText);
                        break;
                }
            }
            // send parameters the remote service using the 'go()' method
            ajax.go();
            // attach responders to the transaction object
            var successHandler = (context && successCallback) ? enyo.bind(context, successCallback) : null;
            ajax.response(function(inSender, inResponse) {
                // unifiedSuccessHandler returns true if it handled the response, so
                //  don't call the handler if it returns true
                if (!AjaxAPI.unifiedSuccessHandler(inSender, inResponse)) {
                    if (successHandler) {
                        successHandler(inSender, inResponse);
                    }
                }
            });
            var errorHandler = (context && errorCallback) ? enyo.bind(context, errorCallback) : null;
            // user error handler that was passed in or the default handler
            ajax.error(errorHandler || AjaxAPI.defaultErrorHandler);
        },
        generateParamsText: function(urlText, ipArray) {
            urlText = urlText.replace("deviceId=?", "");
            urlText = urlText.replace("?", "");
            _.each(ipArray, function(ip) {
                if (ip == ipArray[0]) {
                    urlText = urlText + "?deviceId=" + ip.toString();
                } else {
                    urlText = urlText + "&deviceId=" + ip.toString();
                }
            }, this);
            return (urlText);
        },
        simpleAjaxRequest: function(requestURL, context, successCallback, errorCallback, method, postBody, contentType, timeoutValue) {
            // set url (stripping leadding '/' from requestURL)
            if (requestURL.charAt(0) == "/") {
                requestURL = requestURL.replace("/", "");
            }
            var urlText = requestURL;
            if (urlText.indexOf(AppConfig.baseURL) != 0) {
                if (AppConfig.baseURL.charAt(AppConfig.baseURL.length - 1) == "/") {
                    urlText = AppConfig.baseURL + requestURL;
                } else {
                    urlText = AppConfig.baseURL + "/" + requestURL;
                }
            }
            var authToken = {
                "token": UserModel.responseHeader.token
            };
            // log.debug("*** makeAjaxRequest: " + urlText);
            var methodType = (method && method !== "") ? method.toUpperCase() : "GET";
            var ajax = new enyo.Ajax({
                url: urlText,
                cacheBust: false,
                method: methodType,
                timeout: timeoutValue || AppConfig.defaultTimeoutInterval,
                headers: authToken,
                contentType: contentType || "application/json", // not setting this treats the data a form
                postBody: postBody
            });
            if (postBody) {
                switch (methodType) {
                    case "POST":
                    case "PUT":
                        ajax.postBody = postBody || {};
                        ajax.handleAs = "json";
                        break;
                    default:
                        log.error("Post Body passed to request, but method type is " + methodType, urlText);
                        break;
                }
            }
            // send parameters the remote service using the 'go()' method
            ajax.go();
            // attach responders to the transaction object
            var successHandler = (context && successCallback) ? enyo.bind(context, successCallback) : null;
            ajax.response(function(inSender, inResponse) {
                if (successHandler) {
                    successHandler(inResponse);
                }
            });
            var errorHandler = (context && errorCallback) ? enyo.bind(context, errorCallback) : null;
            // user error handler that was passed in or the default handler
            ajax.error(errorHandler || AjaxAPI.defaultErrorHandler);
        },
    }
});
enyo.kind({
    name: "UserModel",
    statics: {
        userObject: '',
        responseHeader: '',
        MAC_ADDRESS: '',
        deviceOS: '',
        loginUser: function(username, password, provider, successCallback, errorCallback, ctx) {
            var postBody = {
                "username": username,
                "password": password,
                "provider": provider
            };
            AppConfig.log(postBody);
            AjaxAPI.makeAjaxRequest("mobile-app/login", null, ctx, successCallback, errorCallback, "POST", postBody);
        },
        logoutUser: function(username, successCallback, errorCallback, ctx) {
            /*Because Local storage issue in shell app*/
            // var token = "";
            // if (typeof(Storage) !== "undefined" && localStorage.getItem("loggedIn") == "true") {
            //     token = localStorage.getItem("token");
            // } else {
            //     token = UserModel.responseHeader.token;
            // }
            var token = UserModel.responseHeader.token;
            var authToken = {
                "token": token
            };
            var postBody = {
                "username": username
            };
            AjaxAPI.makeAjaxRequest("mobile-app/logout", null, ctx, successCallback, errorCallback, "GET", null, null, null, authToken);
        },
        registerUser: function(params, successCallback, errorCallback, ctx) {
            var mac = null;
            // var nativeBridge = nativeBridge ? nativeBridge : {};
            try {
                if (UserModel.MAC_ADDRESS && UserModel.MAC_ADDRESS.length > 0) {
                    mac = UserModel.MAC_ADDRESS;
                } else {
                    var macAddress = nativeBridge.getMacAddress();
                    var macJSON = JSON.parse(macAddress);
                    UserModel.MAC_ADDRESS = macJSON.value;
                    mac = macJSON.value;
                    if (nativeBridge && Utils.isFunction(nativeBridge)) {
                        var macAddress = nativeBridge.getMacAddress();
                        var macJSON = JSON.parse(macAddress);
                        UserModel.MAC_ADDRESS = macJSON.value;
                        mac = macJSON.value;
                    }
                }
            } catch (e) {
                AppConfig.log("We do not have access to this device's MAC_ADDRESS. Registration will fail");
            }
            AppConfig.alert("macJSON-Status:" + macJSON.status + ", macJSON-Value:" + macJSON.value);
            var postBody = {
                "username": params.username, //    what is facebook id ?
                "email": params.email,
                "password": params.password || 'testing',
                "age": params.age || 21, //  If this is facebook user, we default that to 21 years of age
                "sex": params.gender, //  Only male or female
                "provider": params.provider,
                "mac": UserModel.MAC_ADDRESS || mac
            };
            AjaxAPI.makeAjaxRequest("mobile-app/register", null, ctx, successCallback, errorCallback, "POST", postBody);
        },
        authorizeUser: function(params, successCallback, errorCallback, ctx) {
            AjaxAPI.makeAjaxRequest("mobile-app/authorize", null, ctx, successCallback, errorCallback, "POST", postBody);
        }
    }
});
enyo.kind({
    name: "RoutesModel",
    statics: {
        routesObject: '',
        updateModel: function() {
            // restart a timeout at 60 seconds + some random amount of time
            setTimeout(enyo.bind(EventModel, "updateModel"), 60 * 1000 + enyo.irand(10));
            RoutesModel.loadRoutes();
        },
        loadRoutes: function() {
            var token = UserModel.responseHeader.token;
            var authToken = {
                "token": token
            };
            AjaxAPI.makeAjaxRequest("/api/routes?Data.q=all", null, this, "processStatus", null, "", "", null, null, authToken);
        },
        processStatus: function(inSender, inEvent) {
            if (inEvent) {
                RoutesModel.routesObject = inEvent.Output;
                enyo.Signals.send("updateRoutes", {});
            }
        }
    }
});
// code for tour success API
enyo.kind({
    name: "TourSuccessModel",
    statics: {
        tourSucessObject: '',
        loadTourSuccess: function(inSender, routeID) {
            var token = UserModel.responseHeader.token;
            var tourFeedback = inSender;
            var authToken = {
                "token": token
            };
            AjaxAPI.makeAjaxRequest("/feedbacks/", null, this, "processStatus", null, "POST", tourFeedback, null, null, authToken);
        },
        processStatus: function(inSender, inEvent) {
            if (inEvent) {
                AppConfig.log("TourSucessModel " + inEvent);
            }
        }
    }
});
// Tours feedback and rating AJAX Implimentation
enyo.kind({
    name: "TourFRatingModel",
    statics: {
        tourFRatingObject: '',
        loadTourFRatingData: function(tourId) {
            var token = UserModel.responseHeader.token;
            var authToken = {
                "token": token
            };
            AjaxAPI.makeAjaxRequest("/feedbacks/average/" + tourId, null, this, "processStatus", null, "GET", "", null, null, authToken);
        },
        processStatus: function(inSender, inEvent) {
            if (inEvent) {
                TourFRatingModel.tourFRatingObject = inEvent;
                enyo.Signals.send("updateTourFRatingData");
            }
        }
    }
});
enyo.kind({
    name: "RoutesDirectionModel",
    statics: {
        routesDirectionObject: '',
        tourType: null,
        updateModel: function() {
            // restart a timeout at 60 seconds + some random amount of time
            setTimeout(enyo.bind(EventModel, "updateModel"), 60 * 1000 + enyo.irand(10));
            RoutesDirectionModel.loadRoutesDirection();
        },
        // loadRoutesDirection: function() {
        //     var token = UserModel.responseHeader.token;
        //     var authToken = {
        //         "token": token
        //     };
        //     AjaxAPI.makeAjaxRequest("/api/directions?Data.q=direction&Data.id=1", null, this, "processStatus", null, "", "", null, null, authToken);
        // },
        loadRoutesDirection: function(dataId) {
            this.tourType = dataId == 1 ? "A" : "B";
            var token = UserModel.responseHeader.token;
            var authToken = {
                "token": token
            };
            AjaxAPI.makeAjaxRequest("/api/directions?Data.q=direction&Data.id=" + dataId, null, this, "processStatus", null, "", "", null, null, authToken);
        },
        processStatus: function(inSender, inEvent) {
            if (inEvent) {
                RoutesDirectionModel.routesDirectionObject = inEvent.Output[0];
                enyo.Signals.send("updateRouteDirections", {});
            }
        }
    }
});
enyo.kind({
    name: "RoutesDirectionRealModel",
    statics: {
        routesDirectionRealObject: '',
        routesDirectionRealOfferObject: '',
        loadRealRoutesDirection: function(startLatitude, startLongitude, endLatitude, endLongitude, successCallback) {
            var token = UserModel.responseHeader.token;
            var authToken = {
                "token": token
            };
            // AjaxAPI.makeAjaxRequest("/api/real-directions?Data.q=direction&Data.start=-87.3632,41.6400&Data.end=-87.1875,41.7713", null, this, "processStatus", "processError", "", "", null, null, authToken);
            AjaxAPI.makeAjaxRequest("/api/real-directions?Data.q=direction&Data.start=" + startLongitude + "," + startLatitude + "&Data.end=" + endLongitude + "," + endLatitude + "", null, this, successCallback, "processError", "", "", null, null, authToken);
        },
        processError: function(inSender, inEvent) {}
    }
});
// Offers AJAX Implimentation
enyo.kind({
    name: "OffersModel",
    statics: {
        offersObject: '',
        loadOffers: function(inSender) {
            var token = UserModel.responseHeader.token;
            var offers = {
                "query": inSender
            };
            var authToken = {
                "token": token
            };
            // AjaxAPI.makeAjaxRequest("/api/smart-deal", null, this, "processStatus", null, "POST", offers);
            AjaxAPI.makeAjaxRequest("/api/smart-deal", null, this, "processStatus", null, "POST", offers, null, null, authToken);
        },
        processStatus: function(inSender, inEvent) {
            if (inEvent) {
                OffersModel.offersObject = inEvent.deal;
                enyo.Signals.send("updateOffers");
            }
        }
    }
});
// parking AJAX Implimentation
enyo.kind({
    name: "ParkingModel",
    statics: {
        parkingObject: '',
        loadParkingData: function(inSender) {
            var token = UserModel.responseHeader.token;
            var parking = {
                "query": inSender
            };
            var authToken = {
                "token": token
            };
            AjaxAPI.makeAjaxRequest("/api/parking", null, this, "processStatus", null, "POST", parking, null, null, authToken);
        },
        processStatus: function(inSender, inEvent) {
            if (inEvent) {
                ParkingModel.parkingObject = inEvent.parkingSpace;
                enyo.Signals.send("updateParkingData");
            }
        }
    }
});
// Offer Category AJAX Implimentation
enyo.kind({
    name: "OfferCategoryModel",
    statics: {
        offerCategoryModel: '',
        loadOfferCategory: function() {
            var token = UserModel.responseHeader.token;
            var offers = {
                "query": {
                    "documentation": "Get categories of deals",
                    "find": {
                        "deal": {}
                    },
                    "select": {
                        "categoryName": "[:category.name:]"
                    }
                }
            };
            var authToken = {
                "token": token
            };
            // AjaxAPI.makeAjaxRequest("/api/smart-deal", null, this, "processStatus", null, "POST", offers);
            AjaxAPI.makeAjaxRequest("/api/smart-deal", null, this, "processStatus", null, "POST", offers, null, null, authToken);
        },
        processStatus: function(inSender, inEvent) {
            if (inEvent) {
                OfferCategoryModel.offerCategoryModel = inEvent.categoryName;
                enyo.Signals.send("updateOfferCategory");
            }
        }
    }
});
// Events AJAX Implimentation
enyo.kind({
    name: "EventsModel",
    statics: {
        eventsObject: '',
        loadEvents: function(inSender) {
            var token = UserModel.responseHeader.token;
            var events = {
                "query": {
                    "documentation": "Get all city information for specified city",
                    "find": {
                        "event": inSender
                    }
                }
            };
            var authToken = {
                "token": token
            };
            AjaxAPI.makeAjaxRequest("/api/city-info", null, this, "processStatus", null, "POST", events, null, null, authToken);
        },
        processStatus: function(inSender, inEvent) {
            if (inEvent) {
                EventsModel.eventsObject = inEvent.event;
                enyo.Signals.send("updateEvents");
            }
        }
    }
});
// Event Directions AJAX Implimentation
// enyo.kind({
//     name: "EventDirectionsModel",
//     statics: {
//         eventDirectionsObject: '',
//         loadEventDirections: function(inSender) {
//             var token = UserModel.responseHeader.token;
//             var offers = {
//                 "query": inSender
//             };
//             var authToken = {
//                 "token": token
//             };
//             // AjaxAPI.makeAjaxRequest("/api/smart-deal", null, this, "processStatus", null, "POST", offers);
//             AjaxAPI.makeAjaxRequest("/api/smart-deal", null, this, "processStatus", null, "POST", offers, null, null, authToken);
//         },
//         processStatus: function(inSender, inEvent) {
//             if (inEvent) {
//                 OffersModel.offersObject = inEvent.deal;
//                 enyo.Signals.send("updateOffers");
//             }
//         }
//     }
// });
// KIOSK AJAX Implimentation
enyo.kind({
    name: "KioskModel",
    statics: {
        kioskObject: '',
        loadKisoks: function(inSender) {
            var token = UserModel.responseHeader.token;
            var kiosk = {
                "query": inSender
            };
            var authToken = {
                "token": token
            };
            AjaxAPI.makeAjaxRequest("/api/kiosk", null, this, "processStatus", null, "POST", kiosk, null, null, authToken);
        },
        processStatus: function(inSender, inEvent) {
            if (inEvent) {
                enyo.Signals.send("kioskStatusSignal", {
                    "status": inEvent.status
                });
            }
        }
    }
});
// KIOSK Near By AJAX Implimentation
enyo.kind({
    name: "KioskNearByModel",
    statics: {
        kioskNeaByrObject: '',
        viewType: '',
        loadKisoksNearBy: function(inSender, viewInfo) {
            var token = UserModel.responseHeader.token;
            KioskNearByModel.viewType = viewInfo;
            var kiosk = {
                "query": inSender
            };
            var authToken = {
                "token": token
            };
            AjaxAPI.makeAjaxRequest("/api/kiosk", null, this, "processStatus", null, "POST", kiosk, null, null, authToken);
        },
        processStatus: function(inSender, inEvent) {
            if (inEvent.kiosk.length > 0) {
                KioskNearByModel.kioskNeaByrObject = inEvent.kiosk;
                enyo.Signals.send("updateEventKisoksNearBy");
            }
        }
    }
});
enyo.kind({
    name: "Utils",
    statics: {
        snippet: function(str, cutOffset) {
            if (str == '' || str == null) str = "";
            if (str.length > cutOffset) {
                return (str.substring(0, cutOffset) + "...");
            } else {
                return str;
            }
        },
        isFunction: function(functionToCheck) {
            var getType = {};
            return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
        }
    }
});
enyo.kind({
    name: "LayersModel",
    statics: {
        dataUpdated: "",
        lastRequestedLayer: '',
        layersObj: [{
            layerName: "lights",
            dynamicLayer: true,
            requestURL: "api/lights",
            reqStatus: false,
            dataObject: '',
            active: false
        }, {
            layerName: "kiosks",
            requestURL: "api/kiosk",
            dynamicLayer: false,
            reqStatus: false,
            iconType: "bookmark-o",
            dataObject: '',
            active: false
        }, {
            layerName: "parking",
            dynamicLayer: true,
            iconType: "car",
            requestURL: "api/parking",
            reqStatus: false,
            dataObject: '',
            active: false
        }, {
            layerName: "crowd",
            iconType: 'crowd',
            dynamicLayer: true,
            requestURL: "api/mse/location/clients/",
            reqStatus: false,
            dataObject: '',
            active: false
        }, {
            layerName: "traffic",
            iconType: "traffic",
            dynamicLayer: true,
            requestURL: "api/smart-traffic",
            reqStatus: false,
            dataObject: '',
            active: false
        }, {
            layerName: "events",
            requestURL: "api/city-info",
            dynamicLayer: false,
            reqStatus: false,
            iconType: "bookmark-o", //  Please note this should be modified and is put just not to break the whole code
            dataObject: '',
            active: false
        }, {
            layerName: "Key City Assets",
            dynamicLayer: false,
            iconType: "building-o",
            // Lists all city assets
            // requestURL: "/api/city-asset?Data.q=all",
            // Lists all city assets which are lying in current map view
            requestURL: "/api/city-asset?Data.q=bound&Data.BBoxLonMin=-87.632816&Data.BBoxLatMin=41.894826&Data.BBoxLonMax=-87.620690&Data.BBoxLatMax=41.878344",
            reqStatus: false,
            dataObject: '',
            active: false
        }, {
            layerName: "tours",
            dynamicLayer: false,
            iconType: "tour",
            requestURL: "/api/routes?Data.q=all", //    prior to this, it was "/api/city-asset?Data.q=all"
            reqStatus: false,
            dataObject: '',
            active: false
        }],
        changeLayerStatus: function(layerName, status) {
            var layersObj = [];
            var newLayer = {};
            _.each(LayersModel.layersObj, function(layer) {
                newLayer = {};
                enyo.mixin(newLayer, layer);
                if (layer.layerName == layerName) {
                    newLayer.active = status;
                }
                if (newLayer.active && !newLayer.dataObject && !newLayer.reqStatus) {
                    LayersModel.getData(newLayer);
                    newLayer.reqStatus = true;
                }
                layersObj.push(newLayer);
            });
            LayersModel.layersObj = layersObj;
            enyo.Signals.send("layersUpdated");
        },
        periodicUpdateData: function() {
            setInterval(function() {
                _.each(LayersModel.layersObj, function(layer) {
                    if (layer.dynamicLayer && layer.active) {
                        LayersModel.getData(layer);
                    }
                });
            }, AppConfig.dataLoadInterval);
        },
        getData: function(layerObj) {
            var layer = layerObj.layerName;
            LayersModel.lastRequestedLayer = layer;
            var requestURL = "";
            var postBody = "";
            var method = "";
            switch (layer) {
                case "lights":
                    method = "POST";
                    // postBody = {
                    //     "query": {
                    //         "find": {
                    //             "light": {
                    //                 "operatedBy": "iot-wf",
                    //                 "geocoordinates": {
                    //                     "lat": "+41.887667" + "," + "51.887667",
                    //                     "lon": "-84.632521" + "," + "-87.432521"
                    //                 }
                    //             }
                    //         }
                    //     }
                    // };
                    postBody = {
                        // "query": {
                        //     "documentation": "Get all lights operated by iot-wf",
                        //     "find": {
                        //         "light": {
                        //             "operatedBy": "iot-wf",
                        //             "geocoordinates": {
                        //                 "lat": "+41.887667,+51.887667",
                        //                 "lon": "-87.622521,-87.432521"
                        //             }
                        //         }
                        //     }
                        // }
                        // Fetching all the lights
                        "query": {
                            "documentation": "Get all lights operated by specified organization (maps to logical scopes)",
                            "find": {
                                "light": {
                                    "operatedBy": "iot-wf"
                                }
                            }
                        }
                    };
                    break;
                case "Key City Assets":
                    method = "GET";
                    break;
                case "kiosks":
                    method = "POST";
                    postBody = {
                        "query": {
                            "documentation": "Get kiosks at specified location",
                            "find": {
                                "kiosk": {
                                    // "location": {
                                    //     "zone": "businessZone"
                                    // }
                                }
                            }
                        }
                    };
                    break;
                case "parking":
                    method = "POST";
                    postBody = {
                        "query": {
                            "documentation": "Get parking space operated by specified organization",
                            "find": {
                                "parkingSpace": {
                                    "operatedBy": "iot-wf"
                                }
                            }
                        }
                    };
                    break;
                case "events":
                    method = "POST";
                    postBody = {
                        "query": {
                            "documentation": "Get all city information for specified city",
                            "find": {
                                "event": {
                                    "cityName": AppConfig.cityName ? AppConfig.cityName : ""
                                }
                            }
                        }
                    };
                    break;
                case "traffic":
                    method = "POST";
                    postBody = {
                        "query": {
                            "documentation": "Get viewports corresponding to medium density traffic operated by 'iot-wf'",
                            "find": {
                                "traffic": {
                                    "operatedBy": "iot-wf"
                                }
                            }
                        }
                    };
                    break;
                case "tours":
                    method = "GET";
                    postBody = {
                        "query": {
                            "documentation": "Get viewports corresponding to medium density traffic operated by 'iot-wf'",
                            "find": {
                                "tours": {
                                    "operatedBy": "iot-wf"
                                }
                            }
                        }
                    };
                    postBody = null;
                    break;
                default:
                    break;
            }
            var token = UserModel.responseHeader.token;
            var authToken = {
                "token": token
            };
            AjaxAPI.makeAjaxRequest(layerObj.requestURL, null, this, "processData", "errorHandler", method, postBody, null, null, authToken);
            // requestURL, ipArray, context, successCallback, errorCallback, method, postBody, contentType, timeoutValue, token
        },
        processData: function(inSender, inResponse) {
            var layersObj = [];
            var newLayer = {};
            _.each(LayersModel.layersObj, function(layer) {
                newLayer = {};
                enyo.mixin(newLayer, layer);
                if (inSender.url.indexOf(layer.requestURL) >= 0) {
                    switch (layer.layerName) {
                        case "lights":
                            newLayer.dataObject = inResponse.lights;
                            break;
                        case "parking":
                            newLayer.dataObject = inResponse.parkingSpace[0].parkingSpots;
                            break;
                        case "Key City Assets":
                            newLayer.dataObject = inResponse.Output;
                            break;
                        case "kiosks":
                            newLayer.dataObject = inResponse.kiosk;
                            break;
                        case "events":
                            newLayer.dataObject = inResponse.event;
                            break;
                        case "traffic":
                            newLayer.dataObject = inResponse.traffic;
                            break;
                        case "tours":
                            RoutesModel.loadRoutes();
                            // newLayer.dataObject = inResponse.tours;
                            break;
                        case "crowd":
                            newLayer.dataObject = inResponse.Locations ? inResponse.Locations.WirelessClientLocation : "undefined";
                            break;
                        default:
                            break;
                    }
                }
                layersObj.push(newLayer);
            });
            LayersModel.layersObj = layersObj;
            enyo.Signals.send("layersUpdated", {
                layerName: LayersModel.lastRequestedLayer
            });
            enyo.Signals.send("hideLoader");
        },
        errorHandler: function(inSender, inResponse) {}
    }
});
enyo.kind({
    name: "OfferNotificationModel",
    statics: {
        offerNotificationObject: '',
        loadOffer: function(id) {
            var token = UserModel.responseHeader.token;
            var authToken = {
                "token": token
            };
            AjaxAPI.makeAjaxRequest("/offers/" + id, null, this, "processStatus", null, "", "", null, null, authToken);
        },
        processStatus: function(inSender, inEvent) {
            if (inEvent) {
                OfferNotificationModel.offerNotificationObject = inEvent;
                enyo.Signals.send("updateOfferNotification", {
                    offerNotificationObject: OfferNotificationModel.offerNotificationObject
                });
            }
        }
    }
});
