const LoginEndpointValidation = require("./src/api/auth/LoginEndpointValidation");
const AuthAPI = require("./src/api/auth/AuthAPI");
const FrontendAuthAPI = require("./src/public/api/auth/FrontendAuthAPI");
const ResetPasswordAPI = require("./src/api/auth/password/ResetPasswordAPI");
const UserAPI = require("./src/api/secure/UserAPI");

// Env
const env = require("./src/controllers/env/env");

const { libUserRouter } = require("./src/server/routes");

const protectRoute = require("./src/middleware/auth/protectRoute");
const getUser = require("./src/middleware/auth/getUser");

// It's not working for me heh
module.exports = {
    // API's
    AuthAPI,
    LoginEndpointValidation,
    FrontendAuthAPI,
    ResetPasswordAPI,
    UserAPI,
    
    // Env
    env,
    envServerUrl: env.envServerUrl,
    
    // Routes
    libUserRouter,
    
    // Middleware
    protectRoute,
    getUser,
};
