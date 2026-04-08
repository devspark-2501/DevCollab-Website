import mongoose, { models, Schema } from "mongoose";

const UserSchema = new Schema(
    {
        name: {
            type: String, 
            required: true
        },

        email: {
            type: String, 
            required: true
        },

        password: {
            type: String,
            required: true
        },
    },
    { timestamps: true }
);

const User = models.User || mongoose.model('User', UserSchema);

export default User; 