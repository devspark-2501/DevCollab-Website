import mongoose, { models, Schema } from "mongoose";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    
    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    // array of emails this user follows
    following: [{ type: String }],
    
    // array of emails following this user
    followers: [{ type: String }],
  },
  { timestamps: true }
);

const User = models.User || mongoose.model("User", UserSchema);
export default User;