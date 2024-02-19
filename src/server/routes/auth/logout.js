/**
 * Request logout
 */
const express = require("express");

const logoutRouter = express.Router();

logoutRouter.get("/logout", (req, res) => {
    
    res.clearCookie("_token");
    
    return res.redirect("/home");
});

module.exports = logoutRouter;
