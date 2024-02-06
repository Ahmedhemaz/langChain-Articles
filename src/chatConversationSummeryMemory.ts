import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatOpenAI } from "@langchain/openai";
import { ChatMessageHistory, ConversationSummaryMemory } from "langchain/memory";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  MessagesPlaceholder,
  PromptTemplate,
  SystemMessagePromptTemplate,
} from "langchain/prompts";
import { RunnableSequence } from "langchain/runnables";
import { AIMessage } from "langchain/schema";

export interface Message {
  message: string;
}

const chatModel = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_KEY,
});

const memory = new ConversationSummaryMemory({
  memoryKey: "chat_history",
  llm: chatModel,
});

export const generateChatBotMessageWithConversationSummeryMemory = async (params: Message) => {
  const outputParser = new StringOutputParser();

  const prompt1 = ChatPromptTemplate.fromMessages([
    SystemMessagePromptTemplate.fromTemplate(
      "The following is conversation between a human and an AI. The AI Act as a math teacher who wants to help students with their homework."
    ),
    "Current conversation:",
    "{chat_history}",
    HumanMessagePromptTemplate.fromTemplate("{message}"),
  ]);

  const chain = RunnableSequence.from([
    {
      message: (initialInput) => initialInput.message,
      memory: () => memory.loadMemoryVariables({}),
    },
    {
      message: (previousOutput) => previousOutput.message,
      chat_history: (previousOutput) => previousOutput.memory.chat_history,
    },
    prompt1,
    chatModel,
    outputParser,
  ]);

  const aiMessage = await chain.invoke({ message: params.message });

  await memory.saveContext(
    {
      message: params.message,
    },
    {
      chat_history: new AIMessage(aiMessage),
    }
  );

  console.log({ aiMessage, memory: await memory.loadMemoryVariables({}) });

  return aiMessage;
};
