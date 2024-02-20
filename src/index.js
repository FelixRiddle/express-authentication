const { setupAll } = require("./controllers/env/setDefaultEnvVariables");

// Set environment variables
// Run it first so sequelize doesn't throw an error
setupAll();

const testSetup = require("./test/testSetup");
const executeCommands = require("./cmd/index");

// Run server
(async () => {
    // Create folders
    testSetup();
    
    // Run given commands
    await executeCommands();
})();
