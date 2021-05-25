import { catchErrors } from "../errors/catchErrors";
import { db } from "../db";
import CustomError from "../errors/customError";
import admin from "firebase-admin";
import { firestore } from "firebase-admin/lib/firestore";

export const updateUser = catchErrors(async (req, res) => {
  const user = req.body;

  let userDoc = await db.collection("users").doc(user.uid);

  let doc = await userDoc.get();
  if (doc.exists) {
    // do nothing...
  } else {
    await userDoc.set({
      isAnonymous: user.isAnonymous,
      tasks: {},
    });
  }

  res.json(user);
}, "Failed to create user");

export const getUserTasks = catchErrors(async (req, res) => {
  const uid = req.query.uid as string;

  let userDoc = await db.collection("users").doc(uid);

  let doc = await userDoc.get();

  if (doc.exists) {
    console.log(doc.data());
    let tasks = doc.data().tasks;
    console.log();
    return res.json(
      Object.keys(tasks).map((t) => ({ name: t, checked: tasks[t] }))
    );
  } else {
    throw new CustomError(
      "Failed to find user with provided id",
      404,
      `Did not find a user matching id: ${uid}`,
      "Failed to get tasks"
    );
  }
}, "Failed to get users tasks");

export const createTask = catchErrors(async (req, res) => {
  const { uid, name } = req.body;

  let userDoc = await db.collection("users").doc(uid);

  let doc = await userDoc.get();
  if (doc.exists) {
    let user = doc.data();
    if (!(user.tasks[name] === undefined)) {
      throw new CustomError(
        "Failed to create task",
        409,
        `User already has a task of that name`,
        "A task of that name already exists"
      );
    }
    user.tasks[name] = false;
    userDoc.set(user);
    return res.status(201).json({ name });
  } else {
    throw new CustomError(
      "Failed to find user with provided id",
      404,
      `Did not find a user matching id: ${uid}`,
      "Failed to create task"
    );
  }
}, "Failed to create task");

export const deleteTask = catchErrors(async (req, res) => {
  const { uid, name } = req.body;
  console.log(uid, name);
  let userDoc = await db.collection("users").doc(uid);

  let doc = await userDoc.get();
  if (doc.exists) {
    const user = doc.data();
    if (user.tasks[name] === undefined) {
      throw new CustomError(
        "Failed to delete task",
        400,
        `User does not have a task of that name`,
        "This task has already been deleted"
      );
    }
    await userDoc.set(
      {
        tasks: {
          [name]: firestore.FieldValue.delete(),
        },
      },
      { merge: true }
    );
    return res.status(200).json({ name });
  } else {
    throw new CustomError(
      "Failed to find user with provided id",
      404,
      `Did not find a user matching id: ${uid}`,
      "Failed to get tasks"
    );
  }
}, "Failed to delete task");

export const setTaskChecked = catchErrors(async (req, res) => {
  const { uid, name } = req.body;
  console.log(uid, name);
  let userDoc = await db.collection("users").doc(uid);

  let doc = await userDoc.get();
  if (doc.exists) {
    const user = doc.data();
    if (user.tasks[name] === undefined) {
      throw new CustomError(
        "Failed to check task",
        400,
        `User does not have a task of that name`,
        "The task does not exist"
      );
    }
    user.tasks[name] = !user.tasks[name];
    userDoc.set(user);
    return res.status(200).json({ name });
  } else {
    throw new CustomError(
      "Failed to find user with provided id",
      404,
      `Did not find a user matching id: ${uid}`,
      "Failed to get tasks"
    );
  }
}, "Failed to check/un-check task");
