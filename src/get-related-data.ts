import { Chroma } from "@langchain/community/vectorstores/chroma";
import { OpenAIEmbeddings } from "@langchain/openai";

export interface GetRelatedDataInput {
  input: string;
}

export const getRelatedData = async (params: GetRelatedDataInput) => {
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_KEY,
  });

  const vectorStore = await Chroma.fromExistingCollection(embeddings, {
    collectionName: "c-test-collection",
    url: `http://${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}`,
    collectionMetadata: {
      "hnsw:space": "cosine",
    },
  });

  const data = await vectorStore.similaritySearch(params.input, 2);

  return data;
};
