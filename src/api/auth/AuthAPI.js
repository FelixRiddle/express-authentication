const axios = require("axios");
const generator = require("generate-password");

const confirmUserEmailWithPrivateKey = require("../../email/confirmUserEmailWithPrivateKey");
const serverUrl = require("../../public/web/serverUrl");
const { envServerUrl } = require("../../controllers/env/env");

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
     * Create and log in, but with custom user data
     * 
     * @param {object} userData User data
     */
    static async createAndLoginCustomUserData(userData) {
        // I don't think using the environment variables works in the frontend
        const url = serverUrl(envServerUrl());
        
        // Setup user
        const api = new AuthAPI(userData, url);
        await api.setupLoggedInInstance();
        
        return api;
    }
    
    /**
     * Create logged in axios instance
     * 
     * Create user, confirm email, login and get axios instance
     * 
     * @param {boolean} [debug=false] Debug data
     * @returns {AxiosInstance} Axios instance
     */
    async createLoginGetInstance(debug = false) {
        const registerRes = await this.registerUser();
        if(debug) {
            console.log(`Register res: `, registerRes);
        }
        
        // Confirm user email
        const confirmRes = await confirmUserEmailWithPrivateKey(this.userData.email);
        if(debug) {
            console.log(`Confirm email res: `, confirmRes);
        }
        
        // Login user to be able to delete it
        const loginRes = await this.loginGetJwt();
        if(debug) {
            console.log(`Login res: `, loginRes);
            console.log(`Is user logged in?: ${this.loggedIn}`);
        }
        
        return this.instance;
    }
    
    /**
     * Alias
     */
    async setupLoggedInInstance() {
        return this.createLoginGetInstance();
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
        
        const res = await this.instance.post(endpoint, {
            email: this.userData.email,
            password: this.userData.password,
        })
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
    
    /**
     * Delete user
     */
    async deleteUser() {
        const endpoint = "/user/delete";
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
    
    // --- Email ---
    /**
     * Send email to reset password
     * 
     * The reset password process can't be done without this step, to ensure the user and
     * email exists and the user owns that email.
     */
    async enableResetPassword() {
        const endpoint = "/user/password/reset";
        if(this.debug) {
            const fullUrl = `${this.serverUrl}${endpoint}`;
            console.log(`Complete url: ${fullUrl}`);
        }
        
        const res = await this.instance.post(endpoint, {
            email: this.userData.email,
        })
            .then((res) => res.data)
            .catch((err) => {
                console.error(err);
                return;
            });
        
        return res;
    }
    
    /**
     * Create new passsword
     * 
     * Second step of resetting password, with this step the user sets the new password.
     * 
     * @param {string} token Token to reset the password
     * @param {string} password 
     * @param {string} confirmPassword 
     */
    async createNewPassword(token, password, confirmPassword) {
        const endpoint = `/user/password/create/${token}`;
        if(this.debug) {
            const fullUrl = `${this.serverUrl}${endpoint}`;
            console.log(`Complete url: ${fullUrl}`);
        }
        
        const res = await this.instance.post(endpoint, {
            password,
            confirmPassword
        })
            .then((res) => res.data)
            .catch((err) => {
                console.error(err);
                return;
            });
        
        return res;
    }
}
