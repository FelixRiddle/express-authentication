const AuthAPI = require('../auth/AuthAPI');
const { AUTHENTICATION } = require("../../mappings/env/SERVER_URL_MAPPINGS");
const createAxiosInstance = require("../../public/axios/createAxiosInstance");

/**
 * User API
 * 
 * To handle protected endpoints
 */
module.exports = class UserAPI {
    constructor(debug=false) {
        this.debug = debug;
    }
    
    // --- Constructors ---
    // Other kind of constructors that I see more suitable than the main
    /**
     * 
     * @param {AuthAPI} authApi 
     */
    static fromAuthenticatedAPI(authApi, debug=false) {
        const api = new UserAPI(debug);
        api.serverUrl = authApi.serverUrl;
        api.instance = authApi.instance;
        api.userData = authApi.userData;
        
        return api;
    }
    
    /**
     * Create UserAPI instance from a jwt token
     * 
     */
    static async fromJWT(token, debug=false) {
        const api = new UserAPI(debug);
        
        // Url
        const url = AUTHENTICATION;
        api.serverUrl = url;
        
        // Create instance
        api.instance = createAxiosInstance(url, "", token);
        
        // Get data
        const userDataRes = await api.data();
        api.userData = userDataRes.user;
        
        return api;
    }
    
    // --- User data ---
    /**
     * Get user data
     */
    async data() {
        const endpoint = "/user/data";
        if(this.debug) {
            const fullUrl = `${this.serverUrl}${endpoint}`;
            console.log(`Complete url: ${fullUrl}`);
        }
        
        const res = await this.instance.get(endpoint)
            .then((res) => res)
            .catch((err) => {
                console.error(err);
                return;
            });
        
        return res.data;
    }
    
    // --- User operations ---
    /**
     * Delete user
     */
    async delete() {
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
