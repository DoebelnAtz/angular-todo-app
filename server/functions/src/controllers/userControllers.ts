import { catchErrors } from "../errors/catchErrors";
import { db } from "../db";
import CustomError from "../errors/customError";
import { firestore } from "firebase-admin/lib/firestore";

/**
 *    Updates or creates a new user
 *    requires: {
 *      user {
 *        id: string,
 *        isAnonymous: boolean
 *      }
 *    }
 */
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

/**
 *    GET users tasks, expects ?uid=string
 */
export const getUser = catchErrors(async (req, res) => {
  const uid = req.query.uid as string;

  let userDoc = await db.collection("users").doc(uid);

  let doc = await userDoc.get();

  if (doc.exists) {
    let user = doc.data();
    let tasks = user?.tasks;

    // tasks are store as a map in DB for easier access,
    // format into array
    let mappedTasks = Object.keys(tasks).map((t) => ({ name: t, ...tasks[t] }));
    let sortedTasks = mappedTasks.sort((a, b) => {
      if (a.i < b.i) {
        return -1;
      }
      if (a.i > b.i) {
        return 1;
      }
      return 0;
    });

    const response = {
      ...user,
      tasks: sortedTasks,
    };

    return res.json(response);
  } else {
    throw new CustomError(
      "Failed to find user with provided id",
      404,
      `Did not find a user matching id: ${uid}`,
      "Failed to get tasks"
    );
  }
}, "Failed to get users tasks");

/**
 *    Adds new task to user
 *    requires: {
 *      uid: string,
 *      name: string
 *    }
 */
export const createTask = catchErrors(async (req, res) => {
  const { uid, name } = req.body;
  let userDoc = await db.collection("users").doc(uid);

  let doc = await userDoc.get();
  if (doc.exists) {
    let user = doc.data();
    if (!(user?.tasks[name] === undefined) || !user) {
      throw new CustomError(
        "Failed to create task",
        409,
        `User already has a task of that name`,
        "A task of that name already exists"
      );
    }
    user.tasks[name] = {
      checked: false,
      i: Object.keys(user.tasks).length | 0,
    };
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

/**
 *    Deletes task from user
 *    requires: {
 *      uid: string,
 *      name: string
 *    }
 */
export const deleteTask = catchErrors(async (req, res) => {
  const { uid, name } = req.body;
  console.log(uid, name);
  let userDoc = await db.collection("users").doc(uid);

  let doc = await userDoc.get();
  if (doc.exists) {
    const user = doc.data();
    if (user?.tasks[name] === undefined) {
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
      "Failed to delete task"
    );
  }
}, "Failed to delete task");

/**
 *    Updates user task list, used to reorder tasks
 *    requires: {
 *      uid: string,
 *      tasks: task[]
 *    }
 */
export const updateUserTaskList = catchErrors(async (req, res) => {
  const { uid, tasks } = req.body;

  let userDoc = await db.collection("users").doc(uid);

  let doc = await userDoc.get();
  if (doc.exists) {
    let user = doc.data();
    let taskMap = {};
    if (!user) {
      throw new CustomError(
        "Failed to find user with provided id",
        404,
        `Did not find a user matching id: ${uid}`,
        "Failed to update tasks"
      );
    }
    tasks.forEach((t: { name: string; checked: boolean; i: number }) => {
      // @ts-ignore
      taskMap[t.name] = { checked: t.checked, i: t.i };
    });
    user.tasks = taskMap;
    userDoc.set(user);
    return res.status(201).json({ tasks });
  } else {
    throw new CustomError(
      "Failed to find user with provided id",
      404,
      `Did not find a user matching id: ${uid}`,
      "Failed to update tasks"
    );
  }
}, "Failed to update task list");

/**
 *    Sets task as checked or unchecked
 *    requires: {
 *      uid: string,
 *      name: string
 *    }
 */
export const setTaskChecked = catchErrors(async (req, res) => {
  const { uid, name } = req.body;
  console.log(uid, name);

  let userDoc = await db.collection("users").doc(uid);

  let doc = await userDoc.get();
  if (doc.exists) {
    const user = doc.data();
    if (user?.tasks[name] === undefined || !user) {
      throw new CustomError(
        "Failed to check task",
        400,
        `User does not have a task of that name`,
        "The task does not exist"
      );
    }
    user.tasks[name].checked = !user.tasks[name].checked;

    userDoc.set(user);
    return res.status(200).json({ name });
  } else {
    throw new CustomError(
      "Failed to find user with provided id",
      404,
      `Did not find a user matching id: ${uid}`,
      "Failed to check task"
    );
  }
}, "Failed to check/un-check task");
