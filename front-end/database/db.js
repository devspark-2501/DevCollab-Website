import mongoose from "mongoose"
// make sure mongoose is install !

export const connectDB = async() => {
    if (mongoose.connection.readyState === 1) {
        console.log("Already connected"); // check
        return;
    }

    // updated code!!
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            dbName: "test", // DB Name which had sevral collection in it!!!
        });

        console.log("MongoDB connected:", conn.connection.host); // check
    } catch (error) {
        console.error("MongoDB connection error:", error); // check
        process.exit(1); // requires check
    }
};

