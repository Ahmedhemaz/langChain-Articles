import { ChromaClient, IncludeEnum } from "chromadb";
export const getCollectionData = async (collectionName: string) => {
  const client = new ChromaClient({
    path: `http://${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}`,
  });

  const collection = await client.getCollection({
    name: collectionName,
  });

  return collection.get({
    include: [IncludeEnum.Documents, IncludeEnum.Embeddings, IncludeEnum.Metadatas],
    limit: 1,
  });
};
