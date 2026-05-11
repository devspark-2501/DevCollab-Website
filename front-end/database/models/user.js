import mongoose, { models, Schema } from "mongoose";

const UserSchema = new Schema(
  {
    username: {
      type:     String,
      required: true,
      unique:   true,
      trim:     true,
    },
    email: {
      type:     String,
      required: true,
      unique:   true,
      trim:     true,
    },
    password: {
      type:     String,
      required: true,
    },
    followers: [{ type: String }],
    following: [{ type: String }],
  },
  { timestamps: true }
);

const User = models.User || mongoose.model("User", UserSchema);
export default User;