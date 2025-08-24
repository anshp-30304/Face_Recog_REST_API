const express = require("express");
const { getUsers, deleteUser } = require("../controllers/adminController");
const { protect, isAdmin } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/users", protect, isAdmin, getUsers);
router.delete("/users/:id", protect, isAdmin, deleteUser);

module.exports = router;
