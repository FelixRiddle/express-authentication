const { UserAPI } = require("felixriddle.good-roots-ts-api");

/**
 * Authenticated user protection
 * 
 * Protect route the only thing it does is to verify that a user is logged in, it doesn't have any
 * role checking, admin checking or security clearance checking.
 * 
 * Rules:
 * 1) This is supposed to be executed on other apps, so we can't use jwt.verify
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
const authenticatedUserProtection = async (req, res, next) =>  {
    try {
        // Check token
        // Get and rename token
        let { _token: token } = req.cookies;
        
        // If there's no token, send the user to the login page
        if(!token) {
            return res.send({
                messages: [{
                    error: true,
                    message: "No token found"
                }]
            });
        }
        
        // TODO: This could be improved if this app is treated as a package and installed in an app
        // and we can validate jwt directly
        
        // Fetch the user
        const userApi = await UserAPI.fromJWT(token);
        const user = await userApi.getUserData();
        
        // Validate that the user exists
        // The token should be decoded and the user validated before even validating the signature
        
        // Store user on the request
        if(user && user.email) {
            req.user = user;
        } else {
            return res.send({
                messages: [{
                    error: true,
                    message: "User doesn't exists"
                }]
            });
        }
        
        return next();
    } catch(err) {
        console.log(`Protect route middleware error`);
        console.error(err);
        
        return res.send({
            messages: [{
                error: true,
                message: "Unknown error"
            }]
        });
    }
}

module.exports = authenticatedUserProtection;
