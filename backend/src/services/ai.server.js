import config from "../config/config.js";
import { ChatMistralAI, } from "@langchain/mistralai";
import { AIMessage, HumanMessage,tool, SystemMessage, createAgent } from "langchain"
import { tavily } from "@tavily/core";
import * as z from "zod";
const tvly = tavily({
    apiKey: config.TAVILY_KEY,
    maxResults: 3
});
export const webSearchTool = tool(
    async ({ query }) => {
        const res = await tvly.search(query);
        const context = res.results
            .slice(0, 3)
            .map(r => r.content)
            .join("\n");
        return context;

    },
    {
        name: "web_search",
        description: "Search the internet for latest information",
        schema: z.object({
            query: z.string().describe("search query for web")
        })
    }
);


const mistralmodel = new ChatMistralAI({
    model: "mistral-small-latest",
    apiKey: config.MISTRAL_API_KEY
});

const agent = createAgent({
    model:mistralmodel ,
    tools: [webSearchTool]
});
let messages = [
    {
        role: "ai",
        content:
            "If you don't know the answer or the question requires latest information, use the web_search tool."
    }
]


export async function ChatGeminimessage(msg) {
    const res = await mistralmodel.invoke(msg.map(msg => {
        if (msg.role == "user") {
            return new HumanMessage(msg.content)
        } else {
            return new AIMessage(msg.content)
        }
    }));
    return res.text
}

export async function GenrateMessageTilte(text) {
    const res = await mistralmodel.invoke([
        new SystemMessage("You are an assistant. Generate a descriptive title  for chat   you provide only in 2-4 words."),
        new HumanMessage(`
            genrate a title for a chat conversation based on following first message: ${text}
            `)
    ]);
    return res.text
}
