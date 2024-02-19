import express from "express";
import User from "../../models/User.js";
import { serverUrl } from "../../controllers/env/env.js";
import { emailConfirmationPrivateKey, setConfirmationEmailPrivateKey } from "../../controllers/env/privateKeys.js";
import ConfirmationEmailPrivateKey from "../../controllers/env/private/ConfirmationEmailPrivateKey.js";

const emailRouter = express.Router();

/**
 * Email validation
 */
emailRouter.get("/email/:token", async(req, res) => {
    const home = `${serverUrl()}/home`;
    console.log(`GET /auth/email/:token`);
    
    try {
        // Get the token
        const { token } = req.params;
        
        // Verify if the token is correct
        const user = await User.findOne({
            where: {
                token,
            },
        });
        if(!user) {
            console.log(`Couldn't confirm the E-Mail, because the user doesn't exists!`)
            return res.redirect(home);
        }
        
        // Confirm account
        if(user.token == token) {
            user.token = "";
            user.confirmedEmail = true;
            
            await user.save();
        } else {
            console.log(`Couldn't confirm the E-Mail, tokens don't match!`);
            return res.redirect(home);
        }
        
        console.log(`Email confirmed!`);
        return res.redirect(home);
    } catch(err) {
        console.log(`Error when confirming the email.`);
        console.error(err);
        return res.redirect(home);
    }
});

/**
 * Private key email validation
 * 
 */
emailRouter.post("/email", async(req, res) => {
    console.log(`POST /auth/email`);
    
    try {
        // Get the private key
        const privateKey = req.body.key;
        
        if(!privateKey) {
            console.log(`Private access key not given`);
            return res.send({
                emailConfirmed: false,
            });
        }
        
        // Fetch key from the json file
        const backdoorEmailConfirmation = new ConfirmationEmailPrivateKey();
        const key = backdoorEmailConfirmation.loadLocally();
        
        // Check that it matches
        const keysMatch = privateKey === key;
        if(!keysMatch) {
            console.log(`Someone tried to access email confirmation private endpoint`);
            console.log(`Naughty, naughty 😈👿`);
            return res.send({
                emailConfirmed: false,
            });
        } else {
            // Keys match, now change key just in case
            setConfirmationEmailPrivateKey();
        }
        
        // Get user email
        const email = req.body.email;
        if(!email) {
            console.log(`Can't confirm email without an email`);
            return res.send({
                emailConfirmed: false,
            });
        }
        
        // Verify if the token is correct
        const user = await User.findOne({
            where: {
                email,
            },
        });
        if(!user) {
            console.log(`Couldn't confirm the E-Mail, because the user doesn't exists!`);
            return res.send({
                emailConfirmed: false,
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
        });
    } catch(err) {
        console.log(`Error when confirming the email.`);
        console.error(err);
        return res.send({
            emailConfirmed: false,
        });
    }
});

export default emailRouter;
