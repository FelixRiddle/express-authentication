import dotenv from "dotenv";

/**
 * Setup protocol
 */
export function setupProtocol() {
    if(!process.env.SERVER_PROTOCOL) {
        process.env["SERVER_PROTOCOL"] = 'https';
    }
}

/**
 * Setup environment variables
 */
export function setupAll() {
    
    // Setup dotenv
    dotenv.config({
        path: ".env"
    });
    
    setupProtocol();
}

