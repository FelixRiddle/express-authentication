/**
 * Get user
 * 
 * Different from protectRoute, because in this middleware the user is optional.
 */
const { UserAPI } = require("felixriddle.good-roots-ts-api");

const GET_USER_DEBUG = false;

/**
 * 
 * @deprecated Use from 'good-roots-ts-api' the function 'UserAPI.fromJWT(token)' instead
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
const publicGetUser = async (req, res, next) =>  {
    // Validate token
    try {
        // Check token
        // Get and rename token
        let { _token: token } = req.cookies;
        
        if(token) {
            // Verify user
            let userData = undefined;
            try {
                // const jwtData = jwt.verify(token, process.env.JWT_SECRET_KEY);
                // decoded = jwtData;
                const userApi = await UserAPI.fromJWT(token);
                userData = userApi.userData;
            } catch(err) {
                if(GET_USER_DEBUG) {
                    console.log(`The token couldn't be verified, maybe it has expired!`);
                }
            }
            
            // Validate user
            const userModel = req.models.user();
            const user = await userModel.scope("deletePassword").findByPk(userData.id);
            
            // Store user on the request
            if(user) {
                req.user = user;
            } else {
                if(GET_USER_DEBUG) {
                    console.log(`The user doesn't exists`);
                }
            }
        } else {
            if(GET_USER_DEBUG) {
                console.log(`The token wasn't found!`);
            }
        }
    } catch(err) {
        if(GET_USER_DEBUG) {
            console.log(`Error when veryfing token`);
        }
    }
    
    // Regardless of whether the token was found or not
    return next();
}

module.exports = publicGetUser;
