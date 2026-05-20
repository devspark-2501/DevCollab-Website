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
    notifications: [
      {
        fromName:    { type: String },
        fromEmail:   { type: String },
        type:        { type: String, enum: ["like", "comment", "follow"] },
        postId:      { type: String },
        postSnippet: { type: String },
        read:        { type: Boolean, default: false },
        createdAt:   { type: Date,    default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const User = models.User || mongoose.model("User", UserSchema);
export default User;