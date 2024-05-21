import mongoose from "mongoose";
import validator from 'validator';

const schema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: [true, "Email is already registered"],
      required: [true, "Email is required"],
      validate: validator.default.isEmail,
    },
    phone: {
      type: Number,
      required: [true, "phone number is required"],
    },
    coin: {
      type: Number,
      default: 0,
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },

  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", schema);
