import { Chroma } from "@langchain/community/vectorstores/chroma";
import { OpenAIEmbeddings } from "@langchain/openai";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { CharacterTextSplitter } from "langchain/text_splitter";

export const loadFileToVectorDb = async () => {
  const loader = new TextLoader("./facts.txt");

  const docs = await loader.load();

  const splitter = new CharacterTextSplitter({
    separator: "\n",
    chunkSize: 200,
    chunkOverlap: 0,
  });

  const chunks = await splitter.createDocuments([docs[0].pageContent]);

  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_KEY,
  });

  const vectorStore = await Chroma.fromDocuments(
    chunks,
    new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_KEY,
    }),
    {
      collectionName: "c-test-collection",
      url: `http://${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}`, // Use "http://" prefix for the URL
      collectionMetadata: {
        "hnsw:space": "cosine",
      },
    }
  );
};
