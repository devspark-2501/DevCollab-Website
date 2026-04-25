import mongoose, { models, Schema } from "mongoose";

const PostSchema = new Schema({
  userEmail: {
    type: String,
    required: true,
    trim: true,
  },
  userName: {
    type: String,
    required: true,
    trim: true,
  },
  userContent: {
    type: String,
    required: true,
    trim: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Post = models.Post || mongoose.model("Post", PostSchema);
export default Post;