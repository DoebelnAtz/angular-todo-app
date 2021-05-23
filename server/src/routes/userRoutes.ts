import express from "express";

import { createUser, getUserTasks } from "../controllers/userControllers";

const userRouter = express.Router();

userRouter.get("/tasks", getUserTasks);

userRouter.patch("/", createUser);

export default userRouter;
