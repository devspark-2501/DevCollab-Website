import mongoose, { models, Schema } from "mongoose";

const CommentSchema = new Schema({
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
  text: {
    type: String,
    required: true,
    trim: true,
  },
}, { timestamps: true });

const PostSchema = new Schema(
  {
    userEmail: {
      type: String,
      required: true,
      trim: true,
      index: true,
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

    likedBy: [
      {
        type: String, // store user email
      },
    ],


    comments: [CommentSchema],
  },
  { timestamps: true }
);

const Post = models.Post || mongoose.model("Post", PostSchema);

export default Post;