enyo.depends(
    // Layout library
    "$lib/layout",
    // Onyx UI library
    "$lib/onyx", // To theme Onyx using Theme.less, change this line to $lib/onyx/source,
    //"Theme.less",	// uncomment this line, and follow the steps described in Theme.less
    // CSS/LESS style files
    // "$lib/spotlight",
    // "$lib/moonstone",
    "style",
    //External Libraries
    "external",
    // Model and data definitions
    "data",
    // Controls used in views
    "controls",
    // View kind definitions
    "views",
    // Include our default entry point
    "app.js"
);
