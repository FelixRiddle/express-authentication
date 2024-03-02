const express = require("express");

const { generateJwtToken } = require("../../../helpers/tokens");
const LoginEndpointValidation = require("../../../api/auth/LoginEndpointValidation");

const loginRouter = express.Router();

// Backend authentication 
loginRouter.post("/login", async (req, res) => {
    console.log(`POST /auth/login`);
    
    try {
        const loginVal = new LoginEndpointValidation(req);
        
        // The result is the response object
        const result = await loginVal.loginValidation();
        // Check if it's an error, and if it's send it
        if(loginVal.isError()) {
            return res.send(result);
        }
        
        // Create jwt token
        const userSafe = loginVal.getUserSafe();
        const token = generateJwtToken(userSafe);
        
        console.log(`Login ok, storing user cookie and redirecting to home`);
        
        // Store cookie
        return res
            .cookie("_token", token, {
                httpOnly: false,
            })
            .send({
                token,
                loggedIn: true,
                messages: [{
                    error: false,
                    message: "User logged in"
                }]
            });
    } catch(err) {
        console.error(err);
        console.log(`There was an error when the user tried to log in redirecting to home`);
        return res
            .send({
                loggedIn: false,
                messages: [{
                    error: true,
                    message: "Unknown error"
                }],
                token: ""
            });
    }
});

module.exports = loginRouter;
