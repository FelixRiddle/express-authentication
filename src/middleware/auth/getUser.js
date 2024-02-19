/**
 * Get user
 * 
 * Different from protectRoute, because in this middleware the user is optional.
 */
const jwt = require("jsonwebtoken");

const User = require("../../model/User.js");
const { serverUrl } = require("../../controllers/env/env");

// Get user
const getUser = async (req, res, next) =>  {
    const home = `${serverUrl()}/home`;
    
    // Validate token
    try {
        // Check token
        // Get and rename token
        let { _token: token } = req.cookies;
        
        if(token) {
            // Verify user
            let decoded = undefined;
            try {
                const jwtData = jwt.verify(token, process.env.JWT_SECRET_KEY);
                decoded = jwtData;
            } catch(err) {
                console.log(`The token couldn't be verified, maybe it has expired!`);
                // console.error(err);
                // return res.redirect(home);
            }
            
            // Validate user
            const user = await User.scope("deletePassword").findByPk(decoded.id);
            
            // Store user on the request
            if(user) {
                req.user = user;
                // return next();
            } else {
                console.log(`The user doesn't exists`);
                // return res.redirect(home);
            }
        } else {
            console.log(`The token wasn't found!`);
            // return res.redirect(home);
        }
    } catch(err) {
        console.log(`Error when veryfing token`);
        
        // Grave mistake, the page doesn't even render.
        // return res.redirect(home);
    }
    
    // Regardless of whether the token was found or not
    return next();
}

module.exports = getUser;
