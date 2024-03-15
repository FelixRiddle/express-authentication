const express = require("express");

const { BackendServerAccessAPI } = require("backdoor-server-access");
const { User } = require("app-models");

const emailRouter = express.Router();

/**
 * Private key email validation
 * 
 */
emailRouter.post("/email", async(req, res) => {
    try {
        console.log(`POST /auth/email`);
        
        // Get the private key
        const privateKey = req.body.key;
        
        if(!privateKey) {
            console.log(`Private access key not given`);
            return res.send({
                emailConfirmed: false,
                messages: [{
                    message: "Unknown error",
                    error: true,
                }]
            });
        }
        
        // Check if keys match
        const api = new BackendServerAccessAPI();
        api.setUrl(process.env.BACKDOOR_SERVER_ACCESS_URL);
        const key = await api.emailConfirmationKey();
        
        // Check that it matches
        const keysMatch = privateKey === key;
        if(!keysMatch) {
            console.log(`Someone tried to access email confirmation private endpoint`);
            console.log(`Naughty, naughty 😈👿`);
            return res.send({
                emailConfirmed: false,
                messages: [{
                    message: "Unknown error",
                    error: true,
                }]
            });
        }
        
        // Get user email
        const email = req.body.email;
        if(!email) {
            console.log(`Can't confirm email without an email`);
            return res.send({
                emailConfirmed: false,
                messages: [{
                    message: "Unknown error",
                    error: true,
                }]
            });
        }
        
        // Verify if the token is correct
        const userModel = new User();
        const user = await userModel.findOne({
            where: {
                email,
            },
        });
        if(!user) {
            console.log(`Couldn't confirm the E-Mail, because the user doesn't exists!`);
            return res.send({
                emailConfirmed: false,
                messages: [{
                    message: "Unknown error",
                    error: true,
                }]
            });
        } else {
            // Update the user
            user.token = "";
            user.confirmedEmail = true;
            
            await user.save();
        }
        
        console.log(`Email confirmed!`);
        return res.send({
            emailConfirmed: true,
            messages: []
        });
    } catch(err) {
        console.log(`Error when confirming the email.`);
        console.error(err);
        return res.send({
            emailConfirmed: false,
            messages: [{
                message: "Unknown error",
                error: true,
            }]
        });
    }
});

module.exports = emailRouter;
