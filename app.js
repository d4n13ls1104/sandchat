const express = require('express');
const path = require('path');
const indexRouter = require("./routes/index");
const userRouter = require("./routes/user");
const app = express();

const port = process.env.PORT || 80;

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static(path.join(__dirname, "public")));

app.use('/', indexRouter);
app.use("/user", userRouter);

app.listen(port, () => console.log(`Server listening on port ${port}`));