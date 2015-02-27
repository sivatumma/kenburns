enyo.kind({
    name: "cls.listView",
    classes: "list-view page-area",
    kind: "FittableRows",
    fit: true,
    published: {
        type: "", // type of items we are presenting
        numItems: null, // bound to the app list we are presenting, when it changes, we filter it into our own collection (filteredItems)
        currentFilter: "all", // current filter (empty == all)
        sortOrder: "location",
        maxItems: 50
    },
    components: [{
        kind: "Signals",
        changedToView: "viewChanged"
    }, {
        name: "mainHeader",
        kind: "cls.navHeader",
        title: "",
    }, {
        name: "listViewFilterButtons",
        classes: "list-view-filter-buttons",
        kind: "onyx.RadioGroup",
        components: [{
            name: "nearMe",
            content: "Near Me",
            classes: "list-view-filter-button",
            active: true,
            ontap: "onTapEventFilter",
            sortType: "location"
        }, {
            name: "byDate",
            content: "By Date",
            classes: "list-view-filter-button",
            ontap: "onTapEventFilter",
            sortType: "date"
        }],
        // TPERRY - remove until we have better data and styling...
        // }, {
        //     name: "listFilterSelector",
        //     kind: "Select",
        //     classes: "list-filter",
        //     onchange: "selectChanged",
        //     components: [{
        //         content: "Show All",
        //         value: "0",
        //         classes: "left"
        //     },{
        //         content: "Today",
        //         value: "1",
        //         classes: "left"
        //     }]
    }, {
        name: "listViewContentArea",
        classes: "list-view-content-area",
        fit: true,
        components: [{
            kind: "enyo.DataList",
            name: "eventRepeater",
            classes: "list-scroller",
            components: [{
                ontap: "itemTapHandler",
                classes: "list-item-card",
                components: [{
                    classes: "list-card-image-bg",
                    name: "itemImage",
                    imageURL: null,
                    components: [{
                        kind: "FittableRows",
                        classes: "list-card-image",
                        components: [{
                            name: "filler",
                            fit: true
                        }, {
                            name: "eventTitle",
                            classes: "list-item-title short-text"
                        }, {
                            name: "divider",
                            classes: "list-card-divider-row"
                        }, {
                            kind: "FittableColumns",
                            classes: "list-card-details-row",
                            components: [{
                                kind: "FittableColumns",
                                classes: "list-card-details-left",
                                components: [{
                                    name: "eventLocationLabel",
                                    classes: "list-card-item-text-label short-text",
                                    content: "Location:"
                                }, {
                                    name: "eventLocation",
                                    classes: "list-card-item-text short-text",
                                    fit: true
                                }]
                            }, {
                                kind: "FittableColumns",
                                classes: "list-card-details-right",
                                fit: true,
                                components: [{
                                    name: "eventTimeLabel",
                                    classes: "list-card-item-text-label short-text",
                                    content: "Time:"
                                }, {
                                    name: "eventTime",
                                    classes: "list-card-item-text short-text",
                                    fit: true
                                }]
                            }]
                        }, {
                            name: "deviceToolbar",
                            kind: "cls.listItemToolbar",
                            fit: true,
                        }]
                    }]
                }],
                bindings: [{
                    from: ".model.title",
                    to: ".$.eventTitle.content"
                }, {
                    from: ".model.imageURL",
                    to: ".$.itemImage.imageURL",
                    transform: function(v) {
                        // set background image
                        this.$.itemImage.applyStyle("background-image", "url(" + v + ")");
                        this.$.itemImage.applyStyle("background-repeat", "round");
                        //         // also set the icon to use here
                        //         // var type = this.model.get('type');
                        //         // this.$.itemIcon.addRemoveClass("fa-ticket", type=="event");
                        //         // this.$.itemIcon.addRemoveClass("event-color", type=="event");
                        //         // this.$.itemIcon.addRemoveClass("fa-binoculars", type=="tour");
                        //         // this.$.itemIcon.addRemoveClass("tour-color", type=="tour");
                        //         // this.$.itemIcon.addRemoveClass("fa-tags", type=="offer");
                        //         // this.$.itemIcon.addRemoveClass("offer-color", type=="offer");
                        return v;
                    },
                }, {
                    from: ".model.location",
                    to: ".$.eventLocation.content"
                }, {
                    from: ".model.sortOrder",
                    to: ".$.eventLocation.content",
                    transform: function(v) {
                        // use this to update the device status for now...
                        var deviceStatus = this.model.get('deviceStatus');
                        if (deviceStatus) {
                            this.$.deviceToolbar.updateStatus(deviceStatus);
                        }
                        return cls.mapUtils.getFriendlyValue(this.model.get('DISTANCE'));
                    }
                }, {
                    from: ".model.startTime",
                    to: ".$.eventTime.content",
                    transform: function(v) {
                        return app.createFriendlyDateString(this.model.get('startTime'), true);
                    }
                }]
            }]
        }]
    }, {
        name: "filteredItems",
        kind: "cls.AllItemCollection"
    }, {
        kind: "enyo.Lightbox",
        name: "comingSoonPopup",
        classes: "comingSoonPopup",
        components: [{
            content: "Coming Soon..."
        }]
    }],
    bindings: [{
        from: ".app.$.listViewCollection.length",
        to: ".numItems"
    }, {
        from: ".$.filteredItems",
        to: ".$.eventRepeater.collection"
    }],
    numItemsChanged: function(inOldValue) {
        if (app.$.listViewCollection) {
            this.setType(app.$.listViewCollection.type);
            this.filterAndSortEvents(true);
        }
    },
    typeChanged: function(inOldValue) {
        // Temporarily setting the title based on the type,
        // instead of changing the type in mutiple files for now
        // to make sure nothing breaks
        if (this.type == "tours") {
            this.$.mainHeader.setTitle("Attractions");
        } else if (this.type == "offers") {
            this.$.mainHeader.setTitle("Shopping");
        } else {
            this.$.mainHeader.setTitle(this.type);
        }
    },
    filterAndSortEvents: function(refreshDistance) {
        if (!app.currentLocation) {
            if (app.$.listViewCollection.length) {
                this.$.listViewFilterButtons.setActive(this.$.byDate);
                this.sortOrder = "date";
            }
        }
        var sortOrder = this.sortOrder;
        AppConfig.log("sorting by " + sortOrder)
        // Now apply any requested filters
        // default returns everything
        var filterFunction = function(item) {
            return true
        };
        switch (this.currentFilter) {
            case "today":
                filterFunction = function(item) {
                    var data = item.attributes;
                    var now = moment();
                    var date = moment(data.startTime);
                    return now.format("MM/DD/YYYY") == date.format("MM/DD/YYYY");
                };
                break;
        }
        var filteredRecords = app.$.listViewCollection.filter(filterFunction);
        var sortFunction = function(item) {
            var date = moment(item.get('startTime'));
            // use to display right value in the item card
            item.set('sortOrder', sortOrder);
            item.set('deviceStatus', {
                p: cls.mapUtils.getHashValue(item.get('title')) % 100,
                c: cls.mapUtils.getHashValue(item.get('body')) % 100,
                k: cls.mapUtils.getHashValue(item.get('imageURL')) % 100,
                s: cls.mapUtils.getHashValue(item.get('type') + item.get('title')) % 100,
                t: cls.mapUtils.getHashValue(item.get('type') + item.get('body')) % 100
            });
            AppConfig.log("sort by "+sortOrder, date.format("X"));
            return date.format("X");
        };
        AppConfig.log("app location set");
        switch (this.sortOrder) {
            case "location":
                sortFunction = function(item) {
                    if (refreshDistance || !item.get('DISTANCE')) {
                        if (item.get('geocoordinates')) {
                            // calculate distance from current location
                            item.set('DISTANCE', cls.mapUtils.calculateDistance(item.get('geocoordinates'), app.currentLocation));
                        }
                    }
                    item.set('sortOrder', sortOrder);
                    item.set('deviceStatus', {
                        p: cls.mapUtils.getHashValue(item.get('title')) % 100,
                        c: cls.mapUtils.getHashValue(item.get('body')) % 100,
                        k: cls.mapUtils.getHashValue(item.get('imageURL')) % 100,
                        s: cls.mapUtils.getHashValue(item.get('type') + item.get('title')) % 100,
                        t: cls.mapUtils.getHashValue(item.get('type') + item.get('body')) % 100
                    });
                    AppConfig.log("sort by "+sortOrder, item.attributes.DISTANCE);
                    return item.get('DISTANCE');
                };
                break;
        }
        AppConfig.log(sortOrder);
        filteredRecords = _.sortBy(filteredRecords, sortFunction);
        this.$.filteredItems.reset(_.first(filteredRecords, this.maxItems));
    },
    //  handlers
    itemTapHandler: function(inSender, inEvent) {
        // don't let this event get handled somewhere else (in leaflet map to be exact)
        inEvent.preventDefault();
        var selectedItem = inSender.model;
        if (selectedItem) {
            switch (selectedItem.get('type')) {
                case "event":
                    app.setSelectedEvent(selectedItem);
                    app.pushView("EVENTDETAILSVIEW");
                    break;
                case "offer":
                    app.setSelectedOffer(selectedItem);
                    app.pushView("OFFERDETAILSVIEW");
                    break;
                case "tour":
                    app.setSelectedTour(selectedItem);
                    if (inSender.index == 0) {
                        app.pushView("TOURDETAIL");
                    } else {
                        this.$.comingSoonPopup.show();
                    }
                    break;
            }
        }
        // stop event propagation
        return true;
    },
    onTapEventFilter: function(inSender, inEvent) {
        this.sortOrder = inSender.sortType;
        this.filterAndSortEvents();
        // stop event propagation
        return true;
    },
    viewChanged: function(inSender, inEvent) {
        var that = this;
        if (inEvent.newView == this.name) {
            this.filterAndSortEvents(true);
        }
    },
});
enyo.kind({
    name: "cls.listItemToolbar",
    classes: "list-item-toolbar",
    kind: "FittableColumns",
    published: {
        selectedLayer: ""
    },
    components: [{
        classes: "list-item-toolbar-button",
        name: "cStatus",
        components: [{
            name: "cIcon",
            classes: "glyph icon-crowds list-item-toolbar-icon"
        }],
        mapLayer: "CROWD",
        dataLayerName: "crowd",
        ontap: "layerTap"
    }, {
        classes: "list-item-toolbar-button",
        name: "sStatus",
        components: [{
            name: "sIcon",
            classes: "glyph icon-lighting list-item-toolbar-icon"
        }],
        mapLayer: "SPECIAL",
        dataLayerName: "lights",
        ontap: "layerTap"
    }, {
        classes: "list-item-toolbar-button",
        name: "kStatus",
        components: [{
            name: "kIcon",
            classes: "glyph icon-kiosk-v2 list-item-toolbar-icon"
        }],
        mapLayer: "KIOSKS",
        dataLayerName: "kiosks",
        ontap: "layerTap"
    }, {
        classes: "list-item-toolbar-button",
        name: "tStatus",
        components: [{
            name: "tIcon",
            classes: "glyph icon-traffic-v2 list-item-toolbar-icon"
        }],
        dataLayerName: "traffic",
        mapLayer: "TRAFFIC",
        ontap: "layerTap"
    }, {
        classes: "list-item-toolbar-button",
        name: "pStatus",
        components: [{
            name: "pIcon",
            classes: "glyph icon-parking-taxi list-item-toolbar-icon"
        }],
        mapLayer: "PARKING",
        dataLayerName: "parking",
        ontap: "layerTap"
    }],
    layerTap: function(inSender, inEvent) {
        app.setSelectedLayer(inSender);
        this.setSelectedLayer(inSender.dataLayerName);
        return true;
    },
    updateStatus: function(deviceStatus) {
        _.each(deviceStatus, function(deviceState, key) {
            var icon = this.$[key + "Icon"];
            var status = this.$[key + "Status"];
            if (status) {
                status.addRemoveClass("active", deviceState > 0);
            }
            if (icon) {
                icon.addRemoveClass("icon-low", deviceState > 0 && deviceState < 40);
                icon.addRemoveClass("icon-med", deviceState >= 40 && deviceState < 70);
                icon.addRemoveClass("icon-high", deviceState >= 70);
            }
        }, this);
    }
});