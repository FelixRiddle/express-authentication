const express = require("express");

const authenticatedUserProtectionRouter = express.Router();

authenticatedUserProtectionRouter.use("/authenticatedUserProtection", async (req, res) => {
    try {
        // Should send the user, or bounce if the token is incorrect
        return res.send(req.user);
    } catch(err) {
        console.error(err);
    }
});

module.exports = authenticatedUserProtectionRouter;
