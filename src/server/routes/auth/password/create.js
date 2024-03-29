const { check, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const express = require("express");

// When resetting the password
const createRouter = express.Router();

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
                messages: [{
                    error: true,
                    message: "Validation didn't pass!"
                }],
                updated: false,
            });
        }
        
        // Check that passwords match
        if(req.body.password != req.body.confirmPassword) {
            console.log(`Passwords don't match`);
            return res.send({
                messages: [{
                    error: true,
                    message: "Passwords don't match!"
                }],
                updated: false,
            });
        }
        
        // If the user was found, then it's correct
        const userModel = req.models.user();
        const user = await userModel.findOne({
            where: {
                token
            }
        });
        if(!user) {
            console.log(`User not found!`);
            return res.send({
                messages: [{
                    error: true,
                    message: "User not found"
                }],
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
                error: false,
            }],
            updated: true,
        });
    } catch(err) {
        return res.send({
            messages: [{
                error: true,
                message: "Unknown error"
            }],
            updated: false,
        });
    }
});

module.exports = createRouter;
