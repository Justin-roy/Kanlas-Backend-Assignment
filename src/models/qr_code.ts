import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "QrCode is required"],
    },
    
  },

  {
    timestamps: true,
  }
);

export const QrCode = mongoose.model("QrCode", schema);
