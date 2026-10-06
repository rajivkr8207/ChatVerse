import config from '../config/config.js';
import { AIMessage, HumanMessage, SystemMessage } from '@langchain/core/messages';
import { tool } from '@langchain/core/tools';
import * as z from 'zod';
import { GroqModel, tvly, openrouterModel } from './ai.service.model.js';

const TRENDING_TOPICS_CACHE_TTL = 30 * 60 * 1000;
const TRENDING_TOPICS_RATE_LIMIT_RETRY_DELAY = 5 * 60 * 1000;
const CHAT_SYSTEM_PROMPT = `You are ChatVerse AI. Respond helpfully and concisely. you not tell which model you are using. If the user asks for a list of trending topics, respond with a JSON array of 5 short, clickable topics relevant to AI, technology, startups, productivity, programming, business, health, or travel. Each topic should be 2-4 words long and engaging. Do not include any markdown or explanation in your response.`;

let trendingTopicsCache = null;
let trendingTopicsRequest = null;

function normalizeTextContent(value) {
  if (value == null) {
    return '';
  }

  if (typeof value === 'string') {
    return value;
  }

  if (Array.isArray(value)) {
    return value
      .map((part) => {
        if (typeof part === 'string') return part;
        if (part && typeof part === 'object') return part.text || '';
        return '';
      })
      .join(' ')
      .trim();
  }

  if (typeof value === 'object') {
    return value.text || value.content || '';
  }

  return String(value);
}

function getMessageText(message) {
  if (!message) {
    return '';
  }

  if (typeof message === 'string') {
    return message;
  }

  if (
    message instanceof AIMessage ||
    message instanceof HumanMessage ||
    message instanceof SystemMessage
  ) {
    return normalizeTextContent(message.content);
  }

  if (typeof message.content !== 'undefined') {
    return normalizeTextContent(message.content);
  }

  if (typeof message.text !== 'undefined') {
    return normalizeTextContent(message.text);
  }

  return '';
}

function normalizeMessages(messages = []) {
  if (!Array.isArray(messages)) {
    return [];
  }

  return messages
    .filter((msg) => msg && (msg.content || msg.text || msg.role))
    .map((msg) => {
      const role = String(msg.role || msg.type || 'user').toLowerCase();
      const content = normalizeTextContent(msg.content ?? msg.text ?? '');

      if (!content.trim()) {
        return null;
      }

      if (['assistant', 'ai', 'bot'].includes(role)) {
        return { role: 'assistant', content };
      }

      if (role === 'system') {
        return { role: 'system', content };
      }

      return { role: 'user', content };
    })
    .filter(Boolean);
}

function parseTopicsArray(rawText) {
  const cleaned = String(rawText || '')
    .replace(/```(?:json)?/gi, '')
    .trim();
  const match = cleaned.match(/\[[\s\S]*\]/);

  if (!match) {
    return [];
  }

  try {
    const parsed = JSON.parse(match[0]);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed
      .map((item) => String(item).trim())
      .filter(Boolean)
      .slice(0, 5);
  } catch (_) {
    return [];
  }
}

export const webSearchTool = tool(
  async ({ query }) => {
    try {
      const res = await tvly.search(query, { maxResults: 3 });
      return res.results.map((result) => `${result.title}: ${result.link}`).join('\n');
    } catch (_) {
      return 'Web search failed.';
    }
  },
  {
    name: 'web_search',
    description:
      'Search the internet for latest news, current events, live information and recent updates.',
    schema: z.object({
      query: z.string(),
    }),
  },
);

async function invokeWithFallback(messages) {
  let groqError;

  if (config.GROQ_API_KEY) {
    try {
      const response = await GroqModel.invoke(messages);
      const text = getMessageText(response);
      if (!text.trim()) {
        throw new Error('Groq returned an empty response.');
      }
      return text;
    } catch (error) {
      groqError = error;
      const status = error.statusCode || error.status || error.response?.status;
      console.warn(
        `Groq request failed${status ? ` with status ${status}` : ''}; trying OpenRouter.`,
      );
    }
  } else {
    console.warn('GROQ_API_KEY is not configured; trying OpenRouter.');
  }

  if (!config.OPENROUTER_API_KEY) {
    if (groqError) {
      throw groqError;
    }
    throw new Error(
      'OPENROUTER_API_KEY is not configured and Groq is unavailable. Configure at least one AI provider.',
    );
  }

  try {
    const response = await openrouterModel.invoke(messages);
    const text = getMessageText(response);
    if (!text.trim()) {
      throw new Error('OpenRouter returned an empty response.');
    }
    return text;
  } catch (error) {
    if (groqError) {
      error.cause = groqError;
    }
    throw error;
  }
}

async function generateText(messages, { systemPrompt = CHAT_SYSTEM_PROMPT } = {}) {
  const cleanedMessages = normalizeMessages(messages);
  if (!cleanedMessages.length) {
    throw new Error('No valid chat messages were provided.');
  }

  return invokeWithFallback([{ role: 'system', content: systemPrompt }, ...cleanedMessages]);
}

export async function ChatGeminimessage(messages, options = {}) {
  return generateText(messages, options);
}

export async function GenrateTrendingTopics() {
  if (trendingTopicsCache && trendingTopicsCache.expiresAt > Date.now()) {
    return trendingTopicsCache.value;
  }

  if (trendingTopicsRequest) {
    return trendingTopicsRequest;
  }

  trendingTopicsRequest = (async () => {
    const prompt = `Generate exactly 5 short, clickable trending topic suggestions for the ChatVerse dashboard. Each topic should be 2-4 words long, modern, engaging, and relevant to AI, technology, startups, productivity, programming, business, health, or travel. Return only a JSON array like ["AI Trends","Startup Growth","Remote Work","Productivity Boost","Travel Tech"] without markdown or explanation.`;

    try {
      const generatedTopics = await invokeWithFallback([{ role: 'system', content: prompt }]);
      const parsedTopics = parseTopicsArray(generatedTopics);
      const value = parsedTopics.length
        ? parsedTopics
        : ['AI Trends', 'Startup Growth', 'Productivity Boost', 'Travel Tech', 'Future Work'];

      trendingTopicsCache = {
        value,
        expiresAt: Date.now() + TRENDING_TOPICS_CACHE_TTL,
      };

      return value;
    } catch (error) {
      const status = error.statusCode || error.status || error.response?.status;
      if (status === 429 && trendingTopicsCache) {
        trendingTopicsCache.expiresAt = Date.now() + TRENDING_TOPICS_RATE_LIMIT_RETRY_DELAY;
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
  const safeText = String(text || '').trim();
  if (!safeText) {
    return 'New Chat';
  }

  const title = safeText.split(/\s+/).slice(0, 5).join(' ');
  return title.length > 40 ? `${title.slice(0, 37).trimEnd()}...` : title;
}
