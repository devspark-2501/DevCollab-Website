import mongoose from "mongoose";
// important to import

const OtpSchema = new mongoose.Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 300 }, // auto-delete after 5 min
});

const Otp = mongoose.models.Otp || mongoose.model("Otp", OtpSchema);
export default Otp;
