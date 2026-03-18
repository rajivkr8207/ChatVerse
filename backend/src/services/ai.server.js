import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import config from "../config/config.js";
import { ChatMistralAI, } from "@langchain/mistralai";
import { AIMessage, HumanMessage, SystemMessage } from "langchain"
const mistralmodel = new ChatMistralAI({
    model: "mistral-small-latest",
    temperature: 0,
    apiKey: config.MISTRAL_API_KEY
});
const geminimodel = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash-lite",
    apiKey: config.GOOGLE_API_KEY,
});

export async function ChatGeminimessage(messages) {
    const res = await mistralmodel.invoke(messages.map(msg => {
        if (msg.role == "user") {
            return new HumanMessage(msg.content)
        } else {
            return new AIMessage(msg.content)
        }
    }));
    return res.text
}
// export async function ChatGeminimessage(messages) {
//     const res = await mistralmodel.invoke(messages);
//     return res.text
// }

export async function GenrateMessageTilte(text) {
    const res = await mistralmodel.invoke([
        new SystemMessage("You are an assistant. Generate a descriptive title  for chat   you provide only in 2-4 words."),
        new HumanMessage(`
            genrate a title for a chat conversation based on following first message: ${text}
            `)
    ]);
    return res.text
}
