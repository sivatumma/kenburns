/* MenuPane.js
 *
 * Copyright © 2012 Ryan Watkins <ryan@ryanwatkins.net>
 *
 * Permission to use, copy, modify, distribute, and sell this software
 * and its documentation for any purpose is hereby granted without
 * fee, provided that the above copyright notice appear in all copies
 * and that both that copyright notice and this permission notice
 * appear in supporting documentation. No representations are made
 * about the suitability of this software for any purpose. It is
 * provided "as is" without express or implied warranty.
 */

/**
 A Pane/View control that also provides Path/Facebook like menus
 that slide in from the left or right sides

 */
enyo.kind({
  name: "rwatkins.MenuPane",
  defaultView: "login",
  published: {
    /** a list menu item controls for the left side menu.
        set 'view' property to the 'name' of the view to display
    */
    menu: "",
    /** a list menu item controls for the right side menu.
        set 'view' property to the 'name' of the view to display
    */
    secondarymenu: "",

    //* the currently selected view.  Use setView() and getView() to change w/o menu actions
    view: "",
    currentArranger: ""
  },
  events: {
    //* Sent when view changes
    onViewChange: "",
    //* Sent when left menu opens
    onMenuOpen: "",
    //* Sent when left menu closes
    onMenuClose: "",
    //* Sent when right menu opens
    onSecondaryMenuOpen: "",
    //* Sent when right menu closes
    onSecondaryMenuClose: ""
  },

  //* @protected
  classes: "menu-pane",
  style: "overflow: hidden;",
  position: {  // default to 300px open
    menu: {
      min: 0, max: 280
    },
    secondarymenu: {
      min: 0, max: 0
    }
  },
  controlParentName: "pane",

  components: [
    { name: "menu",
      kind: "FittableRows",
      classes: "enyo-fit menupane-menu",
      ontap: "menuTapHandler"
    },
    { name: "secondarymenu",
      kind: "FittableRows",
      classes: "enyo-fit menupane-menu-secondary",
      showing: false,
      ontap: "menuTapHandler"
    },
    { name: "pane", kind: "enyo.Slideable", layoutKind: "FittableRowsLayout", classes: "menupane-pane",
      value: 0, min: 0, max: 285, draggable: true,
      style: "width: 100%; height: 100%",
      onAnimateFinish: "paneAnimateFinishHandler",
      components: [
        { kind: "Toolbar", name: "toolbar", onToggleMenu: "toggleMenu" },
        { name: "collaborationbar", kind: "CollaborationBar", onToggleMenu: "toggleMenu" },
        { kind: "FittableRows", fit: true, classes: "appContainer", components: [ 
          {name: "views", kind: "Panels", ontap: "gridViewTapHandler", style:"-webkit-transform:translate3d(0,0,0);", draggable: false, fit:true}],
      }],
    }
  ],

  panelArrangers: [
    {name: "CardArranger", arrangerKind: "CardArranger"},
    {name: "CardSlideInArranger", arrangerKind: "CardSlideInArranger"},
    {name: "CarouselArranger", arrangerKind: "CarouselArranger", classes: "panels-sample-wide"},
    {name: "CollapsingArranger", arrangerKind: "CollapsingArranger", classes: "panels-sample-collapsible"},
    {name: "LeftRightArranger", arrangerKind: "LeftRightArranger"},
    {name: "TopBottomArranger", arrangerKind: "TopBottomArranger", classes: "panels-sample-topbottom"},
    {name: "SpiralArranger", arrangerKind: "SpiralArranger", classes: "panels-sample-spiral"},
    {name: "GridArranger", arrangerKind: "GridArranger"},
    {name: "SpiralArranger", arrangerKind: "SpiralArranger", classes: "panels-sample-spiral"},
  ],

  // TODO: public methods
  //   openMenu();
  //   closeMenu();
  //   openSecondaryMenu();
  //   closeSecondaryMenu();

  reflowViews: function() {
    var views = this.$.views.getPanels();
    // this.log("looking for:"+name);

    for (var i = views.length - 1; i >= 0; i--) {
      if (views[i].name != this.getView()) {
        // views[i].reflow();
        // views[i].resized();
      }
    }
  },

  getNamedView: function(name) {
    var views = this.$.views.getPanels();
    // this.log("looking for:"+name);

    for (var i = views.length - 1; i >= 0; i--) {
      if (views[i].name == name) {
        return views[i];
      }
    }
    return null;
  },
  //* @public
  //* Select a view by name - does not animate
  selectView: function(name, animate) {
    var views = this.$.views.getPanels();
    // this.log("looking for:"+name);

    for (var i = views.length - 1; i >= 0; i--) {
      if (views[i].name == name) {
        // this.log("found match at i:"+i);
        // if (views[i].name == "home") {
        //   this.selectArranger(7);
        //   this.$.views.setIndex(0);
        //   this.view = name;
        // } else {
          this.selectArranger(0);
          if (animate) {
            this.$.views.setIndex(i);
          } else {
            this.$.views.setIndexDirect(i); // always direct since the panel is scrolled during the transition
          }
        // }
        if (views[i].title) {
          this.$.collaborationbar.changeTitle(views[i].title);
        } else {
          this.$.collaborationbar.changeTitle(views[i].name);
        }
        break;
      }
    }
  },

  // select arranger
  selectArranger: function(arrangerIndex) {
    if (1 || (this.currentArranger != arrangerIndex)) {
      if (this.panelArrangers.length > arrangerIndex) {
        // this.log("select arranger:"+this.panelArrangers[arrangerIndex].name+"("+(arrangerIndex+1)+" of "+this.panelArrangers.length+")");
        var p = this.panelArrangers[arrangerIndex];
        var sp = this.$.views;
        if (this.currentClass) {
          sp.removeClass(this.currentClass)
        }
        if (p.classes) {
          sp.addClass(p.classes);
          this.currentClass = p.classes;
        }
        sp.setArrangerKind(p.arrangerKind);
        // if (enyo.Panels.isScreenNarrow()) {
        //   this.setIndex(1);
        // }
        this.currentArranger = arrangerIndex;
      }
    }
  },

  //* toggles the main menu
  toggleMenu: function(inSender, ionOriginator, secondary) {
    this.$.menu.setShowing((!secondary));
    this.$.secondarymenu.setShowing(secondary);
    this.$.pane.setMax(secondary ? this.position.secondarymenu.max : this.position.menu.max);
    this.$.pane.setMin(secondary ? this.position.secondarymenu.min : this.position.menu.min);
    this.$.pane.toggleMinMax();
  },

  //* toggles the secondary main menu
  toggleSecondaryMenu: function(inSender, inOriginator) {
    this.toggleMenu(inSender, inOriginator, true);
  },

  //* @protected
  create: function() {
    this.inherited(arguments);

    // TODO: make available via own Kind
    this.$.pane.$.animator.setDuration(250);
  },

  rendered: function() {
      // important! must call the inherited method
      this.inherited(arguments);  

      // this.log("MenuPane-rendered: updating widths");
      var docWidth = document.body.clientWidth;
      // var docHeight = document.body.clientHeight;

      // this.position.menu.max = this.position.menu.max * 100 / docWidth;
      // this.position.menu.min = this.position.menu.min * 100 / docWidth;

      // this.position.secondarymenu.max = this.position.secondarymenu.max * 100 / docWidth;
      // this.position.secondarymenu.min = this.position.secondarymenu.min * 100 / docWidth;

      this.$.pane.setMax(this.position.menu.max);
      this.$.pane.setMin(this.position.menu.min);
      this.resized();
  },

  initComponents: function() {
    this.inherited(arguments);

    this.$.menu.createComponents(this.menu, { owner: this });
    this.$.secondarymenu.createComponents(this.secondarymenu, { owner: this });
    this.$.views.createComponents(this.contentcomponents, { owner: this.$.pane });
    var sp = this.$.views;
    // sp.reflow();
    sp.setIndex(sp.length-1);
    this.setView(this.defaultView);
  },

  gridViewTapHandler: function(inSender, inEvent)
  {
    var control = inEvent.originator;
    // this.log(control);
    while (!control.navView && control.parent) {
      control = control.parent;
    }
    if (control.navView) {
      this.selectView(control.navView, true);
    }
  },

  animateToView: function(view, menuName)
  {
    var docWidth = document.body.clientWidth;
    this.$.pane.$.animator.setDuration(200);
    this.$.pane.animateTo((menuName == "secondarymenu") ? -docWidth : docWidth);
    this.toview = view;
  },

  menuTapHandler: function(inSender, inEvent) {
    if (inSender.name == "secondarymenu") {
      this.$.pane.setMax(this.position.secondarymenu.max);
      this.$.pane.setMin(this.position.secondarymenu.min);
    } else {
      this.$.pane.setMax(this.position.menu.max);
      this.$.pane.setMin(this.position.menu.min);
    }

    // walk the chain to find a view
    var getView = enyo.bind(this, function(control) {
      if (control.view) {
        return control.view;
      }
      if ((control == this.$.menu) || (control == this.$.secondarymenu)) {
        return null;
      }
      return getView(control.parent);
    });

    var view = getView(inEvent.originator);

    // check to see if it is the same view or a different view
    if (view) {
      if (this.getView() == view) {
        this.$.pane["animateTo"  + (inSender.name == "secondarymenu" ? "Max" : "Min")]();
        // dont need to set view
      } else {
        this.animateToView(view, inSender.name);
      }
    }
  },

  viewChanged: function(oldView) {
    var newView = this.getView();
    // this.log("viewChanged to: "+ newView);
    this.selectView(newView);
    switch(newView.toLowerCase()) {
      case "analytics":
        enyo.Signals.send('updateAnalytics');
      break;
    }
  },

  paneAnimateFinishHandler: function(inSender) {
    var docWidth = document.body.clientWidth;
    var value = inSender.getValue();

    if (Math.abs(value) == docWidth) {

      // swap views only when they're off the side
      if (this.toview) {
        this.setView(this.toview);
        this.toview = null;
      }
      setTimeout(enyo.bind(this, function() {
        this.$.pane.$.animator.setDuration(250);
        (value < 0) ? inSender.animateToMax() : inSender.animateToMin();
      }), 1);

    } else {
      // fire events
      if (this.$.menu.getShowing()) {
        if (inSender.getValue() == this.position.menu.max) {
          this.doMenuOpen();
        } else {
          this.doMenuClose();
          this.reflowViews();
        }
      } else {
        if (inSender.getValue() == this.position.secondarymenu.min) {
          this.doSecondaryMenuOpen();
        } else {
          this.doSecondaryMenuClose();
        }
      }

    }
  },

  addMsgNotification: function(title, message) {
    this.$.toolbar.generateStatusNotification(title, message);
  },
});