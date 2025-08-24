const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { compareFace } = require("../utils/faceRecognition");

exports.register = async (req, res) => {
  const { username, password, faceData } = req.body;
  if (!username || !password || !faceData)
    return res.status(400).json({ error: "All fields required" });

  try {
    const existing = await User.findOne({ username });
    if (existing)
      return res.status(400).json({ error: "Username already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, faceData });
    await user.save();
    res.json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "All fields required" });

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: "Invalid username" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ message: "Password correct. Please verify face.", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.verifyFace = async (req, res) => {
  try {
    const { username, faceData } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: "User not found" });

    const isMatch = compareFace(user.faceData, faceData);
    if (isMatch) {
      res.json({ message: "Face verified! Login successful." });
    } else {
      res.status(400).json({ error: "Face not recognized" });
    }

    res.json({ message: "✅ Login successful" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
