import mongoose from "mongoose";
import config from "./config.js";
import logger from "./logger.js";

const connectDB = async () => {
    mongoose.connect(config.MONGO_URI)
        .then(() => {
            logger.info(`MongoDB connected successfully`);
        }).catch((err) => {
            logger.error(`Error connecting to MongoDB`);
            process.exit(1);
        })
}
export default connectDB;