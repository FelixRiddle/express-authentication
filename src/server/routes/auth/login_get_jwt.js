/**
 * Login jwt
 * 
 * A specific endpoint for testing the log in behaviour, you just get the jwt directly instead of a whole page.
 * Maybe it would be easier if I just don't redirect the user from the backend when they log in? 😂
 */
import express from "express";

import { generateJwtToken } from "../../helpers/tokens.js";
import LoginEndpointValidation from "../../api/auth/LoginEndpointValidation.js";

const loginGetJwtRouter = express.Router();

loginGetJwtRouter.post("/login_get_jwt", async(req, res) => {
    console.log(`POST /auth/login_get_jwt`);
    
    try {
        const loginVal = new LoginEndpointValidation(req, req.body);
        
        // The result is the response object
        const result = await loginVal.loginValidation();
        // Check if it's an error, and if it's send it
        if(loginVal.isError()) {
            return res.send(result);
        }
        
        // Create jwt token
        const userSafe = loginVal.getUserSafe();
        const token = generateJwtToken(userSafe);
        
        // Store cookie
        return res
            .cookie("_token", token, {
                httpOnly: false,
            })
            .send({
                loggedIn: true,
                token,
            });
    } catch(err) {
        console.error(err);
        console.log(`There was an error when the user tried to log in redirecting to home`);
        return res.send({
            loggedIn: false,
            messages: [{
                message: "Error please try again later",
                error: true,
            }]
        });
    }
});

export default loginGetJwtRouter;
