import { Pinecone } from '@pinecone-database/pinecone';
import config from '../config/config.js';
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PDFParse } from 'pdf-parse';
import fs from "fs";
import { MistralAIEmbeddings } from '@langchain/mistralai';


const pc = new Pinecone({
    apiKey: config.PINE_CODE,
});
const embeddings = new MistralAIEmbeddings({
    apiKey: config.MISTRAL_API_KEY,
    model: "mistral-embed"
});

export const index = pc.index('chatverse');



export const parsePDF = async (filePath) => {
    const dataBuffer = fs.readFileSync(filePath);
    const parser = new PDFParse({
        data: dataBuffer
    })
    const datatext = await parser.getText()
    return datatext.text;
};

export const createEmbeddings = async (filePath, userid, docId) => {
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 300,
        chunkOverlap: 200,
    });
    const chunks = await splitter.splitText(parsePDF(filePath));
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

export async function queryEmbeddings(query) {
    const queryEmbedding = await embeddings.embedQuery(query);
    const res = await index.query({
        queryRequest: {
            topK: 2,
            vector: queryEmbedding,
            includeMetadata: true
        }
    })
    return res.matches.map(match => match.metadata.text).join("\n");
}
