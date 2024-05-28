const express = require("express");
const app = express();
exports.app = app;
const mongoose = require("mongoose");
app.use(express.json());
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoUrl =
  "mongodb+srv://harishsmg5289:AstTzbwIXzNBQIHc@mycart.fkck7bs.mongodb.net/?retryWrites=true&w=majority&appName=mycart";

const JWT_SECRET = "DSFDSFSDFSDFSDFSDFSDFSDFSDFSDFSDFDSFWERWE";

exports.JWT_SECRET = JWT_SECRET;

mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("Database Connected");
  })
  .catch((e) => {
    console.log(e);
  });

require("./schema/Users/UserDetails");
const User = mongoose.model("UserInfo");
exports.User = User;

app.get("/", (req, res) => {
  res.send("Harish");
});

app.post("/register", async (req, res) => {
  console.log("register api called");
  const { name, email, mobile, password } = req.body;
  const oldUser = await User.findOne({ email: email });
  if (oldUser) {
    return res.send({ data: oldUser.name + " User is already exists!!" });
  }
  const encryptPassword = await bcrypt.hash(password, 10);
  try {
    await User.create({
      name: name,
      email: email,
      mobile: mobile,
      password: encryptPassword,
    });
    console.log("User Created");
    res.send({ status: "ok", data: "User Created" });
  } catch (error) {
    res.send({ status: "error", data: error });
  }
});

app.post("/login-user", async (req, res) => {
  const { email, password } = req.body;
  const oldUser = await User.findOne({ email: email });
  if (!oldUser) {
    res.send({ data: "User does not exists!!" });
  }
  if (await bcrypt.compare(password, oldUser.password)) {
    const token = jwt.sign({ email: oldUser.email }, JWT_SECRET);
    if (res.status(201)) {
      res.send({ status: "ok", data: token });
    } else {
      res.send({ status: "error", data: "Please enter valid Email/Password" });
    }
  }
});

app.post("/user-details", (req, res) => {
  const { token } = req.body;
  try {
    const user = jwt.verify(token, JWT_SECRET);
    const userEmail = user.email;
    User.findOne({ email: userEmail }).then((response) => {
      return res.send({ status: "ok", data: response });
    });
  } catch (error) {
    res.send({ error });
  }
});

app.listen(9000, () => {
  console.log("Node js server started");
});
