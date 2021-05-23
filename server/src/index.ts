import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { userRouter } from "./routes";
import { logRequests } from "./middleware";

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use("/api", logRequests);
app.use("/api/users", userRouter);

const port = 3000;

app.listen(port);
console.log(`server is listening on ${port}`);
