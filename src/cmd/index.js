const { ArgumentParser } = require("argparse");

const serverMain = require("./server/index");

const parser = new ArgumentParser({
    description: "Argparse example"
});

// Create arguments
// --- Database ---
// --- Seeders ---
// Data for testing
parser.add_argument("--seed-users", {
    help: "Insert users into the database",
    action: "store_true"
});

// --- Tables ---
parser.add_argument("--up-all", {
    help: "Create every project table",
    action: "store_true"
});

parser.add_argument("--down-all", {
    help: "Drop every table",
    action: "store_true"
});

parser.add_argument("--reset-tables", {
    help: "Destroy and create the tables again with the default data",
    action: "store_true"
});

// --- Server ---
parser.add_argument("--serve", {
    help: "Start the server",
    action: "store_true"
})

// --- Testing ---
parser.add_argument("--test-register", {
    help: "Test the register route",
    action: "store_true"
});

// Parse arguments
let args = parser.parse_args();

/**
 * Execute commands
 */
module.exports = async function executeCommands() {
    
    await serverMain(args);
    
    // await testRegister(args);
    
    // process.exit(0);
};
