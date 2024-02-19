import express from "express";

const settingsRouter = express.Router();

settingsRouter.post("/delete_user", (req, res) => {
    return res.send({});
});

export default settingsRouter;
