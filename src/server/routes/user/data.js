const express = require("express");

const dataRouter = express.Router();

/**
 * Fetch user data
 */
dataRouter.get("/data", async (req, res) => {
    try {
        console.log(`/user/data`);
        // We know the user has verified the token
        // So all we have to do is return req.user
        console.log(`Req user(in /user/data): `, req.user);
        const user = req.user;

        return res.send({
            user,
            messages: [{
                error: false,
                message: "Data fetch"
            }]
        });
    } catch(err) {
        console.error(err);

        return res.send({
            user: undefined,
            messages: [{
                error: true,
                message: "Unknown error"
            }]
        });
    }
});

module.exports = dataRouter;
