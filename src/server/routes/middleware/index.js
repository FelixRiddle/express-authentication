const express = require("express");

const protectRouteRouter = require("./private/protectRoute");

const middlewareRouter = express.Router();

middlewareRouter.use("/private", protectRouteRouter);

module.exports = middlewareRouter;
