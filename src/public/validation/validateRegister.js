const { Validator } = require("felixriddle.checkpoint");

/**
 * Validate user register
 * 
 * @param {Object} user The user
 * @returns {Array} Array of errors
 */
function validateRegister(user) {
    let passScope = "password";
    let val = new Validator()
        .createScope("name", "name", user.name)
            .isNotFalsy()
            .lengthRange(3, 128)
            .isStr()
        .createScope("email", "email", user.email)
            .isNotFalsy()
            .lengthRange(4, 128)
            .isEmail()
            .isStr()
        .createScope(passScope, "password", user.password)
            .isNotFalsy()
            .lengthRange(8, 64)
            .isStr()
        .useScope(passScope, "confirmPassword", user.confirmPassword);
    
    // Validate data
    return val.validate();
}

module.exports = validateRegister;
