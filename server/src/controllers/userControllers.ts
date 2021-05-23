import { catchErrors } from "../errors/catchErrors";
import { db } from "../db";

export const createUser = catchErrors(async (req, res) => {
  const user = req.body;

  let userDoc = await db.collection("users").doc(user.uid);

  userDoc.set({
    isAnonymous: user.isAnonymous,
    tasks: [],
  });

  res.json("done");
}, "Failed to create user");

export const getUserTasks = catchErrors(async (req, res) => {
  const { uid } = req.body;

  let userDoc = await db.collection("users").doc(uid);

  userDoc
    .get()
    .then((doc) => {
      if (doc.exists) {
        console.log(doc.data);
      } else {
        console.log("No such user");
      }
    })
    .catch((e) => {
      console.log(e);
    });
}, "Failed to get users tasks");
