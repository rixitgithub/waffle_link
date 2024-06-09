const express = require("express");
const Ngo = require("../models/NGO");

const router = express.Router();

router.post("/create", async (req, res) => {
  try {
    const ngoData = req.body;
    const newNgo = new Ngo(ngoData);
    const savedNgo = await newNgo.save();
    res.status(201).json(savedNgo);
  } catch (error) {
    console.error("Error creating NGO:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
