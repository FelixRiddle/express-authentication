const express = require("express");

const dataRouter = require("./data");
const deleteRouter = require("./delete.js");

const userRoutes = express.Router();

userRoutes.use(dataRouter);
userRoutes.use(deleteRouter);

module.exports = userRoutes;
