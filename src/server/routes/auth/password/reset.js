import { check, validationResult } from "express-validator";
import express from "express";

import { emailForgotPassword } from "../../../helpers/emails.js";
import { generateId } from "../../../helpers/tokens.js";
import User from "../../../models/User.js";
import expand from "../../../controllers/expand.js";
import { isEmailDisabled } from "../../../controllers/env/env.js";

const resetRouter = express.Router();


// Forgot password
resetRouter.get("/reset", async (req, res) => {
    let expanded = expand(req);
    return res.render(`${expanded.websiteInfo.baseUrl}/user/auth/password/reset`, {
        page: "Reset your password",
    });
});

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
resetRouter.post("/reset", async (req, res) => {
    console.log(`POST /auth/password/reset`);
    
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
        const user = await User.findOne({
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
        user.token = generateId();
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
            console.log(`Send confirmation email.`);
        } else {
            console.log(`Do not send confirmation email.`);
        }
        
        // TODO: Show confirmation message
        return res.send({
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

export default resetRouter;
