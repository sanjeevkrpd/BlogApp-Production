const express = require("express");
const {
  getAllUsers,
  registerController,
  loginController,
} = require("../controllers/userControllers");

// router object
const router = express.Router();

// GET Method get ALlUsers
router.get("/all-users", getAllUsers);

// POST || Register
router.post("/register", registerController);
// POST || Login
router.post("/login", loginController);

module.exports = router;
