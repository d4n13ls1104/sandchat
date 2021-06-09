import express, { json, urlencoded, static as _static} from "express";
import { join } from "path";
import cookieParser from "cookie-parser";

import indexRouter from "./routes/index";
import userRouter from "./routes/user";

import whitelist from "./middleware/whitelist";
import auth from "./middleware/sand-auth";

const app = express();

const port = process.env.PORT || 80;

app.use(whitelist);
app.use(cookieParser());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(_static(join(__dirname, "public")));

app.use("/user", userRouter);
app.use("/", auth, indexRouter);

app.listen(port, () => console.log(`Server listening on port ${port}`));
