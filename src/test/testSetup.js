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
 * Setup environment for testing
 */
module.exports = function testSetup() {
    createDotCache();
    createRouteFolders();
}
