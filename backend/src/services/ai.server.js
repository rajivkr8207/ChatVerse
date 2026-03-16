import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import config from "../config/config.js";
import { ChatMistralAI, SystemMessage, HumanMessage } from "@langchain/mistralai";

const mistralmodel = new ChatMistralAI({
    model: "mistral-large-latest",
    temperature: 0,
    apiKey: config.MISTRAL_API_KEY
});
const geminimodel = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash-lite",
    apiKey: config.GOOGLE_API_KEY,
});

export async function ChatGeminimessage(text) {
    const res = await geminimodel.invoke(text);
    return res.content
}

export async function GenrateMessageTilte(text) {
    const res = await mistralmodel.invoke([
        new SystemMessage("You are an assistant. Generate a description of the user text in 2-4 words."),
        new HumanMessage(text)
    ]);
    console.log(res);
    return res.content
}
