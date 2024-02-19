import express from "express";

import { generateJwtToken } from "../../helpers/tokens.js";
import expand from "../../controllers/expand.js";
import { serverUrl } from "../../controllers/env/env.js";
import LoginEndpointValidation from "../../api/auth/LoginEndpointValidation.js";

const loginRouter = express.Router();

// Frontend authentication
loginRouter.get("/login", async (req, res) => {
    const home = `${serverUrl()}/home`;
    
    try {
        console.log(`User`);
        console.log(req.user);
        
        let expanded = expand(req);
        return res.render("auth/login", {
            page: `Login`,
            ...expanded,
        });
    } catch(err) {
        console.error(err);
        return res.redirect(home);
    }
});

// Backend authentication 
loginRouter.post("/login", async (req, res) => {
    const home = `${serverUrl()}/home`;
    console.log(`POST /auth/login`);
    
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
        
        console.log(`Login ok, storing user cookie and redirecting to home`);
        
        // Store cookie
        return res
            .cookie("_token", token, {
                httpOnly: false,
            })
            .redirect(home);
    } catch(err) {
        console.error(err);
        console.log(`There was an error when the user tried to log in redirecting to home`);
        return res.redirect(home);
    }
});

export default loginRouter;
