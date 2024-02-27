const express = require("express");

const { User } = require("app-models");

const protectRoute = require("../../../middleware/auth/protectRoute.js");

const deleteRouter = express.Router();

deleteRouter.post("/delete", protectRoute, async (req, res) => {
    try {
        const userData = req.user;
        
        // Get user data
        const { email } = userData;
        
        // Get the user
        const userModel = new User();
        let user = await userModel.findOne({
            where: {
                email,
            }
        });
        
        // Check if user exists
        if(!user) {
            console.log(`The user doesn't exists`);
            return res.send({
                userDeleted: false,
                messages: [{
                    message: "The user doesn't exists.",
                    error: true,
                }]
            })
        }
        
        // Delete user
        user.destroy();
        
        return res.send({
            userDeleted: true,
            messages: [{
                message: "User deleted",
                error: false,
            }]
        });
    } catch(err) {
        console.error(`Error: `, err);
        return res.send({
            userDeleted: false,
            messages: [{
                message: "Couldn't delete the user, unknown error",
                error: true,
            }]
        });
    }
});

module.exports = deleteRouter;
