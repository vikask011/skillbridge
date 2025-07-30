const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

// Get user profile
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update profile
router.put("/profile", auth, async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { ...updates, isProfileComplete: true },
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Search users by skills
router.get("/search", auth, async (req, res) => {
  try {
    const { skill, category, location } = req.query;

    const query = {
      _id: { $ne: req.userId },
      isProfileComplete: true,
    };

    if (skill) {
      query["skillsOffered.skill"] = { $regex: skill, $options: "i" };
    }

    if (category) {
      query["skillsOffered.category"] = category;
    }

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    const users = await User.find(query).select("-password").limit(20);

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get user by ID
router.get("/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
