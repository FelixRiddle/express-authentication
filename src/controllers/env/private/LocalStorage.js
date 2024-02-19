import fs from "node:fs";
import generator from "generate-password";

export class LocalStorage {
    /**
     * Inheritent classes will all call this for easier setup.
     * 
     * @param {string} envKeyName Environment key name
     * @param {string} filePath File path
     */
    constructor(envKeyName, filePath) {
        if(!envKeyName || !filePath) {
            throw Error("Local storage requires that all parameters are given");
        }
        
        this.envKeyName = envKeyName;
        this.filePath = filePath;
    }
    
    // --- Private key stored in the environment ---
    /**
     * Confirmation private key
     */
    privateKey() {
        return process.env[this.envKeyName];
    }
    
    /**
     * Set or change private key
     * 
     * For greater protection change this every time it's used hehe
     */
    setPrivateKey() {
        process.env[this.envKeyName] = generator.generate({
            length: 64,
            numbers: true,
        });
    }
    
    // --- Filesystem storage ---
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
            key: this.privateKey()
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
