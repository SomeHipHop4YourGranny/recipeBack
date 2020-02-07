import mongoose, { Schema } from "mongoose";

const schema = new Schema(
  {
    title: {
      type: String,
      require: true,
      unique: true
    },
    author: {
      type: Schema.Types.ObjectId,

      ref: "User"
    }
  },

  {
    timestamps: true
  }
);

export default mongoose.model("Category", schema);
