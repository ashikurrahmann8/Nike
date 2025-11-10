import mongoose, { Schema } from "mongoose";

const category = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,

      unique: true,
    },
    image: {
      url: {
        type: String,
      },
      public_id: {
        type: String,
      },
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
