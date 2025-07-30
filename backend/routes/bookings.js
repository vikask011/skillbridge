const express = require("express");
const Booking = require("../models/Booking");
const User = require("../models/User");
const auth = require("../middleware/auth");
const Review = require("../models/Review");

const router = express.Router();

// Create booking
router.post("/", auth, async (req, res) => {
  try {
    const { teacherId, skill, category, scheduledDate, message } = req.body;

    const booking = new Booking({
      learner: req.userId,
      teacher: teacherId,
      skill,
      category,
      scheduledDate: new Date(scheduledDate),
      message,
    });

    await booking.save();
    await booking.populate(["learner", "teacher"]);

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get user bookings
router.get("/my-bookings", auth, async (req, res) => {
  try {
    const { type } = req.query; // 'teaching' or 'learning'

    let query = {};
    if (type === "teaching") {
      query.teacher = req.userId;
    } else if (type === "learning") {
      query.learner = req.userId;
    } else {
      query = {
        $or: [{ teacher: req.userId }, { learner: req.userId }],
      };
    }

    const bookings = await Booking.find(query)
      .populate("learner", "name email avatar")
      .populate("teacher", "name email avatar")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update booking status
router.put("/:id/status", auth, async (req, res) => {
  try {
    const { status, meetingLink } = req.body;

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Only teacher can accept/reject
    if (booking.teacher.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    booking.status = status;
    if (meetingLink) {
      booking.meetingLink = meetingLink;
    }

    await booking.save();
    await booking.populate(["learner", "teacher"]);

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

//update link
router.put("/:id/link", auth, async (req, res) => {
  try {
    const { link } = req.body;

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Only teacher can accept/reject
    if (booking.teacher.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    booking.meetingLink = link;

    await booking.save();
    await booking.populate(["learner", "teacher"]);

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Complete session
router.put("/:id/complete", auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Only teacher can mark as complete
    if (booking.teacher.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    booking.status = "completed";
    booking.pointsEarned = Math.ceil(booking.duration / 60); // 1 point per hour

    await booking.save();

    // Update teacher points
    await User.findByIdAndUpdate(booking.teacher, {
      $inc: { points: booking.pointsEarned },
    });

    // Deduct learner points
    await User.findByIdAndUpdate(booking.learner, {
      $inc: { points: -booking.pointsEarned },
    });

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/reviews", auth, async (req, res) => {
  try {
    const { booking, reviewer, reviewee, rating, comment, type } = req.body;

    const review = new Review({
      booking: booking,
      reviewer: reviewer,
      reviewee: reviewee,
      rating,
      comment: comment,
      type: type,
    });

    await review.save();

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
