import mongoose, { models, Schema } from "mongoose";

const CommentSchema = new Schema({
  userEmail: { type: String, required: true, trim: true },
  userName:  { type: String, required: true, trim: true },
  text:      { type: String, required: true, trim: true },
}, { timestamps: true });

const PostSchema = new Schema(
  {
    userEmail: {
      type:     String,
      required: true,
      trim:     true,
      index:    true,
    },
    userName: {
      type:     String,
      required: true,
      trim:     true,
    },
    // text content — now optional if image is provided
    userContent: {
      type:    String,
      trim:    true,
      default: "",
    },
    // image stored as base64 data URL  e.g. "data:image/png;base64,..."
    image: {
      type:    String,
      default: null,
    },
    // original filename for display
    imageName: {
      type:    String,
      default: null,
    },
    likes: {
      type:    Number,
      default: 0,
    },
    likedBy: [{ type: String }],
    comments: [CommentSchema],
  },
  { timestamps: true }
);

const Post = models.Post || mongoose.model("Post", PostSchema);
export default Post;