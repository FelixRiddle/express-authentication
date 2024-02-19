const express = require("express");

const createWithKeyRouter = require("./create_with_key");
const resetRouter = require("./reset");
const createRouter = require("./create");

const passwordRouter = express.Router();

passwordRouter.use(createWithKeyRouter);
passwordRouter.use(createRouter);
passwordRouter.use(resetRouter);

module.exports = passwordRouter;
