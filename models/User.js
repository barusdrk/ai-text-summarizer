const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    theme: {
      type: String,
      enum: ["light", "dark"],
      default: "light",
    },

    summaries: [
      {
        originalText: String,
        summary: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
