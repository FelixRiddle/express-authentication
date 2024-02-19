import express from "express";

import expand from "../../controllers/expand.js";

const profileRouter = express.Router();

profileRouter.get("/profile", (req, res) => {
    return res.render("user/profile", {
        ...expand(req)
    });
});

export default profileRouter;
