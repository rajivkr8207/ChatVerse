import express from "express";
import { verifyUser } from "../middleware/auth.middleware.js";
import { sendMessage } from "../controllers/message.controller.js";

const messagerouter = express.Router();

messagerouter.post("/", verifyUser, sendMessage);

export default messagerouter;