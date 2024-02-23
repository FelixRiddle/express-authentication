const LoginEndpointValidation = require("./src/api/auth/LoginEndpointValidation");
const AuthAPI = require("./src/api/auth/AuthAPI");
const ResetPasswordAPI = require("./src/api/auth/ResetPasswordAPI");

const FrontendAuthAPI = require("./src/public/api/auth/FrontendAuthAPI");

const ResetPasswordPrivateKey = require("./src/controllers/env/private/ResetPasswordPrivateKey");

// Database connections
const MySQLDatabaseConnection = require("./src/database/MySQLDatabaseConnection");
const MSQLDC_FetchENV = require("./src/database/MSQLDC_FetchENV");

// Email
const confirmUserEmailWithPrivateKey = require("./src/email/confirmUserEmailWithPrivateKey");

// Models
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
    ResetPasswordAPI,
    ResetPasswordPrivateKey,
    
    // Database connections/connectors
    MySQLDatabaseConnection,
    MSQLDC_FetchENV,
    
    // E-Mail
    confirmUserEmailWithPrivateKey,
    
    // Models
    User,
    
    // Routes
    libUserRouter,
    
    // Middleware
    protectRoute,
    getUser,
};
