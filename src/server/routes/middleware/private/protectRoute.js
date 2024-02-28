const express = require("express");

const protectRouteRouter = express.Router();

protectRouteRouter.get("", async (req, res) => {
    try {
        return res.send(req.user);
    } catch(err) {
        console.error(err);
    }
});

module.exports = protectRouteRouter;
