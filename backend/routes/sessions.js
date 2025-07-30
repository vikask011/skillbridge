const express = require("express");
const Booking = require("../models/Booking");
const User = require("../models/User");
const Review = require("../models/Review");
const auth = require("../middleware/auth");
const mongoose = require("mongoose"); // Import mongoose

const router = express.Router();

// Get active sessions
router.get("/active", auth, async (req, res) => {
  try {
    const now = new Date();
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

    const activeSessions = await Booking.find({
      $or: [{ teacher: req.userId }, { learner: req.userId }],
      status: "accepted",
      scheduledDate: {
        $gte: now,
        $lte: oneHourFromNow,
      },
    })
      .populate("teacher", "name email avatar")
      .populate("learner", "name email avatar")
      .sort({ scheduledDate: 1 });

    res.json(activeSessions);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get upcoming sessions
router.get("/upcoming", auth, async (req, res) => {
  try {
    const now = new Date();

    const upcomingSessions = await Booking.find({
      $or: [{ teacher: req.userId }, { learner: req.userId }],
      status: "accepted",
      scheduledDate: { $gt: now },
    })
      .populate("teacher", "name email avatar")
      .populate("learner", "name email avatar")
      .sort({ scheduledDate: 1 })
      .limit(10);

    res.json(upcomingSessions);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get session history
router.get("/history", auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, type } = req.query;

    let query = {
      $or: [{ teacher: req.userId }, { learner: req.userId }],
      status: "completed",
    };

    if (type === "teaching") {
      query = { teacher: req.userId, status: "completed" };
    } else if (type === "learning") {
      query = { learner: req.userId, status: "completed" };
    }

    const sessions = await Booking.find(query)
      .populate("teacher", "name email avatar")
      .populate("learner", "name email avatar")
      .sort({ updatedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Booking.countDocuments(query);

    res.json({
      sessions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Start session (generate meeting link)
router.post("/:bookingId/start", auth, async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Only teacher or learner can start the session
    if (
      booking.teacher.toString() !== req.userId &&
      booking.learner.toString() !== req.userId
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (booking.status !== "accepted") {
      return res.status(400).json({ message: "Session is not accepted" });
    }

    // ✅ Only generate meeting link if it doesn't exist
    if (!booking.meetingLink) {
      const meetingId = Math.random().toString(36).substring(2, 15);
      booking.meetingLink = `https://meet.google.com/${meetingId}`;
      await booking.save();
    }

    await booking.populate(["teacher", "learner"]);

    res.json({
      message: "Session started successfully",
      meetingLink: booking.meetingLink,
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// End session
router.post("/:bookingId/end", auth, async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { actualDuration } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Only teacher can end the session
    if (booking.teacher.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "Only teacher can end the session" });
    }

    if (booking.status !== "accepted") {
      return res.status(400).json({ message: "Session is not active" });
    }

    // Update booking status and duration
    booking.status = "completed";
    if (actualDuration) {
      booking.duration = actualDuration;
    }
    booking.pointsEarned = Math.ceil(booking.duration / 60); // 1 point per hour

    await booking.save();

    // Update points
    await User.findByIdAndUpdate(booking.teacher, {
      $inc: { points: booking.pointsEarned },
    });
    await User.findByIdAndUpdate(booking.learner, {
      $inc: { points: -booking.pointsEarned },
    });

    await booking.populate(["teacher", "learner"]);

    res.json({
      message: "Session ended successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get session details
router.get("/:bookingId", auth, async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId)
      .populate("teacher", "name email avatar location rating")
      .populate("learner", "name email avatar location rating");

    if (!booking) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Only participants can view session details
    if (
      booking.teacher._id.toString() !== req.userId &&
      booking.learner._id.toString() !== req.userId
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Add session notes (for teacher)
router.post("/:bookingId/notes", auth, async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { notes } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Only teacher can add notes
    if (booking.teacher.toString() !== req.userId) {
      return res.status(403).json({ message: "Only teacher can add notes" });
    }

    booking.teacherNotes = notes;
    await booking.save();

    res.json({ message: "Notes added successfully", notes });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Submit session review
router.post("/:bookingId/review", auth, async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { rating, comment } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (booking.status !== "completed") {
      return res
        .status(400)
        .json({ message: "Can only review completed sessions" });
    }

    // Determine reviewer and reviewee
    let reviewee, type;
    if (booking.teacher.toString() === req.userId) {
      reviewee = booking.learner;
      type = "learner";
    } else if (booking.learner.toString() === req.userId) {
      reviewee = booking.teacher;
      type = "teacher";
    } else {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({
      booking: bookingId,
      reviewer: req.userId,
    });

    if (existingReview) {
      return res.status(400).json({ message: "Review already submitted" });
    }

    // Create review
    const review = new Review({
      booking: bookingId,
      reviewer: req.userId,
      reviewee,
      rating,
      comment,
      type,
    });

    await review.save();

    // Update user's average rating
    const userReviews = await Review.find({ reviewee });
    const avgRating =
      userReviews.reduce((sum, r) => sum + r.rating, 0) / userReviews.length;

    await User.findByIdAndUpdate(reviewee, {
      "rating.average": avgRating,
      "rating.count": userReviews.length,
    });

    res.json({ message: "Review submitted successfully", review });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get session reviews
router.get("/:bookingId/reviews", auth, async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Only participants can view reviews
    if (
      booking.teacher.toString() !== req.userId &&
      booking.learner.toString() !== req.userId
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const reviews = await Review.find({ booking: bookingId })
      .populate("reviewer", "name avatar")
      .populate("reviewee", "name avatar");

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get session statistics
router.get("/stats/overview", auth, async (req, res) => {
  try {
    const userId = req.userId;

    // Teaching stats
    const teachingStats = await Booking.aggregate([
      { $match: { teacher: mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalPoints: { $sum: "$pointsEarned" },
        },
      },
    ]);

    // Learning stats
    const learningStats = await Booking.aggregate([
      { $match: { learner: mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalPointsSpent: { $sum: "$pointsEarned" },
        },
      },
    ]);

    // Recent activity
    const recentSessions = await Booking.find({
      $or: [{ teacher: userId }, { learner: userId }],
      status: "completed",
    })
      .populate("teacher", "name")
      .populate("learner", "name")
      .sort({ updatedAt: -1 })
      .limit(5);

    res.json({
      teaching: teachingStats,
      learning: learningStats,
      recentSessions,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
