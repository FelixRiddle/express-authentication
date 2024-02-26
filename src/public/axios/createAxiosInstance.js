const axios = require('axios');

/**
 * Create headers
 * 
 * @returns {Object} 
 */
function createHeaders(jwtToken = "") {
    let headers = {
        "Content-Type": "application/json"
    };
    if(jwtToken) {
        // Add jwt token
        headers["Cookie"] = `_token=${jwtToken}`;
    }
    
    return headers;
}

/**
 * Create server url and endpoint
 * 
 * @param {*} url 
 * @param {*} endpoint 
 */
function createServerUrlAndEndpoint(url, endpoint = "") {
    // Get full app url
    return endpoint ? `${url}/${endpoint}` : url;
}

/**
 * If one of two urls exist, this will not throw an error, otherwise it will.
 */
function validateUrlCanBeFetched(serverUrl = '') {
    // First there are some checks to be performed
    // Location is not defined in nodejs
    const isUndefined = typeof(location) === 'undefined';
    
    if(!serverUrl && isUndefined) {
        throw Error("Server url is required when the AuthenticationAPI is used in NodeJS");
    }
}

/**
 * Create axios instance on the frontend or backend
 * 
 * @param {string} url (Optional on the frontend)
 * @param {string} endpoint (Optional)
 * @param {string} jwtToken (Optional)
 */
module.exports = function createAxiosInstance(serverUrl = "", endpoint = "", jwtToken = '') {
    // Validate urls
    validateUrlCanBeFetched(serverUrl);
    
    // Get base url
    const actualServerUrl = serverUrl ? serverUrl : location.origin;
    const baseUrl = createServerUrlAndEndpoint(actualServerUrl, endpoint);
    
    // Headers
    const headers = createHeaders(jwtToken);
    
    const instance = axios.create({
        withCredentials: true,
        baseURL: baseUrl,
        timeout: 2000,
        headers,
    });
    
    return instance;
}