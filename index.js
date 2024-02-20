const { setupAll } = require("./src/controllers/env/setDefaultEnvVariables");

// Set environment variables
// Run it first so sequelize doesn't throw an error
setupAll();

const testSetup = require("./src/test/testSetup");
const executeCommands = require("./src/cmd/index");
const { libUserRouter } = require("./src/server/routes");

// Run server
(async () => {
    // Create folders
    testSetup();
    
    // Run given commands
    await executeCommands();
})();

// The default export are the libraries
module.exports = libUserRouter;
