const express = require("express");

const protectRoute = require("../../middleware/auth/protectRoute")

const authRoutes = require("./auth/index");
const middlewareRouter = require("./middleware/index");
const userRoutes = require("./user/index");

const routes = express.Router();

// Open routes
routes.use("/auth", authRoutes);

// Protected routes
routes.use("/user", protectRoute, userRoutes);

routes.use("/middleware", middlewareRouter);

// Access through public alias
// This prevents route protection like /user
// The public shouldn't ever be protected, but most of the functionality already
// uses the 'bare' public version, so it would be a hassle to migrate everything.
routes.use("/public", express.static("public"));

/**
 * Library user router
 * 
 * To be used as a library by other apps
 * 
 * WARNING: Remember to call it!!!
 * This is a function, I wasted 4 hours because I forgot to call it 😭😭😭😭😭
 * 
 * @returns {express.Router}
 */
function libUserRouter() {
    const newAuthRouter = express.Router();
    
    // Open routes
    newAuthRouter.use("/auth", authRoutes);
    
    // Protected routes
    newAuthRouter.use("/user", protectRoute, userRoutes);
    
    return newAuthRouter;
}

const moduleA = module.exports = routes;
moduleA.libUserRouter = libUserRouter;
