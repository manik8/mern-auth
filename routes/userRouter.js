const router = require("express").Router();
const User = require("../model/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  try {
    let { email, password, passwordCheck, displayName } = req.body;

    if (!email || !password || !passwordCheck) {
      return res.status(400).json({ msg: "Not all fields have been entered." });
    }

    if (password.length < 5) {
      return res
        .status(400)
        .json({ msg: "The password needs to be atleast 5 characters long." });
    }

    if (password !== passwordCheck) {
      return res
        .status(400)
        .json({ msg: "Enter the same password twice for verification." });
    }

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res
        .status(400)
        .json({ msg: "An account with this email already exists." });
    }
    if (!displayName) {
      displayName = email;
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: passwordHash,
      displayName,
    });
    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).json(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Not all fields have been entered." });
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      return res
        .status(400)
        .json({ msg: "No Account with this email has been registered." });
    }
    const isMatched = await bcrypt.compare(password, user.password);

    if (!isMatched) {
      return res.status(400).json({ msg: "Invalid Credentials." });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({
      token,
      user: {
        id: user._id,
        displayName: user.displayName,
        email: user.email,
      },
    });
    console.log(token);
  } catch (err) {
    console.error(err.message);
    res.status(500).json(err);
  }
});

module.exports = router;
