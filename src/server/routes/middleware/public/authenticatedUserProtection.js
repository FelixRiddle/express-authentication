const express = require("express");

const authenticatedUserProtectionRouter = express.Router();

authenticatedUserProtectionRouter.post("/authenticated_user_protection", async (req, res) => {
    try {
        console.log(`POST /public/middleware/authenticated_user_protection`);

        // Should send the user, or bounce if the token is incorrect
        return res.send(req.user);
    } catch(err) {
        console.error(err);
    }
});

module.exports = authenticatedUserProtectionRouter;
