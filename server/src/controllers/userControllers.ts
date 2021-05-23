import { catchErrors } from "../errors/catchErrors";
import { db } from "../db";
import CustomError from "../errors/customError";

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
  const uid = req.query.uid as string;

  let userDoc = await db.collection("users").doc(uid);

  userDoc
    .get()
    .then((doc) => {
      if (doc.exists) {
        return res.json(doc.data);
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
