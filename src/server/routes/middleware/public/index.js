const express = require("express");

const authenticatedUserProtection = require("../../../../middleware/auth/public/authenticatedUserProtection");
const authenticatedUserProtectionRouter = require("./authenticatedUserProtection");

const publicRouter = express.Router();

// Protect the route
publicRouter.use(authenticatedUserProtection, authenticatedUserProtectionRouter);

module.exports = publicRouter;
