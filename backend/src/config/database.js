import mongoose from "mongoose";
import config from "./config.js";

const connectDB = async () => {
    mongoose.connect(config.MONGO_URI)
        .then(() => {
            console.log(`MongoDB connected successfully`);
        }).catch((err) => {
            console.error(`Error connecting to MongoDB`);
            process.exit(1);
        })
}
export default connectDB;