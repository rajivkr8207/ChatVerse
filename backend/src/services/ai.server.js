import config from "../config/config.js";
import { ChatMistralAI, } from "@langchain/mistralai";
import { createAgent } from "langchain";
import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { tool } from "@langchain/core/tools";
import { tavily } from "@tavily/core";
import * as z from "zod";
const tvly = tavily({
    apiKey: config.TAVILY_KEY,
});
export const webSearchTool = tool(
    async ({ query }) => {
        try {
            const res = await tvly.search(query, {
                maxResults: 3,
            });
            return JSON.stringify(
                res.results.map((r) => ({
                    title: r.title,
                    content: r.content,
                    url: r.url
                }))
            );
        } catch (err) {
            return "Web search failed.";
        }
    },
    {
        name: "web_search",
        description:
            "Search the internet for latest news, current events, live information and recent updates.",
        schema: z.object({
            query: z.string(),
        }),
    }
);

const mistralmodel = new ChatMistralAI({
    model: "mistral-medium-latest",
    apiKey: config.MISTRAL_API_KEY
});

const agent = createAgent({
    model: mistralmodel,
    tools: [webSearchTool]
});

export async function ChatGeminimessage(messages) {
    try {
        const formattedMessages = messages.map((msg) => {
            if (msg.role === "user") {
                return new HumanMessage(msg.content);
            }
            return new AIMessage(msg.content);
        });

        const result = await agent.invoke({
            messages: [
                new SystemMessage(
                    "You are ChatVerse AI. If the user asks about current events, latest news, live information, stock prices, trends, weather, or anything requiring recent information, always use the web_search tool."
                ),
                ...formattedMessages,
            ],
        });
        let answer = result.messages[result.messages.length - 1].content
        return answer || answer[0].text
    } catch (error) {
        return "Something went wrong.";
    }
}

export async function GenrateTrendingTopics() {
    let traing = `Generate 5 short, clickable trending topic suggestions for the ChatVerse dashboard. Each topic should be 2-4 words long, modern, engaging, and relevant to current trends in AI, technology, startups, productivity, programming, business, health, or travel. Return only an array of topic titles suitable for pill-shaped buttons. i want to return data in only [
"word","word","word"] like this without anything`
    const res = await mistralmodel.invoke([
        new SystemMessage(traing),
    ]);
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
