import express from "express";

import { createUser } from "../controllers/userControllers";

const userRouter = express.Router();

userRouter.patch("/", createUser);

export default userRouter;
