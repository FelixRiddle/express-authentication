const express = require("express");

const deleteRouter = require("./delete.js");

const userRoutes = express.Router();

// Insert other routers
userRoutes.use(deleteRouter);

module.exports = userRoutes;
