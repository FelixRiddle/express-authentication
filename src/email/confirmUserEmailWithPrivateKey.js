const ConfirmationEmailPrivateKey = require("../controllers/env/private/ConfirmationEmailPrivateKey");

/**
 * Confirm user email through backdoor access
 * 
 * @param {string} email User email
 */
async function confirmUserEmailWithPrivateKey(email) {
    
    // Confirm E-mail
    // Get private access key to confirm the email
    const confirmEmail = new ConfirmationEmailPrivateKey();
    
    const res = await confirmEmail.confirmEmail(email);
    
    return res;
}

module.exports = confirmUserEmailWithPrivateKey;
