/**
 * Request logout
 */
const express = require("express");

const logoutRouter = express.Router();

logoutRouter.get("/logout", (req, res) => {
    try {
        res.clearCookie("_token");
        
        return res.send({
            loggedOut: true,
            messages: [{
                error: false,
                message: "User logged out",
            }],
        });
    } catch(err) {
        console.error(err);

        return res.send({
            loggedOut: false,
            messages: [{
                error: true,
                message: "Unknown error",
            }],
        });
    }
});

module.exports = logoutRouter;
