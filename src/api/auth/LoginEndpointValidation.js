const { check, validationResult } = require("express-validator");

/**
 * A whole class for easier handling of the login validation
 */
module.exports = class LoginEndpointValidation {
    errors = [];
    
    /**
     * 
     * @param {object} req Express request object
     */
    constructor(req) {
        this.req = req;
        this.userData = req.body;
    }
    
    /**
     * Generate response object
     * 
     * @returns 
     */
    responseObject() {
        if(this.errors.length > 0) {
            return {
                messages: this.errors,
                loggedIn: false,
            };
        } else {
            return {
                loggedIn: true,
                messages: [{
                    error: false,
                    message: "User logged in"
                }],
            };
        }
    }
    
    /**
     * Get user without sensitive fields
     * 
     * @returns {object} User object
     */
    getUserSafe() {
        // Remove the password from the user object
        const userSafe = {
            ...this.user.dataValues,
            // Remove sensitive stuff
            password: "",
        };
        return userSafe;
    }
    
    /**
     * Check if there are errors
     * 
     * @returns {bool} Are there errors
     */
    isError() {
        return this.errors.length > 0;
    }
    
    /**
     * Validate data given
     */
    async loginValidateData() {
        // Validation
        await check("password")
            .notEmpty()
            .withMessage("The password is required")
            .run(this.req);
        await check("email")
            .isEmail()
            .withMessage("The email is wrong")
            .run(this.req);
        
        // Check result
        let result = validationResult(this.req);
        
        // Confirm that the user is Ok
        if(!result.isEmpty()) {
            console.log(`The user didn't pass validation`);
            
            // Append errors
            this.errors.push.apply(result.array);
        }
    }
    
    /**
     * Validate user
     * 
     * @returns {bool} True if the user was validated
     */
    async validateUser() {
        // Get user data
        const { email, password } = this.userData;
        
        // Get the user
        const userModel = this.req.models.user();
        let user = await userModel.findOne({
            where: {
                email,
            }
        });
        this.user = user;
        
        // Check if user exists
        if(!user) {
            console.log(`The user doesn't exists`);
            this.errors.push({
                // Don't tell the user it's the email
                message: "Email or password is wrong.",
                error: true,
            });
            return false;
        }
        
        // Check that the user is verified
        if(!user.confirmedEmail) {
            console.log(`The user hasn't confirmed the email`);
            this.errors.push({
                message: "The E-Mail is not verified, if you are the owner, please go to your inbox and verify it.",
                error: true,
            });
            return false;
        }
        
        // Check if passwords match
        if(!user.verifyPassword(password)) {
            console.log(`The password is incorrect`);
            this.errors.push({
                message: "Email or password is wrong.",
                error: true,
            });
            return false;
        }
        
        return true;
    }
    
    /**
     * Validate data given
     */
    async loginValidation() {
        // Validate data
        await this.loginValidateData();
        
        // If there are errors, don't make unnecessary requests to the database and return now
        if(this.isError()) {
            return this.responseObject();
        }
        
        // Validate user
        await this.validateUser();
        
        // Whether it's okay or not this will return the correct answer
        return this.responseObject();
    }
}
