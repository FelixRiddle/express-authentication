/**
 * Login jwt
 * 
 * A specific endpoint for testing the log in behaviour, you just get the jwt directly instead of a whole page.
 * Maybe it would be easier if I just don't redirect the user from the backend when they log in? 😂
 */
const express = require("express");

const { generateJwtToken } = require("../../../helpers/tokens");
const LoginEndpointValidation = require("../../../api/auth/LoginEndpointValidation");

const loginGetJwtRouter = express.Router();

/**
 * Login get jwt
 * 
 */
loginGetJwtRouter.post("/login_get_jwt", async(req, res) => {
    try {
        console.log(`POST /auth/login_get_jwt`);
        
        const loginVal = new LoginEndpointValidation(req);
        
        // The result is the response object
        const result = await loginVal.loginValidation();
        // Check if it's an error, and if it's send it
        if(loginVal.isError()) {
            console.log(`The user didn't pass validation, specific error: `);
            console.log(result);
            
            return res.send(result);
        }
        
        // Create jwt token
        const userSafe = loginVal.getUserSafe();
        const token = generateJwtToken(userSafe);
        
        console.log(`User logged in`);
        
        // Store cookie
        return res
            .cookie("_token", token, {
                httpOnly: false,
            })
            .send({
                loggedIn: true,
                token,
                messages: [{
                    message: "User logged in",
                    error: false,
                }]
            });
    } catch(err) {
        console.log(`There was an error when the user tried to log in.`);
        console.error(err);
        return res.send({
            loggedIn: false,
            token: "",
            messages: [{
                message: "Error please try again later",
                error: true,
            }]
        });
    }
});

module.exports = loginGetJwtRouter;
