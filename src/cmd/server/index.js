const { Server } = require("felixriddle.risotto");

const routes = require("../../server/routes/index");
const ExpressAuthenticationServer = require("../../server/Server");

/**
 * Start the server
 */
async function risottoServe() {
    const server = new Server('express-authentication');
    await server
        .mountRoutes(routes)
        .startClusterServer();
}

/**
 * Start clustered server
 */
async function startServer() {
    const server = new ExpressAuthenticationServer();
    await server
        .mountRoutes(routes)
        .startClusterServer();
}

/**
 * Main function
 */ 
async function serverMain(args) {
    // Seed categories
    if(args.serve) {
        // Start server
        await startServer();
    }
    
    return args;
}

module.exports = serverMain;
