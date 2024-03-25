import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate, MessagesPlaceholder } from "langchain/prompts";
import { HumanMessage } from "@langchain/core/messages";
import { AgentExecutor, createOpenAIToolsAgent } from "langchain/agents";
import { SqlToolkit } from "langchain/agents/toolkits/sql";
import { SqlDatabase } from "langchain/sql_db";
import { dataSource } from "../db/db-connection.js";
import { HtmlGeneratorTool } from "../tools/html.tool.js";

export interface Message {
  message: string;
}

const model = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_KEY,
  modelName: "gpt-3.5-turbo",
  temperature: 0,
});

export const sqlAgentChat = async (params: Message) => {
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", "You are an AI assistant who has access to postgres database and can generate some reports!"],
    new MessagesPlaceholder("messages"),
    new MessagesPlaceholder("agent_scratchpad"),
  ]);

  const db = await SqlDatabase.fromDataSourceParams({
    appDataSource: dataSource,
  });

  const toolkit = new SqlToolkit(db, model);
  toolkit.dialect = "postgres";
  const tools: any = [];
  tools.push(...toolkit.getTools());
  tools.push(new HtmlGeneratorTool());
  const agent = await createOpenAIToolsAgent({
    llm: model,
    tools,
    prompt,
  });
  const agentExecutor = new AgentExecutor({ agent, tools, verbose: true, returnIntermediateSteps: true });

  const ans = await agentExecutor.invoke({
    messages: [new HumanMessage(params.message)],
  });
  return ans;
};
