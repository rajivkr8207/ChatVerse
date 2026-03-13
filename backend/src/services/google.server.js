import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import config from "../config/config.js";

const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash-lite",
    apiKey: config.GOOGLE_API_KEY,
});

export async function ChatGeminimessage(text) {
    const res = await model.invoke(text);
    return res.content
}