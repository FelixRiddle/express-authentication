const axios = require("axios");

const { serverUrl } = require("../env.js");
const LocalStorage = require("./LocalStorage.js");

/**
 * Reset password private key management
 */
module.exports = class ResetPasswordPrivateKey extends LocalStorage {
    /**
     * Reset password private key management
     */
    constructor() {
        super("KEY_RESET_PASSWORD", ResetPasswordPrivateKey.defaultFilePath());
    }
    
    /**
     * Default file path
     */
    static defaultFilePath() {
        return "./.cache/routes/auth/resetPasswordPrivateKey.json";
    }
    
    /**
     * Confirm an email
     * 
     * @param {string} email User email
     */
    async confirmEmail(email) {
        const instance = axios.create({
            baseURL: `${serverUrl()}/auth`,
            timeout: 2000,
            headers: {
                "Content-Type": "application/json"
            }
        });
        const data = {
            key: this.loadLocally(),
            email,
        };
        
        const res = await instance.post("/email", data)
            .then((res) => res)
            .catch((err) => { });
        
        return res.data;
    }
}
