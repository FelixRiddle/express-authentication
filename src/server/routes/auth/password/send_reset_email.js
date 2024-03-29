const { check, validationResult } = require("express-validator");
const express = require("express");
const { v4: uuidv4 } = require('uuid');

const { emailForgotPassword } = require("../../../../helpers/emails");
const { isEmailDisabled } = require("../../../../controllers/env/env");

const resetRouter = express.Router();

/**
 * Start unauthenticated password reset process
 * 
 * This is for a person that's not logged in, for a person that's is logged in, you don't even
 * need to send a confirmation email.
 * 
 * Steps:
 * 1) Validate email
 * 2) Validate user exists
 * 3) Send reset password email
 */
resetRouter.post("/send_reset_email", async (req, res) => {
    console.log(`POST /auth/password/send_reset_email`);
    
    try {
        // Validation
        await check("email")
            .isEmail()
            .withMessage("The 'email' is wrong")
            .run(req);
        
        let result = validationResult(req);
        
        // Confirm that the user is Ok
        if(!result.isEmpty()) {
            console.log(`Didn't pass validation`);
            return res.send({
                resetEmailSent: false,
                messages: [{
                    message: "Email is wrong!",
                    error: true,
                }]
            });
        }
        
        // Search for the user
        const { email } = req.body;
        const userModel = req.models.user();
        const user = await userModel.findOne({
            where: {
                email
            }
        });
        if(!user) {
            console.log(`User doesn't exists`);
            return res.send({
                resetEmailSent: false,
                messages: [{
                    message: "The user doesn't exist",
                    error: true,
                }]
            });
        }
        
        // Generate a token and send the id
        user.token = uuidv4();
        await user.save();
        
        // Send an email
        // Check if sending email is enabled or not
        // This is used for testing
        if(!isEmailDisabled()) {
            // Send confirmation email
            emailForgotPassword({
                name: user.name,
                email,
                token: user.token,
            });
        }
        
        return res.send({
            messages: [{
                message: "Email sent",
                error: false,
            }],
            resetEmailSent: true,
        });
    } catch(err) {
        console.error(err);
        return res.send({
            resetEmailSent: false,
            messages: [{
                message: "Unknown error",
                error: true,
            }]
        });
    }
});

module.exports = resetRouter;
