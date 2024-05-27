const express = require("express");
const app = express();
const mongoose = require("mongoose");
app.use(express.json());

const mongoUrl =
  "mongodb+srv://harishsmg5289:AstTzbwIXzNBQIHc@mycart.fkck7bs.mongodb.net/?retryWrites=true&w=majority&appName=mycart";

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
  try {
    await User.create({
      name: name,
      email: email,
      mobile: mobile,
      password: password,
    });
    console.log("User Created");
    res.send({ status: "ok", data: "User Created" });
  } catch (error) {
    res.send({ status: "error", data: error });
  }
});

app.listen(9000, () => {
  console.log("Node js server started");
});
