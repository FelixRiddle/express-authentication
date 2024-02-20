const fs = require("node:fs");

const NodeErrorHandler = require("../error/node_error_handler/NodeErrorHandler");

/**
 * Create dot cache
 */
function createDotCache() {
    // Create folder .cache
    fs.mkdirSync(".cache");
}

/**
 * Create route folders
 */
function createRouteFolders() {
    // Create folder routes
    fs.mkdirSync(".cache/routes");
}

function createAuthFolder() {
    // Create folder auth
    fs.mkdirSync(".cache/routes/auth");
}

/**
 * Perform both actions
 */
function testSetup() {
    const nodeErrHandler = new NodeErrorHandler();
    
    // .cache
    nodeErrHandler.setCb(createDotCache)
        .ignoreFileOrFolderAlreadyExists()
        .execute()
        // routes
        .setCb(createRouteFolders)
        .execute()
        // auth
        .setCb(createAuthFolder)
        .execute();
}

/**
 * Setup environment for testing
 */
module.exports = testSetup;
