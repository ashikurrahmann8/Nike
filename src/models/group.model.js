import mongoose, { Schema } from "mongoose";

const groupSchema = new Schema(
  {
    name: {
      type: string,
     
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
