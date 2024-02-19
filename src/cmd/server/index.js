const { isEmailDisabled, serverUrl } = require("../../controllers/env/env");
const Server = require('../../server/Server');

/**
 * Start the server
 */
function startServer() {
    
    console.log(`Server url: ${serverUrl()}`);
    console.log(`Is email disabled?: `, isEmailDisabled());
    
    let server = new Server();
    
    // Setup middleware, mount routes
    server.setup();
    
    // Serve
    server.serve();
}

/**
 * Main function
 */ 
async function serverMain(args) {
    // Seed categories
    if(args.serve) {
        // Start server
        startServer();
    }
    
    return args;
}

export default serverMain;
