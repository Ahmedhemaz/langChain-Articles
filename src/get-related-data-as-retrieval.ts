import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import {
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
  ChatPromptTemplate,
} from "langchain/prompts";
import { RunnablePassthrough, RunnableSequence } from "@langchain/core/runnables";
import { formatDocumentsAsString } from "langchain/util/document";
import { StringOutputParser } from "@langchain/core/output_parsers";

export interface GetRelatedDataAsRetrieval {
  input: string;
}

const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_KEY,
});

const chatModel = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_KEY,
});

const vectorStore = await Chroma.fromExistingCollection(embeddings, {
  collectionName: "c-test-collection",
  url: `http://${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}`,
  collectionMetadata: {
    "hnsw:space": "cosine",
  },
});

const retrieval = vectorStore.asRetriever();

export const getRelatedDataAsRetrieval = async (params: GetRelatedDataAsRetrieval) => {
  const SYSTEM_TEMPLATE = `Use the following pieces of context to answer the question at the end.
    If you don't know the answer, just say that you don't know, don't try to make up an answer.
    ----------------
    {context}`;

  const messages = [
    SystemMessagePromptTemplate.fromTemplate(SYSTEM_TEMPLATE),
    HumanMessagePromptTemplate.fromTemplate("{input}"),
  ];

  const prompt = ChatPromptTemplate.fromMessages(messages);
  const chain = RunnableSequence.from([
    {
      context: retrieval.pipe(formatDocumentsAsString),
      input: new RunnablePassthrough(),
    },
    prompt,
    chatModel,
    new StringOutputParser(),
  ]);

  const answer = await chain.invoke(params.input);

  return answer;
};
