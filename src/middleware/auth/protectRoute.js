const jwt = require("jsonwebtoken");

const { User } = require("app-models");

const { envServerUrl } = require("../../controllers/env/env");
const serverUrl = require("../../public/web/serverUrl.js");

const PROTECT_ROUTE_DEBUG = false;

/**
 * Protect route
 * 
 * Protect route the only thing it does is to verify that a user is logged in, it doesn't have any
 * role checking, admin checking or security clearance checking.
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
const protectRoute = async (req, res, next) =>  {
    try {
        const loginPage = `${serverUrl(envServerUrl())}/auth/login`;
        
        // Check token
        // Get and rename token
        let { _token: token } = req.cookies;
        
        // If there's no token, send the user to the login page
        if(!token) {
            if(PROTECT_ROUTE_DEBUG) {
                console.log(`No token found, redirecting to ${loginPage}`);
            }
            return res.redirect(loginPage);
        }
        
        // Validate token
        // Verify user
        let decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        
        // Validate user
        const user = await User.scope("deletePassword").findByPk(decoded.id);
        
        // Store user on the request
        if(user) {
            req.user = user;
        } else {
            if(PROTECT_ROUTE_DEBUG) {
                console.log(`User not existent going back`);
            }
            return res.redirect(loginPage);
        }
        
        return next();
    } catch(err) {
        const home = `${serverUrl(envServerUrl())}/home`;
        
        console.error(err);
        
        // TODO: Get and set the route where the user was
        return res.redirect(home);
    }
}

module.exports = protectRoute;
