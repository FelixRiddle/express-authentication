const express = require("express");

const publicGetUserRouter = express.Router();

publicGetUserRouter.get("/publicGetUser", (req, user) => {
    try {
        
    } catch(err) {
        console.error(err);
    }
});

module.exports = publicGetUserRouter;
