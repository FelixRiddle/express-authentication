/**
 * Take variables from the environment and get the server url
 * 
 * @returns {string} The serve url(or origin)
 */
export function serverUrl() {
    if(!process.env.SERVER_PORT) {
        // When the website is on production, it's unnecessary to give the port
        return `${process.env.SERVER_PROTOCOL}://${process.env.SERVER_HOST}`;
    }
    
    // Mostly for development it's necessary to have a specific port
    // Nevertheless, it could also be production too.
    return `${process.env.SERVER_PROTOCOL}://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}`;
}

/**
 * Check if email is disabled
 * 
 * That is the application will not send any email.
 * 
 * @returns {bool}
 */
export function isEmailDisabled() {
    return !process.env.DISABLE_EMAIL || process.env.DISABLE_EMAIL.toLowerCase() === "false";
}
