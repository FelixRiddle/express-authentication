const express = require("express");

const emailRouter = require("./email");
const loginRouter = require("./login");
const logoutRouter = require("./logout");
const registerRouter = require("./register");
const loginGetJwtRouter = require("./login_get_jwt");
const passwordRouter = require("./password/index");

const authRoutes = express.Router();

// Insert other routers
authRoutes.use(emailRouter);
authRoutes.use(loginGetJwtRouter);
authRoutes.use(loginRouter);
authRoutes.use(logoutRouter);
authRoutes.use(registerRouter);
authRoutes.use("/password", passwordRouter);

module.exports = authRoutes;
