import express from "express";
import { check } from "express-validator";

import {
  updateUser,
  getUserTasks,
  createTask,
  deleteTask,
} from "../controllers/userControllers";

const userRouter = express.Router();

userRouter.get(
  "/tasks",
  [check("uid").not().equals("undefined")],
  getUserTasks
);

userRouter.post(
  "/tasks",
  [
    check("uid").isString(),
    check("name").isString().isLength({ min: 1, max: 100 }),
  ],
  createTask
);

userRouter.patch("/", updateUser);

userRouter.delete("/tasks", deleteTask);

export default userRouter;
