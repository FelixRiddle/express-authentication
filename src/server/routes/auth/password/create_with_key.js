import { check, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import express from "express";

import User from "../../../models/User.js";
import ResetPasswordPrivateKey from "../../../controllers/env/private/ResetPasswordPrivateKey.js";

const createWithKeyRouter = express.Router();

/**
 * Create through backdoor access
 * 
 * Requires data:
 * @param {string} key Private key to perform actions
 * @param {string} email User email to perform action on
 * @param {string} password New password
 * @param {string} confirmPassword Confirm password
 */
createWithKeyRouter.post("/create_with_key", async (req, res) => {
    console.log(`POST /auth/password/create_with_key`);
    
    try {
        // Get things
        // Allocate 'key' with variable name 'privateKey'
        const { key: privateKey, email } = req.body;
        
        if(!privateKey) {
            console.log(`Private access key not given`);
            return res.send({
                updated: false,
            });
        }
        
        // Fetch key from the json file
        const privKeyManager = new ResetPasswordPrivateKey();
        const key = privKeyManager.loadLocally();
        
        // Check that it matches
        const keysMatch = privateKey === key;
        if(!keysMatch) {
            console.log(`Keys don't match`);
            return res.send({
                updated: false,
            });
        }
        
        // Validate password
        await check("password")
            .isLength({ min: 8 })
            .withMessage("The password is too short")
            .run(req);
        // Check that it's not bigger than 64
        await check("password")
            .isLength({ max: 64 })
            .withMessage("The password can't be bigger than 64 characters")
            .run(req);
        
        // The same for confirm password
        await check("confirmPassword")
            .isLength({ min: 8 })
            .withMessage("The password is too short")
            .run(req);
        // Check that it's not bigger than 64
        await check("confirmPassword")
            .isLength({ max: 64 })
            .withMessage("The password can't be bigger than 64 characters")
            .run(req);
        
        // Check if tests passed
        const result = validationResult(req);
        if(!result.isEmpty()) {
            console.log(`Validation didn't pass`);
            return res.send({
                messages: result.array(),
                updated: false,
            });
        }
        
        // Check that passwords match
        if(req.body.password != req.body.confirmPassword) {
            console.log(`Passwords don't match`);
            return res.send({
                updated: false,
            });
        }
        
        // If the user was found, then it's correct
        const user = await User.findOne({
            where: {
                email
            }
        });
        if(!user) {
            console.log(`User not found!`);
            return res.send({
                updated: false,
            });
        }
        
        // Hash password
        const { password } = req.body;
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(
            password,
            salt
        );
        
        // Remove the token
        user.token = "";
        
        // Save user
        await user.save();
        
        return res.send({
            messages: [{
                message: "Password updated",
                error :false,
            }],
            updated: true,
        });
    } catch(err) {
        return res.send({
            updated: false,
        });
    }
});

export default createWithKeyRouter;
