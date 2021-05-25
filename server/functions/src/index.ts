import * as functions from "firebase-functions";

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { userRouter } from "./routes";
import { handleError, logRequests } from "./middleware";

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use("/api", logRequests);
app.use("/api/users", userRouter);
app.use("/api", handleError);
const port = 3000;

app.listen(port);
console.log(`server is listening on ${port}`);

exports.app = functions.https.onRequest(app);
