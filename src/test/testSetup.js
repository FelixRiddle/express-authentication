const fs = require("node:fs");

/**
 * Create route folders
 */
function createRouteFolders() {
    // Create folder routes
    try {
        fs.mkdirSync(".cache/routes");
    } catch(err) {
        // Folder exists
        if(err.code === "EEXIST") {
            // console.log(`It's the useless error`);
        } else {
            // This error is something else
            console.error(err);
        }
    }
    
    // Create folder auth
    try {
        fs.mkdirSync(".cache/routes/auth");
    } catch(err) {
        // Folder exists
        if(err.code === "EEXIST") {
            // console.log(`It's the useless error`);
        } else {
            // This error is something else
            console.error(err);
        }
    }
}

/**
 * Create dot cache
 */
function createDotCache() {
    // Create folder .cache
    try {
        fs.mkdirSync(".cache");
    } catch(err) {
        // Folder exists
        if(err.code === "EEXIST") {
            // console.log(`It's the useless error`);
        } else {
            // This error is something else
            console.error(err);
        }
    }
}

/**
 * Perform both actions
 */
function testSetup() {
    createDotCache();
    createRouteFolders();
    console.log("Route folders created!");
}

/**
 * Setup environment for testing
 */
module.exports = testSetup;
