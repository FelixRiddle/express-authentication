import dotenv from "dotenv";

import { setupAll } from "./controllers/env/setDefaultEnvVariables.js";
import { testSetup } from "./src/test/testSetup.js";
import executeCommands from "./cmd/index.js";

dotenv.config({
    path: ".env"
});

// Run server
(async () => {
    // Set environment variables
    setupAll();
    
    // Create folders
    testSetup();
    
    // Run given commands
    await executeCommands();
})();
