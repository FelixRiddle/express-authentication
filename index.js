const LoginEndpointValidation = require("./src/api/auth/LoginEndpointValidation");
const AuthAPI = require("./src/api/auth/AuthAPI");
const FrontendAuthAPI = require("./src/public/api/auth/FrontendAuthAPI");

const User = require("./src/model/User");

const { libUserRouter } = require("./src/server/routes");

const protectRoute = require("./src/middleware/auth/protectRoute");
const getUser = require("./src/middleware/auth/getUser");

// It's not working for me heh
module.exports = {
    // API's
    AuthAPI,
    LoginEndpointValidation,
    FrontendAuthAPI,
    
    // Models
    User,
    
    // Routes
    libUserRouter,
    
    // Middleware
    protectRoute,
    getUser,
};
