import mongoose from mongoose

export const connectDB = async() => {
    if (mongoose.connection.readyState === 1) {
        console.log("Already connected"); // check
        return;
    }

    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            dbName: "test",
        });

        console.log("MongoDB connected:", conn.connection.host); // check
    } catch (error) {
        console.error("MongoDB connection error:", error); // check
        process.exit(1);
    }
};

