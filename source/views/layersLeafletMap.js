enyo.kind({
    name: "layersLeafletMap",
    classes: "leaflet-map",
    published: {
        currentAssetClicked: null,
        currentLocation: null,
        myMarkers: [],
        userInteracting: false,
        selectedMarkers: {
            lights: [],
            kiosks: [],
            events: [],
            parking: [],
            crowd: [],
            "Key City Assets": []
        },
        mapLayers: [],
        center: {
            lat: 41.878114,
            lng: -87.629798
        },
        // showMarker: true,
        zoom: 18,
        maxZoom: 20,
        // point imagePath to your leaflet images folder
        imagePath: "assets",
        tileProvider: "mapbox",
        currentLocationLayer: null
    },
    events: {
        onMarkerSelectionUpdated: '',
        onRouteSelection: ''
    },
    components: [{
        kind: "Signals",
        layersUpdated: "layersUpdated",
        applyLayers: "layersUpdated",
    }],
    bindings: [{
        from: ".app.currentLocation",
        to: ".currentLocation",
        transform: function(v) {
            if (v && v.latitude && v.longitude) {
                this.setCenter(v);
            }
            return v;
        }
    }],
    clearSelection: function(inSender, inEvent) {
        var that = this;
        _.each(this.selectedMarkers, function(markers, key) {
            var temp = markers;
            that.selectedMarkers[key] = [];
            _.each(temp, function(marker) {
                marker.layer.setIcon(that.generateMarkerIcon(false, marker.layer.options.layerInfo, marker.layer.options.markerData));
            });
        });
        that.doMarkerSelectionUpdated({
            selectedMarkers: that.selectedMarkers
        });
    },
    rendered: function() {
        this.inherited(arguments);
        this.renderMap();
    },
    renderMap: function() {
        this.destroyMap();
        this.imagePathChanged();
        this.createMap();
        this.createLayer();
        this.zoomChanged();
        LayersModel.periodicUpdateData();
        // this.showMarkerChanged();
        // this.addMarkerClusterLayer();
    },
    createMap: function() {
        var that = this;
        var loc = app.getCurrentLocation() || {
            latitude: 41.87938,
            longitude: -87.624551,
            accuracy: 100
        };
        this.map = L.map(this.hasNode()).setView({
            lat: loc.latitude,
            lng: loc.longitude
        }, this.zoom);
        this.currentLocationLayer = L.circleMarker([loc.latitude, loc.longitude], {
            radius: loc.accuracy * 0.5,
            weight: 1,
            color: '#403ce0',
            fillColor: '#403ce0',
            fillOpacity: 0.2
        });
        this.map.addLayer(this.currentLocationLayer);
        // add notification circles for testing...
        _.each(app.$.localOfferCollection.records, function(notification) {
            var notificationType = notification.get('model') || "undefined";
            notificationType = notificationType.toLowerCase();
            // check if it a supported type
            if (AppConfig.notificationTypes.indexOf(notificationType) >= 0) {
                // calculate distance
                AppConfig.log(notification);
                var distance = notification.get('geocoordinates');
                if (distance) {
                    var notificationSent = notification.get('notificationSent');
                    var color = notificationSent ? '#EE0A0A' : notificationType == "location" ? '#FDBC91' : '#8BB4E9';
                    var notifyMarker = L.circle([distance.latitude, distance.longitude], AppConfig.notificationRange / 0.000189394 * 0.3048, {
                        weight: 1,
                        color: color,
                        fillColor: color,
                        fillOpacity: 0.2
                    }).addTo(this.map);
                }
            }
        }, this);
        /*Added Reset Button*/
        var myButtonOptions = {
            'text': 'Reset', // string
            'onClick': function() {
                AppConfig.log("Reset button clicked");
                var loc = {
                    latitude: that.center.lat,
                    longitude: that.center.lng
                };
                that.userInteracting = false;
                that.map.setZoom(that.zoom);
                that.setCenter(loc);
                AppConfig.alert(that.zoom);
            }, // callback function
            'hideText': true, // bool
            'maxWidth': 30, // number
            'doToggle': false, // bool
            'toggleStatus': false // bool
        };
        var myButton = new L.Control.Button(myButtonOptions).addTo(this.map);
        this.map.on('dragstart', function() {
            that.userInteracting = true;
        });
        this.map.on('zoomstart', function() {
            that.userInteracting = true;
        });
    },
    createLayer: function() {
        var tile = this.getTile();
        if (tile) {
            tile.settings.maxZoom = this.maxZoom;
            L.tileLayer(tile.url, tile.settings).addTo(this.map);
        }
    },
    generateMarkerIcon: function(selectionStatus, layer, marker) {
        var validMarker = true;
        var html = "<img ";
        var selection = _.find(this.selectedMarkers[layer.layerName], function(item) {
            return item.layer == marker.layer;
        });
        var className = selection ? ' selectedMarker' : '';
        // var className = 
        var iconStyle = " style='width:32px; height:32px;'";
        if (layer) {
            switch (layer.layerName) {
                case 'lights':
                    if ((marker.schedule && marker.schedule.id) || (marker.layer && marker.layer.options.markerData.schedule && marker.layer.options.markerData.schedule.id)) {
                        className = " policyExistingOnThisLight" + className;
                    }
                    if (marker.powerstate == "ON") {
                        html += "src='assets/mapIcons/map_icon_lighting-green.svg'";
                    } else {
                        html += "src='assets/mapIcons/map_icon_lighting.svg'";
                    }
                    break;
                case 'kiosks':
                    html += "src='assets/mapIcons/map_icon_kiosk-v2.svg'";
                    break;
                case 'parking':
                    if (marker.state && marker.state.occupied == false) {
                        html += "src='assets/mapIcons/map_icon_parking_taxi.svg'";
                    } else {
                        html += "src='assets/mapIcons/map_icon_parking-taxi-red.svg'";
                    }
                    break;
                case 'Key City Assets':
                    var markerType = marker.layer ? marker.layer.options.markerData.type : marker.type;
                    switch (markerType) {
                        case 'Museum':
                            html += "src='assets/mapIcons/map_icon_museum.svg'";
                            break;
                        case 'BusStop':
                            html += "src='assets/mapIcons/map_icon_bus.svg'";
                            break;
                        case 'RecycleBin':
                            validMarker = false;
                            break;
                        default:
                            console.log("Using default icon for " + layer.layerName + " type:" + marker.type);
                            html += "src='assets/mapIcons/map_icon_building.svg'";
                            break;
                    }
                    break;
                case 'events':
                    html += "src='assets/mapIcons/map_icon_events.svg'";
                    break;
                case 'crowd':
                    html += "src='assets/mapIcons/map_icon_crowd.svg'";
                    break;
            }
            var icon = null;
            if (validMarker) {
                html += iconStyle;
                html += "/>";
                var icon = L.divIcon({
                    html: html,
                    className: className
                });
                AppConfig.log(icon);
            }
            return icon;
        }
    },
    imagePathChanged: function() {
        L.Icon.Default.imagePath = this.imagePath;
    },
    zoomChanged: function() {
        this.map.setZoom(this.zoom);
    },
    setCenter: function(loc) {
        this.center.lat = loc.latitude;
        this.center.lng = loc.longitude;
        if (this.currentLocationLayer) {
            this.currentLocationLayer.setLatLng(this.center);
        }
        if (!this.userInteracting) {
            if (this.map) {
                this.updateCenter();
            }
        }
    },
    updateCenter: function() {
        this.map.panTo(this.getLatLng());
    },
    destroyMap: function() {
        this.map = null;
    },
    locate: function() {
        this.map.locate({
            setView: true,
            maxZoom: this.maxZoom
        });
    },
    getZoom: function() {
        return this.map.getZoom();
    },
    getLatLng: function(inLat, inLng) {
        return new L.LatLng(inLat || this.center.lat, inLng || this.center.lng);
    },
    gotoNeighborhood: function(neighborHood) {
        var boundingbox = neighborHood.Bound.split(",");
        var southWest = L.latLng(boundingbox[1], boundingbox[0]);
        var northEast = L.latLng(boundingbox[3], boundingbox[2]);
        var bounds = [southWest, northEast];
        if (this.map) {
            this.map.fitBounds(bounds);
        }
    },
    getTile: function() {
        var tile;
        switch (this.tileProvider) {
            case "google":
                tile = {
                    url: "http: //{s}.googleapis.com/vt?lyrs=m@174225136&src=apiv3.8&hl=en-US&x={x}&y={y}&z={z}&s=Galile&style=api%7Csmartmaps",
                    settings: {
                        subdomains: ['mt0', 'mt1', 'mt2'],
                        attribution: "Map data Â© 2012 Google"
                    }
                };
                break;
            case "cloudmade":
                tile = {
                    url: "http://{s}.tile.cloudmade.com/" + this.cloudmateApiKey + "/997/256/{z}/{x}/{y}.png",
                    settings: {
                        attribution: "Map data Â© 2011 OpenStreetMap contributors, Imagery Â© 2011 CloudMade"
                    }
                };
                break;
            case "mapbox":
                tile = {
                    url: "http://{s}.tiles.mapbox.com/v3/timtuity.90357cd0/{z}/{x}/{y}.png",
                    settings: {
                        // attribution: "Map data &copy; <a href='http://openstreetmap.org'>OpenStreetMap</a> contributors, <a href='http://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery Â© <a href='http://mapbox.com'>Mapbox</a>"
                        // attribution: ""
                    }
                };
        }
        return tile;
    },
    layersUpdated: function(inSender, inEvent) {
        var that = this;
        _.each(LayersModel.layersObj, function(layer) {
            var layerRendered = _.find(that.mapLayers, function(mapLayer) {
                return mapLayer.options.layerName == layer.layerName;
            });
            if (!layer.active || (layerRendered && layer.dynamicLayer)) {
                that.mapLayers = _.reject(that.mapLayers, function(mapLayer) {
                    if (mapLayer.options.layerName == layer.layerName) {
                        layerRendered = false;
                        that.map.removeLayer(mapLayer);
                    }
                    return mapLayer.options.layerName == layer.layerName;
                });
            }
            if (layer.active && layer.dataObject && !layerRendered) {
                var markerCluster = new L.MarkerClusterGroup({
                    spiderfyOnMaxZoom: true,
                    showCoverageOnHover: false,
                    zoomToBoundsOnClick: true,
                    removeOutsideVisibleBounds: true,
                    disableClusteringAtZoom: 18,
                    layerName: layer.layerName
                });
                var newMarker = "";
                switch (layer.layerName) {
                    case "Key City Assets":
                        _.each(layer.dataObject, function(marker) {
                            var markerIcon = that.generateMarkerIcon(false, layer, marker);
                            if (markerIcon) {
                                newMarker = new L.Marker(new L.LatLng(marker.coordinates.Pos.Y, marker.coordinates.Pos.X), {
                                    id: marker.id,
                                    icon: markerIcon,
                                    layerInfo: layer,
                                    assetType: layer.layerName,
                                    title: layer.layerName,
                                    selected: false,
                                    clickable: true,
                                    markerData: marker
                                });
                                that.myMarkers.push(newMarker);
                                markerCluster.addLayer(newMarker);
                            }
                        });
                        break;
                    case "traffic":
                        // TO DO: need to add resonable data and code optimization
                        var mediumLatLngSet = [];
                        _.each(layer.dataObject.density.medium, function(item, index) {
                            mediumLatLngSet.push(new L.LatLng(item[0], item[2]));
                            mediumLatLngSet.push(new L.LatLng(item[1], item[3]));
                        });
                        newMarker = new L.polygon(mediumLatLngSet, true, true);
                        var highLatLngSet = [];
                        _.each(layer.dataObject.density.high, function(item, index) {
                            highLatLngSet.push(new L.LatLng(item[0], item[2]));
                            highLatLngSet.push(new L.LatLng(item[1], item[3]));
                        });
                        newMarker = new L.polygon(highLatLngSet, true, true);
                        break;
                    case "crowd":
                        var heatMapLatLng = [];
                        _.each(layer.dataObject, function(marker) {
                            if (marker.GeoCoordinate) {
                                heatMapLatLng.push([parseFloat(marker.GeoCoordinate[0].$.lattitude), parseFloat(marker.GeoCoordinate[0].$.longitude)]);
                            }
                        });
                        var heatLayer = new L.heatLayer(heatMapLatLng);
                        markerCluster.addLayer(heatLayer);
                        break;
                    case "events":
                        _.each(layer.dataObject, function(marker) {
                            marker.geocoordinates = marker.address[0].geocoordinates;
                            newMarker = new L.Marker(new L.LatLng(marker.geocoordinates.latitude, marker.geocoordinates.longitude), {
                                id: marker.id,
                                icon: that.generateMarkerIcon(false, layer, marker),
                                layerInfo: layer,
                                assetType: layer.layerName,
                                title: layer.layerName,
                                selected: false,
                                clickable: true,
                                markerData: marker
                            });
                            that.myMarkers.push(newMarker);
                            markerCluster.addLayer(newMarker);
                        });
                        break;
                    default:
                        _.each(layer.dataObject, function(marker) {
                            newMarker = new L.Marker(new L.LatLng(marker.geocoordinates.latitude, marker.geocoordinates.longitude), {
                                id: marker.id,
                                icon: that.generateMarkerIcon(false, layer, marker),
                                layerInfo: layer,
                                assetType: layer.layerName,
                                title: layer.layerName,
                                selected: false,
                                clickable: true,
                                markerData: marker
                            });
                            that.myMarkers.push(newMarker);
                            markerCluster.addLayer(newMarker);
                        });
                        break;
                }
                enyo.Signals.send("hideLoader");
                markerCluster.on('click', function(markerEvent) {
                    // if (markerEvent && markerEvent.layer) {
                    //     enyo.Signals.send("mapMarkerSelected", {
                    //         markerData: markerEvent.layer.options
                    //     });
                    // }
                    var layerName = markerEvent.layer.options.layerInfo.layerName;
                    if (markerEvent.layer.options.selected) {
                        markerEvent.layer.options.selected = false;
                        that.selectedMarkers[layerName] = _.reject(that.selectedMarkers[layerName], function(item) {
                            return item.layer == markerEvent.layer;
                        });
                        markerEvent.layer.setIcon(that.generateMarkerIcon(false, markerEvent.layer.options.layerInfo, markerEvent));
                    } else {
                        markerEvent.layer.options.selected = true;
                        that.selectedMarkers[layerName].push(markerEvent);
                        markerEvent.layer.setIcon(that.generateMarkerIcon(true, markerEvent.layer.options.layerInfo, markerEvent));
                    }
                    that.doMarkerSelectionUpdated({
                        selectedMarkers: that.selectedMarkers
                    });
                });
                that.map.addLayer(markerCluster);
                that.mapLayers.push(markerCluster);
            }
        });
    },
    addPolyLine: function(stops, extremePoints, allPoints, tourLayerId) {
        var that = this;
        if (this.map && stops) {
            var directionArray = _.map(stops, function(stop) {
                return L.latLng(parseFloat(stop.Latitude), parseFloat(stop.Longitude));
            });
            AppConfig.log(directionArray);
            var tourMarkerIcon = L.divIcon({
                html: '<i class="fa fa-circle"></i>',
                className: "tourendpoints"
            })
            var polyline = L.polyline(directionArray, {
                color: "#FFBE00",
                weight: 8,
                tourLayerId: tourLayerId
            });
            var layerGroup = "";
            if (allPoints) {
                var markers = _.map(directionArray, function(item) {
                    return L.marker(item, {
                        tourLayerId: tourLayerId
                    });
                });
                var x = [];
                _.each(RoutesDirectionModel.routesDirectionObject.RouteDirections, function(dir) {
                    _.each(dir.SegmentGeometry.Pos, function(item) {
                        x.push(L.latLng(parseFloat(item.Y), parseFloat(item.X)));
                    });
                });
                if (x) {
                    polyline = L.polyline(x, {
                        color: "#FFBE00",
                        weight: 8,
                        tourLayerId: tourLayerId
                    });
                }
                layerGroup = L.featureGroup(_.union(markers, polyline));
            } else if (extremePoints) {
                var marker1 = L.marker(directionArray[0], {
                    icon: tourMarkerIcon,
                    tourLayerId: tourLayerId
                });
                var marker2 = L.marker(directionArray[directionArray.length - 1], {
                    icon: tourMarkerIcon,
                    tourLayerId: tourLayerId
                });
                layerGroup = L.featureGroup([marker1, marker2, polyline]);
            } else {
                layerGroup = L.featureGroup([polyline]);
            }
            layerGroup.on('click', function(e) {
                that.doRouteSelection({
                    tourLayerId: e.layer.options.tourLayerId
                });
            })
            this.map.addLayer(layerGroup);
            if (layerGroup.getBounds().isValid()) {
                this.map.fitBounds(layerGroup.getBounds());
            }
        }
    }
});