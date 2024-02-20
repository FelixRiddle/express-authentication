const { constants } = require("node:buffer");
const path = require("node:path");
const fs = require("node:fs");

/**
 * User folder
 * 
 * Creates it if it doesn't exists.
 * TODO: The user folder should be created on registry but it's too much of a hassle rn
 * 
 * @param {string} userId User id
 * @returns 
 */
function userFolder(userId) {
    const userFolderPath = path.resolve(process.cwd(), `public/user/${userId}`);
    
    // Create user folder
    try {
        fs.accessSync(userFolderPath, constants.F_OK);
    } catch(err) {
        // The folder doesn't exists
        // Create folder
        fs.mkdirSync(userFolderPath);
    }
    
    // Create user property folder
    const userPropertyFolder = path.resolve(userFolderPath, `property`);
    try {
        fs.accessSync(userPropertyFolder, constants.F_OK);
    } catch(err) {
        // The folder doesn't exists
        // Create folder
        fs.mkdirSync(userPropertyFolder);
    }
    
    return userFolderPath;
}

/**
 * Create public user folder
 */
function createPublicUserFolder() {
    const userFolderPath = path.resolve(process.cwd(), 'public/user');
    
    // Create user folder
    try {
        fs.accessSync(userFolderPath, constants.F_OK);
    } catch(err) {
        // The folder doesn't exists
        // Create folder
        fs.mkdirSync(userFolderPath);
    }
}

/**
 * Relative user folder
 * 
 * Gets the relative user folder from public folder
 * 
 * Note: Express doesn't add the 'public' part to the uri
 * 
 * @param {string} userId User id
 */
function relativeUserFolder(userId) {
    return `public/user/${userId}`;
}

module.exports = {
    userFolder,
    createPublicUserFolder,
    relativeUserFolder
};
