import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatOpenAI } from "@langchain/openai";
import { BufferMemory } from "langchain/memory";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  MessagesPlaceholder,
  SystemMessagePromptTemplate,
} from "langchain/prompts";
import { RunnableSequence } from "langchain/runnables";

export interface Message {
  message: string;
}

const chatModel = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_KEY,
});

const memory = new BufferMemory({
  returnMessages: true,
  inputKey: "message",
  outputKey: "output",
  memoryKey: "history",
});

export const generateChatBotMessageWithMemoryBuffer = async (params: Message) => {
  const prompt = ChatPromptTemplate.fromMessages([
    SystemMessagePromptTemplate.fromTemplate(
      "Act as a math teacher who wants to help students with their homework"
    ),
    new MessagesPlaceholder("history"),
    HumanMessagePromptTemplate.fromTemplate("{message}"),
  ]);

  const outputParser = new StringOutputParser();

  console.log(await memory.loadMemoryVariables({}));

  const chain = RunnableSequence.from([
    {
      message: (initialInput) => initialInput.message,
      memory: () => memory.loadMemoryVariables({}),
    },
    {
      message: (previousOutput) => previousOutput.message,
      history: (previousOutput) => previousOutput.memory.history,
    },
    prompt,
    chatModel,
    outputParser,
  ]);

  const aiMessage = await chain.invoke({ message: params.message });

  await memory.saveContext(
    {
      message: params.message,
    },
    {
      output: aiMessage,
    }
  );

  console.log(await memory.loadMemoryVariables({}));

  return aiMessage;
};
