import axios from "axios";
import fs from "node:fs";
import generator from "generate-password";

import { serverUrl } from "../env.js";

export default class ConfirmationEmailPrivateKey {
    constructor() {
        // Use the default file path
        this.filePath = this.defaultFilePath();
    }
    
    /**
     * Email confirmation private key
     */
    emailConfirmationPrivateKey() {
        return process.env["KEY_EMAIL_CONFIRMATION"];
    }
    
    /**
     * Set or change confirmation email private key
     * 
     * For greater protection change this every time it's used hehe
     */
    setConfirmationEmailPrivateKey() {
        process.env["KEY_EMAIL_CONFIRMATION"] = generator.generate({
            length: 64,
            numbers: true,
        });
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
    
    // --- Save and retrieve ---
    /**
     * Default file path
     */
    defaultFilePath() {
        return "./.cache/routes/auth/confirmationEmailPrivateKey.json";
    }
    
    /**
     * Set file path and name
     */
    setFilePath(filePath) {
        this.filePath = filePath;
    }
    
    /**
     * Store locally as json
     */
    saveLocally() {
        const data = {
            key: this.emailConfirmationPrivateKey()
        };
        
        fs.writeFileSync(this.filePath, JSON.stringify(data));
    }
    
    /**
     * Load locally
     * 
     * @returns {string} The private key
     */
    loadLocally() {
        const data = fs.readFileSync(this.filePath);
        return JSON.parse(data).key;
    }
    
    /**
     * Check if a file exists
     * 
     * @returns {bool} Whether the file exists or not
     */
    fileExists() {
        return fs.existsSync(this.filePath);
    }
}
