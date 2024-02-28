const express = require("express");

const protectRouteRouter = require("./protectRoute");

const privateRouter = express.Router();

privateRouter.use("/protectRoute", protectRouteRouter)

module.exports = privateRouter;
