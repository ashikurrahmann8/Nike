import mongoose, { Schema } from "mongoose";

const subcategory = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Subcategory =
  mongoose.models.Subcategory || mongoose.model("Subcategory", subcategory);
