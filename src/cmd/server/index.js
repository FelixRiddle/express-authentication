const { isEmailDisabled, envServerUrl } = require("../../controllers/env/env");
const Server = require('../../server/Server.cjs');
const clusterServer = require("./clusterServer");

/**
 * Start the server
 */
async function startServer() {
    
    console.log(`Server url: ${envServerUrl()}`);
    console.log(`Is email disabled?: `, isEmailDisabled());
    
    let server = new Server();
    
    // Setup middleware, mount routes
    server.setup();
    
    // Serve
    await server.serve();
}

/**
 * Main function
 */ 
async function serverMain(args) {
    // Seed categories
    if(args.serve) {
        // Start server
        // await startServer();
        
        // Cluster server
        await clusterServer();
    }
    
    return args;
}

module.exports = serverMain;
