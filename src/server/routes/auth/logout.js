/**
 * Request logout
 */
import express from "express";

const logoutRouter = express.Router();

logoutRouter.get("/logout", (req, res) => {
    
    res.clearCookie("_token");
    
    return res.redirect("/home");
});

export default logoutRouter;
