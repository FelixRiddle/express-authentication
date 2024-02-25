const axios = require("axios");

const { BackendServerAccessAPI } = require("backdoor-server-access");

const AuthAPI = require('../AuthAPI');

/**
 * Non authenticated reset password API
 */
module.exports = class ResetPasswordAPI {
    /**
     * 
     * @param {object} userData User data
     */
    constructor(userData, url) {
        this.userData = userData;
        
        // Headers
        let headers = {
            "Content-Type": "application/json"
        };
        this.instance = axios.create({
            withCredentials: true,
            baseURL: url,
            timeout: 2000,
            headers,
        });
    }
    
    /**
     * Set backdoor server url
     */
    setBackdoorServerUrl(url) {
        this.backdoorServerUrl = url;
    }
    
    /**
     * Set axios instance
     */
    setAxiosInstance(instance) {
        this.instance = instance;
    }
    
    /**
     * From auth api
     * 
     * @param {AuthAPI} authAPI 
     */
    static fromAuthenticatedAPI(authAPI) {
        const resetAPI = new ResetPasswordAPI(authAPI.userData, authAPI.serverUrl);
        
        // Set the authenticated instance
        resetAPI.setAxiosInstance(authAPI.instance);
        
        return resetAPI;
    }
    
    /**
     * Start reset password process
     * 
     * By sending reset email
     */
    async sendResetEmail() {
        const res = await this.instance.post("/auth/password/send_reset_email", {
            email: this.userData.email,
        })
            .then((res) => res)
            .catch(err => {
                console.error(err);
            });
        
        return res.data;
    }
    
    /**
     * Create new password
     * 
     * Next event after a reset was issued.
     * 
     * We will use backdoor access here, because traversing html and reading emails is too much of a hassle.
     */
    async createWithKey() {
        
        if(!this.backdoorServerUrl) {
            throw Error("Backdoor server url not given");
        }
        
        // Create and set the url
        const backdoorApi = new BackendServerAccessAPI();
        backdoorApi.setUrl(this.backdoorServerUrl);
        
        // Get backdoor key
        const key = await backdoorApi.createPasswordKey();
        
        const res = await this.instance.post("/auth/password/create_with_key", {
            ...this.userData,
            key
        })
            .then((res) => res)
            .catch(err => {
                console.error(err);
            });
        
        return res.data;
    }
}
