import { ChatGroq } from '@langchain/groq';
import { tavily } from '@tavily/core';
import { ChatOpenRouter } from '@langchain/openrouter';
import config from '../config/config.js';

export const GroqModel = new ChatGroq({
  model: 'openai/gpt-oss-120b',
  temperature: 0,
  maxTokens: undefined,
  maxRetries: 2,
  apiKey: config.GROQ_API_KEY,
});

export const tvly = tavily({
  apiKey: config.TAVILY_KEY,
});

export const openrouterModel = new ChatOpenRouter({
  model: 'anthropic/claude-sonnet-4.5',
  temperature: 0,
  maxTokens: 1024,
  apiKey: config.OPENROUTER_API_KEY,
});
