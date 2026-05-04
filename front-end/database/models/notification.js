import mongoose, { models, Schema } from "mongoose";

const NotificationSchema = new Schema({
  toEmail:   { type: String, required: true, index: true }, // who receives it
  fromName:  { type: String, required: true },              // who triggered it
  fromEmail: { type: String, required: true },
  type:      { type: String, enum: ["like", "comment"], required: true },
  postId:    { type: String, required: true },
  postSnippet: { type: String },                            // first 60 chars of post
  read:      { type: Boolean, default: false },
}, { timestamps: true });

const Notification = models.Notification || mongoose.model("Notification", NotificationSchema);
export default Notification;