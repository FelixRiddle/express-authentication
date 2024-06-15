const LoginEndpointValidation = require("./src/api/auth/LoginEndpointValidation");

// Env
const env = require("./src/controllers/env/env");

const { libUserRouter } = require("./src/server/routes");

// Middleware
const protectRoute = require("./src/middleware/auth/protectRoute");
const getUser = require("./src/middleware/auth/getUser");
const authenticatedUserProtection = require('./src/middleware/auth/public/authenticatedUserProtection');
const publicGetUser = require("./src/middleware/auth/public/publicGetUser");

// It's not working for me heh
module.exports = {
    LoginEndpointValidation,
    
    // Env
    env,
    envServerUrl: env.envServerUrl,
    
    // Routes
    libUserRouter,
    
    // Middleware(For this server)
    privateMiddleware: {
        protectRoute,
        getUser,
    },
    
    // Public middleware(For any app)
    publicMiddleware: {
        authenticatedUserProtection,
        publicGetUser,
    },
};
