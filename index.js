const LoginEndpointValidation = require("./src/api/auth/LoginEndpointValidation");
const AuthAPI = require("./src/api/auth/AuthAPI");
const FrontendAuthAPI = require("./src/public/api/auth/FrontendAuthAPI");
const ResetPasswordAPI = require("./src/api/auth/password/ResetPasswordAPI");
const UserAPI = require("./src/api/secure/UserAPI");

// Database connections
const MySQLDatabaseConnection = require("./src/database/MySQLDatabaseConnection");
const MSQLDC_FetchENV = require("./src/database/MSQLDC_FetchENV");

// Email
const confirmUserEmailWithPrivateKey = require("./src/email/confirmUserEmailWithPrivateKey");

// Env
const env = require("./src/controllers/env/env");

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
    UserAPI,
    
    // Database connections/connectors
    MySQLDatabaseConnection,
    MSQLDC_FetchENV,
    
    // E-Mail
    confirmUserEmailWithPrivateKey,
    
    // Env
    env,
    envServerUrl: env.envServerUrl,
    
    // Models
    User,
    
    // Routes
    libUserRouter,
    
    // Middleware
    protectRoute,
    getUser,
};
