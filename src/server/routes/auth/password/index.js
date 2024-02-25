const express = require("express");

const createWithKeyRouter = require("./create_with_key");
const createRouter = require("./create");
const sendResetEmail = require("./send_reset_email");

const passwordRouter = express.Router();

passwordRouter.use(createWithKeyRouter);
passwordRouter.use(createRouter);
passwordRouter.use(sendResetEmail);

module.exports = passwordRouter;
