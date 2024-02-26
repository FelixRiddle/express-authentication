const AuthAPI = require('../auth/AuthAPI');

/**
 * User API
 * 
 * To handle protected endpoints
 */
module.exports = class UserAPI {
    constructor(debug=false) {
        this.debug = debug;
    }
    
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
