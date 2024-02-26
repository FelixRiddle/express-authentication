/**
 * Get server url either on the frontend or backend
 * 
 * @param {*} serverUrl (Optional)
 */
function serverUrl(serverUrl) {
    if(!serverUrl) {
        // Location is not defined in nodejs
        const isUndefined = typeof(location) === 'undefined';
        
        if(!isUndefined) {
            return location.origin;
        } else if(!serverUrl) {
            // This is backend
            throw Error("Server url not given");
        }
    }
    
    // This is backend
    return serverUrl;
}

module.exports = serverUrl;
