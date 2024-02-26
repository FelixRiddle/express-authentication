const AuthAPI = require("./api/auth/AuthAPI");
const { envServerUrlOrDefault } = require("./controllers/env/env");
const UserAPI = require("./api/secure/UserAPI");

/**
 * Attempt to generalize app functions
 */
module.exports = class ExpressAuthentication {
    constructor() {
        // Default this url to the environment variable
        this.url = this.getUrl();
    }
    
    /**
     * Get url
     */
    getUrl() {
        // If it doesn't exists, then we will use this authentication default
        let url = envServerUrlOrDefault();
        
        const authUrl = process.env.AUTH_URL;
        if(authUrl) {
            url = authUrl;
        }
        
        return url;
    }
    
    /**
     * The frontend uses '/auth2' as a base of the authentication api
     */
    setBaseUrl(url) {
        this.url = url;
        
        return this;
    }
    
    // --- Conversions ---
    /**
     * Create auth api
     * 
     * @param {Object} userData 
     */
    authApi(userData) {
        const api = new AuthAPI(userData, this.url);
        
        return api;
    }
    
    /**
     * Go straight to user api
     * 
     * TODO:
     * Behavior
     * 1) Should check if the user exist then login
     * 2) If the user doesn't exist, should create and login
     * However I don't need this right now, or do I?
     * Would remove unnecesary lines from code
     * 
     * @param {Object} userData User data 
     */
    userApi(userData) {
        throw Error("Conversion to 'UserAPI' not implemented");
    }
}
