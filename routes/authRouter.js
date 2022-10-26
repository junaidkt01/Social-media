const express = require("express");
const User = require("../models/User");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../keyValues");
const Authentication = require("../middleware/Authentication");

// i added users route name
router.get("/", async (req, res) => {
  const user = await User.find();
  res.json(user);
});

// sign up
router.post("/signup", (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      return res.json({ message: "you should fill the form" });
    }

    User.findOne({ email: email }).then((savedUser) => {
      if (savedUser) {
        return res.json({ error: "this user has already existed" });
      } else {
        bcrypt.hash(password, 12).then((hashedPassword) => {
          const user = new User({
            name,
            email,
            password: hashedPassword,
          });
          user
            .save()
            .then((user) => {
              res.json({ message: "saved successfully" });
              console.log(user);
            })
            .catch((err) => {
              res.json(err);
            });
        });
      }
    });
  } catch (err) {
    console.log(err);
    console.log("err");
    res.json(err);
  }
});

/////////////////////////////////////////

//sign in

router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({ error: "Please add email or password" });
  }
  User.findOne({ email: email }).then((savedUser) => {
    if (!savedUser) {
      return res.status(422).json({ error: "Invalid email or password" });
    }
    bcrypt
      .compare(password, savedUser.password)
      .then((doMatch) => {
        if (doMatch) {
          // return res.json({ message: "successfully signed in" });

          const token = jwt.sign({ id: savedUser._id }, JWT_SECRET);
          const { _id, name, email } = savedUser;
          res.json({
            token,
            user: { _id, name, email },
            message: "successfully Signed in",
          });
        } else {
          return res.status(422).json({ error: "Invalid email or password" });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

/////////////////////////////////////////

module.exports = router;
