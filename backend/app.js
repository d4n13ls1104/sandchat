const express = require('express');
const path = require('path');
const cookieParser = require("cookie-parser");

const indexRouter = require("./routes/index");
const userRouter = require("./routes/user");

const app = express();

const port = process.env.PORT || 80;

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static(path.join(__dirname, "public")));

app.use("/user", userRouter);
app.use('/', indexRouter);

app.listen(port, () => console.log(`Server listening on port ${port}`));
