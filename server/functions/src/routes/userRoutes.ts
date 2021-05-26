import { Router } from "express";
import { check } from "express-validator";

import {
  updateUser,
  getUser,
  createTask,
  deleteTask,
  setTaskChecked,
  updateUserTaskList,
} from "../controllers/userControllers";

const userRouter = Router();

userRouter.patch("/", updateUser);

userRouter.get("/", getUser);

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
