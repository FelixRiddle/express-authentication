const { setupAll } = require("./controllers/env/setDefaultEnvVariables");
const testSetup = require("./test/testSetup");
const executeCommands = require("./cmd/index");

// Run server
(async () => {
    // Set environment variables
    setupAll();
    
    // Create folders
    testSetup();
    
    // Run given commands
    await executeCommands();
})();
