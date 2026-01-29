import mongoose, { Schema } from "mongoose";

const groupSchema = new Schema(
  {
    name: {
      type: string,
      required: true,
    },
    description: {
      type: string,
    },
    image: {
      url: {
        type: string,
      },
      public_id: {
        type: string,
      },
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Group = mongoose.models.Group || mongoose.model("Group", groupSchema);
