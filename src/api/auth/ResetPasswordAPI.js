const axios = require("axios");

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
     * Start reset password process
     */
    async resetPassword() {
        const res = await this.instance.post("/auth/password/reset", {
            email: this.userData.email,
        })
            .then((res) => res.data)
            .catch(err => {
                // console.error(err);
            });
        
        return res;
    }
    
    /**
     * Create new password
     * 
     * Next event after a reset was issued.
     * 
     * We will use backdoor access here, because traversing html and reading emails is too much of a hassle.
     * 
     * @param {string} key Backdoor access key
     */
    async createWithKey(key) {
        const res = await this.instance.post("/auth/password/create_with_key", {
            ...this.userData,
            key
        })
            .then((res) => res.data)
            .catch(err => {
                // console.error(err);
            });
        
        return res;
    }
}
