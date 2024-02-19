import { check, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import express from "express";

import User from "../../../models/User.js";
import { serverUrl } from "../../../controllers/env/env.js";

// When resetting the password
const createRouter = express.Router();

createRouter.get("/create/:token", async(req, res) => {
    console.log(`GET /auth/password/create/:token`);
    
    let { token } = req.params;
    
    return res.render(`${serverUrl()}/user/auth/password/create/${token}`, {
        page: "Reset your password",
    });
});

// After the user got the token to create the password
// They will be redirected here
createRouter.post("/create/:token", async (req, res) => {
    console.log(`POST /auth/password/create/:token`);
    
    try {
        const { token } = req.params;
        
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
                token
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
        
        // Delete token
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

export default createRouter;
