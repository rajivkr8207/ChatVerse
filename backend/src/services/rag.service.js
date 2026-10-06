import { Pinecone } from '@pinecone-database/pinecone';
import config from '../config/config.js';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { PDFParse } from 'pdf-parse';

const pc = new Pinecone({
  apiKey: config.PINE_CODE,
});
const GOOGLE_EMBEDDING_MODEL = 'gemini-embedding-001';
const GOOGLE_EMBEDDING_DIMENSIONS = 1024;
const PINECONE_FETCH_BATCH_SIZE = 100;

const embedText = async (text) => {
  if (!config.GOOGLE_API_KEY) {
    throw new Error(
      'GOOGLE_API_KEY is not configured. Set a valid Google API key to use document search.',
    );
  }
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GOOGLE_EMBEDDING_MODEL}:embedContent`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': config.GOOGLE_API_KEY,
      },
      body: JSON.stringify({
        model: `models/${GOOGLE_EMBEDDING_MODEL}`,
        content: { parts: [{ text }] },
        outputDimensionality: GOOGLE_EMBEDDING_DIMENSIONS,
      }),
    },
  );

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(
      `Google embedding request failed (${response.status}): ${detail || response.statusText}`,
    );
  }

  const result = await response.json();
  const values = result.embedding?.values;
  if (!Array.isArray(values) || values.length !== GOOGLE_EMBEDDING_DIMENSIONS) {
    throw new Error(
      `Google returned an invalid embedding; expected ${GOOGLE_EMBEDDING_DIMENSIONS} dimensions.`,
    );
  }

  return values;
};

export const index = pc.index('chatverse');

export const parsePDF = async (buffer) => {
  const parser = new PDFParse({
    data: buffer,
  });
  const datatext = await parser.getText();
  return datatext.text;
};

export const createEmbeddings = async (filebuffer, userid, docId) => {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 200,
  });
  const text = await parsePDF(filebuffer);
  const chunks = await splitter.splitText(text);
  const docs = await Promise.all(
    chunks.map(async (chunk) => {
      const embedding = await embedText(chunk);
      return {
        text: chunk,
        embedding,
      };
    }),
  );

  await index.upsert({
    records: docs.map((doc, i) => ({
      id: `doc-${userid}-${docId}-${i}`,
      values: doc.embedding,
      metadata: {
        userId: userid,
        documentId: docId,
        text: doc.text,
        embeddingModel: GOOGLE_EMBEDDING_MODEL,
      },
    })),
  });
  return 'done';
};

const migrateLegacyDocumentEmbeddings = async (docId, userId) => {
  const prefix = `doc-${userId}-${docId}-`;
  let paginationToken;

  do {
    const page = await index.listPaginated({
      prefix,
      limit: PINECONE_FETCH_BATCH_SIZE,
      ...(paginationToken ? { paginationToken } : {}),
    });
    const ids = (page.vectors || []).map(({ id }) => id).filter(Boolean);

    for (let offset = 0; offset < ids.length; offset += PINECONE_FETCH_BATCH_SIZE) {
      const fetched = await index.fetch({
        ids: ids.slice(offset, offset + PINECONE_FETCH_BATCH_SIZE),
      });
      const records = Object.values(fetched.records || {});
      const legacyRecords = records.filter(
        (record) =>
          record.metadata?.text && record.metadata.embeddingModel !== GOOGLE_EMBEDDING_MODEL,
      );

      const migratedRecords = await Promise.all(
        legacyRecords.map(async (record) => ({
          id: record.id,
          values: await embedText(record.metadata.text),
          metadata: {
            ...record.metadata,
            embeddingModel: GOOGLE_EMBEDDING_MODEL,
          },
        })),
      );

      if (migratedRecords.length) {
        await index.upsert({ records: migratedRecords });
      }
    }

    paginationToken = page.pagination?.next;
  } while (paginationToken);
};

export async function queryEmbeddings(query, docId, userId) {
  await migrateLegacyDocumentEmbeddings(docId, userId);
  const queryEmbedding = await embedText(query);

  const res = await index.query({
    topK: 5,
    vector: queryEmbedding,
    includeMetadata: true,
    filter: {
      userId: userId,
      documentId: docId,
    },
  });

  return res.matches.map((match) => match.metadata.text).join('\n');
}

export const chatRagService = async (filebuffer, docid, userid, message) => {
  await createEmbeddings(filebuffer, userid, docid);
  const context = await queryEmbeddings(message, docid, userid);
  return `${context}`;
};
