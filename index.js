const { libUserRouter } = require("./src/server/routes");
const User = require("./src/model/User");
const protectRoute = require("./src/middleware/auth/protectRoute");
const getUser = require("./src/middleware/auth/getUser");
const LoginEndpointValidation = require("./src/api/auth/LoginEndpointValidation");
const AuthAPI = require("./src/api/auth/AuthAPI");

// It's not working for me heh
module.exports = {
    // API's
    AuthAPI,
    LoginEndpointValidation,
    // Models
    User,
    // Routes
    libUserRouter,
    // Middleware
    protectRoute,
    getUser,
};
