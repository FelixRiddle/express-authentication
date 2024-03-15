import express from "express";

const userRouterLogin = express.Router();

userRouterLogin.post("/user_login", async (req, res) => {
    try {
        return res.send({
            userLoggedIn: true,
            messages: [{
                message: "User logged in",
                error: false,
            }]
        });
    } catch(err) {
        console.error(err);
        return res.send({
            userLoggedIn: false,
            messages: [{
                message: "Internal error",
                error: true,
            }]
        });
    }
});

export default UserLogin;
