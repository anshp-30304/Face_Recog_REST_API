const express = require("express");
const { register, login, verifyFace } = require("../controllers/authController");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify-face", verifyFace);

module.exports = router;
