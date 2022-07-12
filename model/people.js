// external package
const express = require("express");
const mongoose = require("mongoose");

// creating user model
const peopleSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    mobile: {
      type: String,
      required: true,
    },

    avatar: {
      type: String,
    },

    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },

    password: {
      type: String,
    },
  },

  {
    timestamps: true,
  }
);

const People = new mongoose.model("people", peopleSchema);
module.exports = {
  People,
};
