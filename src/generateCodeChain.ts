import { LLMChain } from "langchain/chains";
import { PromptTemplate } from "@langchain/core/prompts";
import { OpenAI } from "@langchain/openai";

export interface GenerateFunctionWithLanguage {
  language: string;
  task: string;
}
const openAi = new OpenAI({
  openAIApiKey: process.env.OPENAI_KEY,
});

export const generateFunctionWithLanguage = async (params: GenerateFunctionWithLanguage) => {
  const codePrompt = new PromptTemplate({
    template: "Write a very short {language} function that will {task}",
    inputVariables: ["language", "task"],
  });

  const llm = new LLMChain({
    llm: openAi,
    prompt: codePrompt,
    outputKey: "code",
  });

  return llm.call({
    language: params.language,
    task: params.task,
  });
};
