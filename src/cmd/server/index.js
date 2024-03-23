const Server = require("../../server/Server");
const routes = require("../../server/routes/index");

/**
 * Start the server
 */
async function startServer() {
    const server = new Server();
    await server.mountRoutes(routes)
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
