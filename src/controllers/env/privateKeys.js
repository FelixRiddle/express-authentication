import generator from "generate-password";

/**
 * Email confirmation private key
 */
function emailConfirmationPrivateKey() {
    return process.env["KEY_EMAIL_CONFIRMATION"];
}

/**
 * Set or change confirmation email private key
 * 
 * For greater protection change this every time it's used hehe
 */
function setConfirmationEmailPrivateKey() {
    process.env["KEY_EMAIL_CONFIRMATION"] = generator.generate({
        length: 64,
        numbers: true,
    });
}

export {
    emailConfirmationPrivateKey,
    setConfirmationEmailPrivateKey
};
