import Server from "./src/Server.js";

import { isEmailDisabled, serverUrl } from "./src/controllers/env/env.js";
import { setupAll } from "./src/controllers/env/setDefaultEnvVariables.js";
import { testSetup } from "./src/test/testSetup.js";

// Run server
(async () => {
    
    testSetup();
    
    // Set environment variables
    setupAll();
    
    console.log(`Server url: ${serverUrl()}`);
    console.log(`Is email disabled?: `, isEmailDisabled());
    
    let server = new Server();
    
    // Setup middleware, mount routes
    server.setup();
    
    // Serve
    server.serve();
})();
