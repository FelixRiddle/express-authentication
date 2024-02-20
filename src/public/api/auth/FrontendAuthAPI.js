const axios = require("axios");

const serverUrl = require("../../web/serverUrl");

module.exports = class AuthAPI {
    loggedIn = false;
    
    /**
     * User data
     * 
     * @param {Object} userData User data
     * @param {string} url The server url
     */
    constructor(userData, url) {
        this.userData = userData;
        this.serverUrl = serverUrl(url);
        
        this.setInstance(this.serverUrl);
    }
    
    // --- For easier setup ---
    /**
     * Create and log in, but with custom user data
     * 
     * @param {object} userData User data
     */
    static async createAndLoginCustomUserData(userData) {
        // I don't think using the environment variables works in the frontend
        const url = serverUrl();
        
        // Setup user
        const api = new AuthAPI(userData, url);
        await api.setupLoggedInInstance();
        
        return api;
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
    
    /**
     * Register user
     */
    async registerUser() {
        const res = await this.instance.post("/auth/register", this.userData)
            .then((res) => res)
            .catch((err) => {
                console.error(err);
                return;
            });
        
        return res.data;
    }
    
    /**
     * Login user
     * 
     * It's not very helpful, because I can't access protected endpoints with the axios instance.
     */
    async loginUser() {
        const res = await this.instance.post("/auth/login", {
            email: this.userData.email,
            password: this.userData.password,
        })
            .then((res) => res)
            .catch((err) => {
                console.error(err);
                return;
            });
        
        return res.data;
    }
    
    /**
     * Login get jwt
     * 
     * Use to login and get the jwt token directly
     */
    async loginGetJwt() {
        const res = await this.instance.post('/auth/login_get_jwt', {
            email: this.userData.email,
            password: this.userData.password,
        })
            .then((res) => res)
            .catch((err) => {
                console.log(`Couldn't get JWT token`);
                console.error(err);
                return;
            });
        
        // Update instance
        this.setInstance(this.serverUrl, res.data.token);
        
        this.loggedIn = true;
        
        return res.data;
    }
    
    /**
     * Delete user
     */
    async deleteUser() {
        const res = await this.instance.post("/user/delete", this.userData)
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
        const res = await this.instance.post("/user/password/reset", {
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
        const res = await this.instance.post(`/user/password/create/${token}`, {
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
