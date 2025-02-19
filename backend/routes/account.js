const express = require("express");
const { authMiddleware } = require("../middleware");
const { Account } = require("../db");
const { default: mongoose } = require("mongoose");

const router = express.Router();

router.get("/balance", authMiddleware, async (req, res) => {
  try {
    const accntinfo = await Account.findOne({ userId: req.userId });
    res.json({
      balance: accntinfo.balance,
    });
  } catch (error) {
    res.json({
      msg: "Internal Server Error",
    });
  }
});

router.post("/transfer", authMiddleware, async (req, res) => {
  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    const { amount, to } = req.body;

    const account = await Account.findOne({ userId: req.userId }).session(
      session
    );

    if (account.balance < amount) {
      await session.abortTransaction();
      return res.json({
        msg: "Insufficient Balance",
      });
    }
    const toAccount = await Account.findOne({ userId: to }).session(session);
    if (!toAccount) {
      await session.abortTransaction();
      return res.json({
        msg: "Invalid Account",
      });
    }

    await Account.updateOne(
      {
        userId: req.userId,
      },
      {
        $inc: {
          balance: -amount,
        },
      }
    ).session(session);

    await Account.updateOne(
      {
        userId: to,
      },
      {
        $inc: {
          balance: amount,
        },
      }
    ).session(session);

    await session.commitTransaction();
    res.json({
      msg: "Transaction Successful",
    });
  } catch (error) {
    res.json({
      msg: "Internal Server Error",
    });
  }
});

module.exports = router;
