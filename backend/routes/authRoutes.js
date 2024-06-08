const express = require("express");
const router = express.Router();
const { register, loginUser } = require("../controller/authControllers.js");

// Register route
console.log("route");
router.post("/register", register);

// Login route
router.post("/login", loginUser);

module.exports = router;
