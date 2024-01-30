import { LLMChain } from "langchain/chains";
import { OpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";

export interface GenerateTestForCodeWithLanguage {
  language: string;
  code: string;
}

const openAi = new OpenAI({
  openAIApiKey: process.env.OPENAI_KEY,
});

export const generateTestForCodeWithLanguage = async (params: GenerateTestForCodeWithLanguage) => {
  const codePrompt = new PromptTemplate({
    template: "Write a test for the following {language} code: {code}",
    inputVariables: ["language", "code"],
  });

  const llm = new LLMChain({
    llm: openAi,
    prompt: codePrompt,
    outputKey: "test",
  });

  return llm.call({
    language: params.language,
    code: params.code,
  });
};
