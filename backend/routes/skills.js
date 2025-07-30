const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

// Get all skill categories
router.get("/categories", async (req, res) => {
  try {
    const categories = [
      "Programming",
      "Design",
      "Art & Music",
      "Language Learning",
      "Cooking & Baking",
      "Public Speaking",
      "Photography & Videography",
      "Health & Fitness",
      "Writing & Blogging",
      "Personal Development",
    ];
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get popular skills
router.get("/popular", async (req, res) => {
  try {
    const users = await User.find({ isProfileComplete: true }).select(
      "skillsOffered"
    );

    const skillCount = {};
    users.forEach((user) => {
      user.skillsOffered.forEach((skill) => {
        if (skillCount[skill.skill]) {
          skillCount[skill.skill]++;
        } else {
          skillCount[skill.skill] = 1;
        }
      });
    });

    const popularSkills = Object.entries(skillCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 20)
      .map(([skill, count]) => ({ skill, count }));

    res.json(popularSkills);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get skills by category
router.get("/category/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const users = await User.find({
      isProfileComplete: true,
      "skillsOffered.category": category,
    }).select("name location skillsOffered rating");

    const skillsInCategory = [];
    users.forEach((user) => {
      user.skillsOffered.forEach((skill) => {
        if (skill.category === category) {
          skillsInCategory.push({
            skill: skill.skill,
            level: skill.level,
            experience: skill.experience,
            teacher: {
              id: user._id,
              name: user.name,
              location: user.location,
              rating: user.rating,
            },
          });
        }
      });
    });

    res.json(skillsInCategory);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Add skill to user's offered skills
router.post("/add-offered", auth, async (req, res) => {
  try {
    const { skill, category, experience, level } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if skill already exists
    const existingSkill = user.skillsOffered.find(
      (s) => s.skill.toLowerCase() === skill.toLowerCase()
    );
    if (existingSkill) {
      return res.status(400).json({ message: "Skill already exists" });
    }

    user.skillsOffered.push({
      skill,
      category,
      experience: experience || 1,
      level: level || "basic",
      verified: false,
    });

    await user.save();
    res.json(user.skillsOffered);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Remove skill from user's offered skills
router.delete("/remove-offered/:skillId", auth, async (req, res) => {
  try {
    const { skillId } = req.params;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.skillsOffered = user.skillsOffered.filter(
      (skill) => skill._id.toString() !== skillId
    );
    await user.save();

    res.json(user.skillsOffered);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Add skill to user's wanted skills
router.post("/add-wanted", auth, async (req, res) => {
  try {
    const { skill, category } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if skill already exists
    const existingSkill = user.skillsWanted.find(
      (s) => s.skill.toLowerCase() === skill.toLowerCase()
    );
    if (existingSkill) {
      return res
        .status(400)
        .json({ message: "Skill already exists in wanted list" });
    }

    user.skillsWanted.push({
      skill,
      category,
    });

    await user.save();
    res.json(user.skillsWanted);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Remove skill from user's wanted skills
router.delete("/remove-wanted/:skillId", auth, async (req, res) => {
  try {
    const { skillId } = req.params;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.skillsWanted = user.skillsWanted.filter(
      (skill) => skill._id.toString() !== skillId
    );
    await user.save();

    res.json(user.skillsWanted);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Verify skill (admin or self-verification)
router.put("/verify/:skillId", auth, async (req, res) => {
  try {
    const { skillId } = req.params;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const skill = user.skillsOffered.id(skillId);
    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    skill.verified = true;
    await user.save();

    res.json({ message: "Skill verified successfully", skill });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Search skills
router.get("/search", async (req, res) => {
  try {
    const { q, category, level, location } = req.query;

    const query = { isProfileComplete: true };

    if (q) {
      query["skillsOffered.skill"] = { $regex: q, $options: "i" };
    }

    if (category) {
      query["skillsOffered.category"] = category;
    }

    if (level) {
      query["skillsOffered.level"] = level;
    }

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    const users = await User.find(query)
      .select("name location skillsOffered rating")
      .limit(50);

    const results = [];
    users.forEach((user) => {
      user.skillsOffered.forEach((skill) => {
        let matches = true;

        if (q && !skill.skill.toLowerCase().includes(q.toLowerCase())) {
          matches = false;
        }
        if (category && skill.category !== category) {
          matches = false;
        }
        if (level && skill.level !== level) {
          matches = false;
        }

        if (matches) {
          results.push({
            skill: skill.skill,
            category: skill.category,
            level: skill.level,
            experience: skill.experience,
            verified: skill.verified,
            teacher: {
              id: user._id,
              name: user.name,
              location: user.location,
              rating: user.rating,
            },
          });
        }
      });
    });

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
