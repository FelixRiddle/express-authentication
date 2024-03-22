const express = require("express");

const { User } = require("app-models");

const { registerEmail } = require("../../../helpers/emails");
const { generateId } = require("../../../helpers/tokens");
const expand = require("../../../controllers/expand");
const validateRegister = require("../../../public/validation/validateRegister");
const { isEmailDisabled } = require("../../../controllers/env/env");

const registerRouter = express.Router();

// Register user route
registerRouter.post("/register", async (req, res) => {
    console.log(`POST /auth/register`);
    
    try {
        // Check that passwords match
        let expanded = expand(req);
        if(req.body.password != req.body.confirmPassword) {
            console.log(`Passwords don't match`);
            return res.send({
                // Expanded data
                ...req.body,
                ...expanded,
                page: "Create account",
                messages: [{
                    message: "Passwords don't match.",
                    error: true,
                    field: 'password'
                }, {
                    message: "Passwords don't match.",
                    error: true,
                    field: 'confirmPassword'
                }],
                user: req.body,
                userRegistered: false,
            });
        }
        
        // Validate data
        let val = validateRegister(req.body);
        if(val.length > 0) {
            console.log(`Didn't pass validation`);
            return res.send({
                // Expanded data
                ...req.body,
                ...expanded,
                // New data
                page: "Create account",
                messages: [...val],
                user: req.body,
                userRegistered: false,
            });
        }
        
        // Get data
        let { name, email, password } = req.body;
        
        // Verify that the user is not duplicated
        const userModel = new User();
        const userExists = await userModel.findOne({ where: { email } });
        if(userExists) {
            console.log(`The given email is already in use`);
            console.log(`User found: `, userExists);
            console.log(`Not creating user`);
            return res.send({
                // Expanded data
                ...req.body,
                ...expanded,
                page: "Create account",
                messages: [{
                    message: "The given E-Mail is already in use, try another or log in.",
                    error: false,
                    field: 'email',
                }],
                user: req.body,
                userRegistered: false,
            });
        }
        
        // Create user
        const user = await userModel.create({
            name, email, password,
            token: generateId(),
            confirmedEmail: false,
        });
        
        // Check if sending email is enabled or not
        if(!isEmailDisabled()) {
            // Send confirmation email
            registerEmail({
                name,
                email,
                token: user.token,
            });
        }
        console.log(`User created`);
        
        // Show confirmation message
        return res.send({
            // Expanded data
            ...req.body,
            ...expanded,
            page: "Account created",
            messages: [{
                message: "We've sent a message to your E-Mail inbox, open it to confirm your account.",
                // Some messages should be notified, others not
                shouldNotify: true,
                error: false,
            }],
            userRegistered: true,
        });
    } catch(err) {
        console.log(`Error: `, err);
        let expanded = expand(req);
        // Show confirmation message
        return res.send({
            // Expanded data
            ...req.body,
            ...expanded,
            page: "Create account",
            messages: [{
                message: "Internal error, if the error persists, please report it.",
                // Some messages should be notified, others not
                shouldNotify: true,
                error: true,
            }],
            userRegistered: false,
        });
    }
});

module.exports = registerRouter;
