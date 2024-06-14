const express = require("express");

const { generateJwtToken } = require("../../../helpers/tokens");
const LoginEndpointValidation = require("../../../api/auth/LoginEndpointValidation");

const loginRouter = express.Router();

// Backend authentication 
loginRouter.post("/login", async (req, res) => {
    try {
        console.log(`POST /auth/login`);
        
        const loginVal = new LoginEndpointValidation(req);
        
        // The result is the response object
        const result = await loginVal.loginValidation();
        // Check if it's an error, and if it's send it
        if(loginVal.isError()) {
            console.log(`Error when trying to log in:`);
            console.log(result);
            return res.send(result);
        }
        
        // Create jwt token
        const userSafe = loginVal.getUserSafe();
        const token = generateJwtToken(userSafe);
        
        // Remove sensitive information
        const user = loginVal.userSafe();
        
        // Store cookie
        return res
            .cookie("_token", token, {
                httpOnly: false,
            })
            .send({
                user,
                token,
                loggedIn: true,
                messages: [{
                    error: false,
                    message: "User logged in"
                }]
            });
    } catch(err) {
        console.log(`There was an error when the user tried to log in: `);
        console.error(err);
        return res
            .send({
                loggedIn: false,
                messages: [{
                    error: true,
                    message: "Unknown error"
                }]
            });
    }
});

module.exports = loginRouter;
