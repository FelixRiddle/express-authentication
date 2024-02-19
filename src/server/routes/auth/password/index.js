import express from "express";

import createWithKeyRouter from "./create_with_key.js";
import resetRouter from "./reset.js";
import createRouter from "./create.js";

const passwordRouter = express.Router();

passwordRouter.use(createWithKeyRouter);
passwordRouter.use(createRouter);
passwordRouter.use(resetRouter);

export default passwordRouter;
