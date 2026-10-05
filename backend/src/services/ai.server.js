import config from "../config/config.js";
import { ChatMistralAI, } from "@langchain/mistralai";
import { createAgent } from "langchain";
import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { tool } from "@langchain/core/tools";
import { tavily } from "@tavily/core";
import * as z from "zod";

const TRENDING_TOPICS_CACHE_TTL = 30 * 60 * 1000;
const TRENDING_TOPICS_RATE_LIMIT_RETRY_DELAY = 5 * 60 * 1000;
let trendingTopicsCache;
let trendingTopicsRequest;

function getMessageText(message) {
    const { content } = message;
    let text;

    if (typeof content === "string") {
        text = content;
    } else if (Array.isArray(content)) {
        text = content
            .map((part) => typeof part === "string" ? part : typeof part?.text === "string" ? part.text : "")
            .filter(Boolean)
            .join("");
    } else {
        throw new Error("Mistral returned an unsupported response format.");
    }

    if (!text.trim()) {
        throw new Error("Mistral returned an empty response.");
    }

    return text;
}

function requireMistralApiKey() {
    if (!config.MISTRAL_API_KEY) {
        throw new Error("MISTRAL_API_KEY is not configured.");
    }
}

const tvly = tavily({
    apiKey: config.TAVILY_KEY,
});
export const webSearchTool = tool(
    async ({ query }) => {
        try {
            const res = await tvly.search(query, {
                maxResults: 3,
            });
            return res.results
                .map((result) => `${result.title}: ${result.link}`)
                .join("\n");
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
    requireMistralApiKey();
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
    const finalMessage = [...result.messages]
        .reverse()
        .find((message) => message instanceof AIMessage);

    if (!finalMessage) {
        throw new Error("Mistral did not return an AI response.");
    }

    return getMessageText(finalMessage);
}

export async function GenrateTrendingTopics() {
    if (trendingTopicsCache && trendingTopicsCache.expiresAt > Date.now()) {
        return trendingTopicsCache.value;
    }

    if (trendingTopicsRequest) {
        return trendingTopicsRequest;
    }
    trendingTopicsRequest = (async () => {
        requireMistralApiKey();
        const prompt = `Generate 5 short, clickable trending topic suggestions for the ChatVerse dashboard. Each topic should be 2-4 words long, modern, engaging, and relevant to current trends in AI, technology, startups, productivity, programming, business, health, or travel. Return only an array of topic titles suitable for pill-shaped buttons. i want to return data in only [
"word","word","word"] like this without anything`

        try {
            const response = await mistralmodel.invoke([
                new SystemMessage(prompt),
            ]);
            const value = getMessageText(response);
            trendingTopicsCache = {
                value,
                expiresAt: Date.now() + TRENDING_TOPICS_CACHE_TTL,
            };
            return value;
        } catch (error) {
            const status = error.statusCode || error.status || error.response?.status;
            if (status === 429 && trendingTopicsCache) {
                trendingTopicsCache.expiresAt =
                    Date.now() + TRENDING_TOPICS_RATE_LIMIT_RETRY_DELAY;
                return trendingTopicsCache.value;
            }
            throw error;
        }
    })();

    try {
        return await trendingTopicsRequest;
    } finally {
        trendingTopicsRequest = undefined;
    }
}

export async function GenrateMessageTilte(text) {
    const title = text.trim().split(/\s+/).slice(0, 5).join(" ");
    return title.length > 40 ? `${title.slice(0, 37).trimEnd()}...` : title;
}
