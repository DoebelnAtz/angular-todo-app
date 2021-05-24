import { catchErrors } from "../errors/catchErrors";
import { db } from "../db";
import CustomError from "../errors/customError";
import admin from "firebase-admin";

export const updateUser = catchErrors(async (req, res) => {
  const user = req.body;

  let userDoc = await db.collection("users").doc(user.uid);

  userDoc.get().then((doc) => {
    if (doc.exists) {
      // do nothing...
    } else {
      userDoc.set({
        isAnonymous: user.isAnonymous,
        tasks: [],
      });
    }
  });

  res.json("done");
}, "Failed to create user");

export const getUserTasks = catchErrors(async (req, res) => {
  const uid = req.query.uid as string;

  let userDoc = await db.collection("users").doc(uid);

  userDoc
    .get()
    .then((doc) => {
      if (doc.exists) {
        console.log(doc.data());
        return res.json(doc.data().tasks);
      } else {
        throw new CustomError(
          "Failed to find user with provided id",
          404,
          `Did not find a user matching id: ${uid}`,
          "Failed to get tasks"
        );
      }
    })
    .catch((e) => {
      throw new CustomError(
        "Failed to get user",
        500,
        e,
        "Something went wrong"
      );
    });
}, "Failed to get users tasks");

export const createTask = catchErrors(async (req, res) => {
  const { uid, name } = req.body;

  let userDoc = await db.collection("users").doc(uid);

  let doc = await userDoc.get();
  if (doc.exists) {
    const user = doc.data();
    if (user.tasks.find((task) => task.name === name)) {
      throw new CustomError(
        "Failed to create task",
        409,
        `User already has a task of that name`,
        "A task of that name already exists"
      );
    }
    userDoc.update({
      tasks: admin.firestore.FieldValue.arrayUnion({
        name: name,
      }),
    });
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
    if (!user.tasks.find((task) => task.name === name)) {
      throw new CustomError(
        "Failed to delete task",
        400,
        `User does not have a task of that name`,
        "This task has already been deleted"
      );
    }
    userDoc.update({
      tasks: admin.firestore.FieldValue.arrayRemove({
        name: name,
      }),
    });
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
