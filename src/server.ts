import express from "express";
import dotenv from "dotenv";
import { generateChatBotMessageWithMemoryBuffer } from "./chatMemoryBuffer.js";
import { generateChatBotMessageWithConversationSummeryMemory } from "./chatConversationSummeryMemory.js";

dotenv.config();

const app: express.Express = express();
const port: string | number = process.env.PORT || 3000;
app.use(express.json());

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

app.post("/chat-with-memory-buffer", async (req, res) => {
  const generatedMessage = await generateChatBotMessageWithMemoryBuffer(req.body);
  res.status(200).send({
    message: generatedMessage,
  });
});

app.post("/chat-with-conversation-summery-memory", async (req, res) => {
  const generatedMessage = await generateChatBotMessageWithConversationSummeryMemory(req.body);
  res.status(200).send({
    message: generatedMessage,
  });
});
