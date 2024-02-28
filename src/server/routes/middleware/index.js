const express = require("express");

const publicRouter = require("./public/index");
const protectRouteRouter = require("./private/protectRoute");

const middlewareRouter = express.Router();

middlewareRouter.use("/private", protectRouteRouter);
middlewareRouter.use("/public", publicRouter);

module.exports = middlewareRouter;
