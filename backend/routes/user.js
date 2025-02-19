const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { createUser, loginUser, updateUser } = require("../Mine/types");
const { User, Account } = require("../db");
const { JWT_SECRET } = require("../config");
const { authMiddleware } = require("../middleware");

router.post("/signup", async (req, res) => {
  try {
    const { success } = createUser.safeParse(req.body);
    console.log(success);
    if (!success) {
      return res.status(411).json({
        msg: "Please the data in the right format",
      });
    }
    const user = await User.findOne({
      username: req.body.username,
    });

    if (user?._id) {
      return res.status(200).send({
        msg: "Email Already taken!!",
      });
    }

    const dbUser = await User.create(req.body);

    const userId = dbUser._id;

    await Account.create({
      userId,
      balance: 1 + Math.random() * 10000,
    });
    const token = jwt.sign(
      {
        userId,
      },
      JWT_SECRET,
      {
        noTimestamp: true,
      }
    );
    return res.status(200).json({
      msg: "Singup Successfull",
      token,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { success } = loginUser.safeParse(req.body);

    if (!success) {
      res.json({
        msg: "Please the data in the right format",
      });
      return;
    }

    const user = await User.findOne({
      username: req.body.username,
      password: req.body.password,
    });

    if (user) {
      const token = jwt.sign(
        {
          userId: user._id,
        },
        JWT_SECRET,
        {
          noTimestamp: true,
        }
      );
      res.json({
        msg: "Login Successfully",
        token,
      });
      return;
    }
    return res.json({
      msg: "Please Check Email/ Password",
    });
  } catch (error) {
    res.json({
      msg: "Internal Server Error",
    });
  }
});

router.put("/", authMiddleware, async (req, res) => {
  try {
    const { success } = updateUser.safeParse(req.body);
    if (!success) {
      res.json({
        msg: "Please send the data in the right format!",
      });
    }

    await User.updateOne(
      {
        _id: req.userId,
      },
      req.body
    );
    res.json({
      msg: "Updated Successfully",
    });
  } catch (error) {
    res.json({
      msg: "Internal Server Error",
    });
  }
});

router.get("/bulk", async (req, res) => {
  const filter = req.query.filter || "";

  const users = await User.find({
    $or: [
      {
        firstname: {
          $regex: filter,
        },
      },
      {
        lastname: {
          $regex: filter,
        },
      },
    ],
  });

  console.log(users);
  
  res.json({
    user: users.map((user) => ({
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
      _id: user._id,
    })),
  });
});
module.exports = router;
