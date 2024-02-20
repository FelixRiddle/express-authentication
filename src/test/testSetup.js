const { fs } = require("node:fs");

/**
 * Create route folders
 */
function createRouteFolders() {
    // Create folder routes
    try {
        fs.mkdirSync(".cache/routes");
    } catch(err) {
        // Folder exists
    }
    
    // Create folder auth
    try {
        fs.mkdirSync(".cache/routes/auth");
    } catch(err) {
        // Folder exists
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
    }
}

/**
 * Perform both actions
 */
function testSetup() {
    createDotCache();
    createRouteFolders();
}

/**
 * Setup environment for testing
 */
module.exports = testSetup;
