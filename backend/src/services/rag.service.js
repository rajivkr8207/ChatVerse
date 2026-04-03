import { Pinecone } from '@pinecone-database/pinecone';
import config from '../config/config.js';
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { PDFParse } from 'pdf-parse';
import { MistralAIEmbeddings } from '@langchain/mistralai';


const pc = new Pinecone({
    apiKey: config.PINE_CODE,
});
const embeddings = new MistralAIEmbeddings({
    apiKey: config.MISTRAL_API_KEY,
    model: "mistral-embed"
});

export const index = pc.index('chatverse');



export const parsePDF = async (buffer) => {
    const parser = new PDFParse({
        data: buffer
    })
    const datatext = await parser.getText()
    return datatext.text;
};

export const createEmbeddings = async (filebuffer, userid, docId) => {
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 500,
        chunkOverlap: 200,
    });
    const text = await parsePDF(filebuffer)
    const chunks = await splitter.splitText(text);
    const docs = await Promise.all(chunks.map(async (chunk) => {
        const embedding = await embeddings.embedQuery(chunk)
        return {
            text: chunk,
            embedding
        }
    }))

    await index.upsert({
        records: docs.map((doc, i) => ({
            id: `doc-${userid}-${docId}-${i}`,
            values: doc.embedding,
            metadata: {
                userId: userid,
                documentId: docId,
                text: doc.text
            }
        }))
    })
    return "done"
}

export async function queryEmbeddings(query, docId, userId) {
    const queryEmbedding = await embeddings.embedQuery(query);

    const res = await index.query({
        topK: 5,
        vector: queryEmbedding,
        includeMetadata: true,
        filter: {
            userId: userId,
            documentId: docId
        }
    });

    return res.matches.map(match => match.metadata.text).join("\n");
}


export const chatRagService = async (filebuffer, docid, userid, message) => {
    await createEmbeddings(filebuffer, userid, docid);
    const context = await queryEmbeddings(message, docid, userid);
    return `${context}`;
}