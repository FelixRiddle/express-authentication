import express from "express";

import emailRouter from "./email.js";
import loginRouter from "./login.js";
import logoutRouter from "./logout.js";
import registerRouter from "./register.js";
import passwordRouter from "./password/index.js";
import loginGetJwtRouter from "./login_get_jwt.js";

const authRoutes = express.Router();

// Insert other routers
authRoutes.use(emailRouter);
authRoutes.use(loginGetJwtRouter);
authRoutes.use(loginRouter);
authRoutes.use(logoutRouter);
authRoutes.use(registerRouter);
authRoutes.use("/password", passwordRouter);

export default authRoutes;
