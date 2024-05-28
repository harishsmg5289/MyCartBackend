const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { app, User, JWT_SECRET } = require("./app");

app.post("/login-user", async (req, res) => {
  const { email, password } = req.body;
  const oldUser = await User.findOne({ email: email });
  if (!oldUser) {
    res.send({ data: "User does not exists!!" });
  }
  if (await bcrypt.compare(password, oldUser.password)) {
    const token = jwt.sign({ email: oldUser.email }, JWT_SECRET);
    if (res.status(201)) {
      res.send({ data: token, status: "Login successfull" });
    } else {
      res.send({ error: "error" });
    }
  }
});
