const express = require("express");

const dataRouter = express.Router();

/**
 * Fetch user data
 */
dataRouter.get("/data", async (req, res) => {
    try {
        // We know the user has verified the token
        // So all we have to do is return req.user
        return res.send(req.user);
    } catch(err) {
        console.error(err);
    }
});

module.exports = dataRouter;
