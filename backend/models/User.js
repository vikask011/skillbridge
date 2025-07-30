const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      // required: true,
    },
    age: {
      type: Number,
      // required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      // required: true,
    },
    location: {
      type: String,
      // required: true,
    },
    bio: {
      type: String,
      default: "",
    },
    avatar: {
      type: String,
      default: "",
    },
    skillsOffered: [
      {
        skill: String,
        category: String,
        experience: Number,
        level: {
          type: String,
          enum: ["basic", "intermediate", "expert"],
          default: "basic",
        },
        verified: {
          type: Boolean,
          default: false,
        },
      },
    ],
    skillsWanted: [
      {
        skill: String,
        category: String,
      },
    ],
    points: {
      type: Number,
      default: 1,
    },
    rating: {
      average: {
        type: Number,
        default: 4.2,
      },
      count: {
        type: Number,
        default: 2,
      },
    },
    availability: [
      {
        day: String,
        timeSlots: [String],
      },
    ],
    isProfileComplete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
