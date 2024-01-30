import { OpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { StructuredOutputParser } from "langchain/output_parsers";

export interface GenerateCodeWithTests {
  language: string;
  task: string;
}

export const generateCodeWithTests = async (params: GenerateCodeWithTests) => {
  const openAi = new OpenAI({
    openAIApiKey: process.env.OPENAI_KEY,
  });

  const outputParser = new StringOutputParser();

  const generateCodePrompt = PromptTemplate.fromTemplate(
    "Write a very short {language} function that will {task}. Only respond with the code"
  );

  const generateTestPrompt = PromptTemplate.fromTemplate(
    "Write unit tests for the following code: {code} with this language: {language}. respond with the code and generated tests in this {format_instructions}"
  );

  const chain = generateCodePrompt.pipe(openAi).pipe(outputParser);

  const parser = StructuredOutputParser.fromNamesAndDescriptions({
    code: "the generated code",
    tests: "the generated tests for that code",
  });

  const combinedChain = RunnableSequence.from([
    {
      code: chain,
      language: (input) => input.language,
      format_instructions: (input) => input.format_instructions,
    },
    generateTestPrompt,
    openAi,
    parser,
  ]);

  return combinedChain.invoke({
    language: params.language,
    task: params.task,
    format_instructions: parser.getFormatInstructions(),
  });
};
