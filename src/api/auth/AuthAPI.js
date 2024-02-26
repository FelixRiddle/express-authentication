const axios = require("axios");
const generator = require("generate-password");

const { BackendServerAccessAPI } = require("backdoor-server-access");

const serverUrl = require("../../public/web/serverUrl");

module.exports = class AuthAPI {
    loggedIn = false;
    
    /**
     * User data
     * 
     * @param {Object} userData User data
     * @param {string} url The server url
     * @param {boolean} [debug=false] Debug mode for this API
     */
    constructor(userData, url, debug=false) {
        this.userData = userData;
        this.debug = debug;
        
        // Set server url
        this.serverUrl = serverUrl(url);
        if(this.debug) {
            console.log(`Server url: ${this.debug}`);
        }
        
        this.setInstance(this.serverUrl);
    }
    
    // --- Miscellaneous ---
    /**
     * Endpoint scope
     * 
     * If the authentication(endpoints) are running at a given scope set this
     */
    setEndpointScope(authScope) {
        this.serverUrl = `${this.serverUrl}/${authScope}`;
        
        this.setInstance(this.serverUrl);
    }
    
    // --- For easier setup ---
    /**
     * Creates the class and logs in with a random user email to prevent collisions
     */
    static async createAndLogin(url) {
        // Setup user
        const extendEmail = generator.generate({
            length: 10,
            numbers: true
        });
        const email = `user_${extendEmail}@email.com`;
        const userData = {
            name: "Some name",
            email: email,
            password: "asd12345",
            confirmPassword: "asd12345"
        };
        const api = new AuthAPI(userData, url);
        await api.setupLoggedInInstance();
        
        return api;
    }
    
    /**
     * Create instance
     * 
     * @param {string} serverUrl The server url
     * @param {string} jwtToken JWT Authentication token(optional)
     */
    setInstance(serverUrl, jwtToken = '') {
        // Location is not defined in nodejs
        const isUndefined = typeof(location) === 'undefined';
        
        // Create headers
        let headers = {
            "Content-Type": "application/json"
        };
        if(jwtToken) {
            // Add jwt token
            headers["Cookie"] = `_token=${jwtToken}`;
        }
        
        if(!isUndefined) {
            this.instance = axios.create({
                withCredentials: true,
                baseURL: `${location.origin}`,
                timeout: 2000,
                headers,
            });
        } else if(!serverUrl) {
            throw Error("Server url is required when the AuthenticationAPI is used in NodeJS");
        } else {
            this.instance = axios.create({
                withCredentials: true,
                baseURL: `${serverUrl}`,
                timeout: 2000,
                headers,
            });
        }
    }
    
    // --- For testing ---
    /**
     * Confirm user email with private key
     */
    async confirmUserEmailWithPrivateKey() {
        // TODO: Available on the same server
        const backdoorServerUrl = process.env.BACKDOOR_SERVER_ACCESS_URL;
        if(!backdoorServerUrl) throw Error("You have to set 'BACKDOOR_SERVER_ACCESS_URL'");
        
        const api = new BackendServerAccessAPI();
        api.setUrl(backdoorServerUrl);
        const key = await api.emailConfirmationKey();
        
        const res = await this.instance.post("/auth/email", { key, ...this.userData })
            .then((res) => res)
            .catch(err => {
                console.error(err);
            });
        
        return res.data;
    }
    
    // --- Operations ---
    /**
     * Register user
     */
    async registerUser() {
        const endpoint = "/auth/register";
        if(this.debug) {
            const fullUrl = `${this.serverUrl}${endpoint}`;
            console.log(`Complete url: ${fullUrl}`);
        }
        
        const res = await this.instance.post(endpoint, this.userData)
            .then((res) => res)
            .catch((err) => {
                console.error(err);
                return;
            });
        
        return res.data;
    }
    
    // --- Login ---
    /**
     * Update logged in
     * 
     * @param {Object} res Axios response object
     */
    updateLoggedIn(res) {
        this.setInstance(this.serverUrl, res.data.token);
        
        this.loggedIn = true;
    }
    
    /**
     * Login user
     * 
     * It's not very helpful, because I can't access protected endpoints with the axios instance.
     */
    async loginUser() {
        const endpoint = "/auth/login";
        if(this.debug) {
            const fullUrl = `${this.serverUrl}${endpoint}`;
            console.log(`Complete url: ${fullUrl}`);
        }
        
        const res = await this.instance.post(endpoint, this.userData)
            .then((res) => res)
            .catch((err) => {
                console.error(err);
                return;
            });
        
        // Update logged in status
        this.updateLoggedIn(res);
        
        return res.data;
    }
    
    /**
     * Login get jwt
     * 
     * Use to login and get the jwt token directly
     */
    async loginGetJwt() {
        const endpoint = "/auth/login_get_jwt";
        if(this.debug) {
            const fullUrl = `${this.serverUrl}${endpoint}`;
            console.log(`Complete url: ${fullUrl}`);
        }
        
        const res = await this.instance.post(endpoint, this.userData)
            .then((res) => res)
            .catch((err) => {
                console.log(`Couldn't get JWT token`);
                console.error(err);
                return;
            });
        
        // Update logged in status
        this.updateLoggedIn(res);
        
        return res.data;
    }
}
