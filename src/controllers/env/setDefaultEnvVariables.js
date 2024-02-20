const dotenv = require('dotenv');

/**
 * Setup protocol
 */
function setupProtocol() {
    if(!process.env.SERVER_PROTOCOL) {
        process.env["SERVER_PROTOCOL"] = 'https';
    }
}

/**
 * Setup environment variables
 */
function setupAll() {
    
    // Setup dotenv
    dotenv.config({
        path: ".env"
    });
    
    const DB_PASSWORD = process.env.DB_PASSWORD;
    
    setupProtocol();
}

module.exports = {
    setupAll,
    setupProtocol,
};
