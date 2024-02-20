const express = require("express");

const userRoutes = require("./user/index");
const protectRoute = require("../../middleware/auth/protectRoute")
const authRoutes = require("./auth/index");

const routes = express.Router();

// Open routes
routes.use("/auth", authRoutes);

// Protected routes
routes.use("/user", protectRoute, userRoutes);

// Access through public alias
// This prevents route protection like /user
// The public shouldn't ever be protected, but most of the functionality already
// uses the 'bare' public version, so it would be a hassle to migrate everything.
routes.use("/public", express.static("public"));

module.exports = routes;
