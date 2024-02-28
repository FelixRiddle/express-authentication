const jwt = require("jsonwebtoken");

const { User } = require("app-models");

const PROTECT_ROUTE_DEBUG = true;

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
        // Check token
        // Get and rename token
        let { _token: token } = req.cookies;
        
        // If there's no token, send the user to the login page
        if(!token) {
            if(PROTECT_ROUTE_DEBUG) {
                console.log(`No token found`);
            }
            
            return res.send({
                messages: [{
                    error: true,
                    message: "No token found"
                }]
            });
        }
        
        // Validate token
        // Verify user
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        
        // Validate user
        const userModel = new User();
        const user = await userModel.scope("deletePassword").findByPk(decoded.id);
        
        // Store user on the request
        if(user) {
            req.user = user;
        } else {
            if(PROTECT_ROUTE_DEBUG) {
                console.log(`User not existent`);
            }
            
            return res.send({
                messages: [{
                    error: true,
                    message: "User doesn't exists"
                }]
            });
        }
        
        return next();
    } catch(err) {
        if(PROTECT_ROUTE_DEBUG) {
            console.log(`Protect route middleware error`);
            console.error(err);
        }
        
        return res.send({
            messages: [{
                error: true,
                message: "Unknown error"
            }]
        });
    }
}

module.exports = protectRoute;
