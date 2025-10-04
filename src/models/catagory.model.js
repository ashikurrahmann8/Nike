import mongoose, { Schema } from "mongoose";

const category = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    subcategories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Subcategory",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Category = mongoose.models.Category || mongoose.model("Category", category);
