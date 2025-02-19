const express = require("express");
const { createUser, loginUser } = require("../types");
const { User } = require("../db");
const bcrypt = require("bcryptjs");
const app = express();

app.use(express.json());

const port = 3000;
const saltRounds = 10;

app.post("/signup", async (req, res) => {
  try {
    const payload = req.body;
    const payloadData = createUser.safeParse(payload);

    console.log(payloadData);
    if (!payloadData.success) {
      return res.status(400).json({
        msg: "Validation Failed",
        errors: payloadData.error.errors, // Detailed error messages
      });
    }

    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(payload.password, salt);

    console.log(hashedPassword);
    const newUser = new User({
      username: payload.username,
      password: hashedPassword,
      firstname: payload.firstname,
      lastname: payload.lastname,
    });

    const savedUser = await newUser.save();
    res.send({ msg: "User Data Received", savedUser });
  } catch (err) {
    console.log("Error Ocurring :", err.message);
    res.send({ msg: "Internal server Error" });
  }
});

app.get("/signin", async (req, res) => {
  try {
    const payload = req.body;
    const payloadData = loginUser.safeParse(payload);
    console.log(payloadData);
    if (!payloadData.success) {
      return res.status(400).json({
        msg: "Validation Failed",
        errors: payloadData.error.errors, // Detailed error messages
      });
    }
    const foundElement = await User.findOne({ username: payload.username });
    if (foundElement) {
      const isMatch = bcrypt.compareSync(
        payload.password,
        foundElement.password
      );
      if (isMatch) {
        res.status(200).json({ msg: "Logged in Successfully!!" });
      } else {
        res.status(400).json({ msg: "Invalid Credentials" });
      }
    } else {
      res.status(400).json({ msg: "Invalid Credentials" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ msg: "Internal Server Error" });
  }
});

app.put("/updateprofile", (req, res) => {});

app.listen(3000, () => {
  console.log(`Example App is running at ${3000} port`);
});
