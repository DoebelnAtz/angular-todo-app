import express from "express";
import { check } from "express-validator";

import {
  updateUser,
  getUserTasks,
  createTask,
  deleteTask,
  setTaskChecked,
  updateUserTaskList,
} from "../controllers/userControllers";

const userRouter = express.Router();

userRouter.patch("/", updateUser);

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

userRouter.patch("/tasks", updateUserTaskList);

userRouter.put("/tasks", setTaskChecked);

userRouter.delete("/tasks", deleteTask);

export default userRouter;
