import express from "express";
import dotenv from "dotenv";
import { dataSource } from "./db/db-connection.js";
import { sqlAgentChat } from "./agents/sql-agent.js";

dotenv.config();

const app: express.Express = express();
const port: string | number = process.env.PORT || 3000;
app.use(express.json());

app.listen(port, async () => {
  await dataSource.initialize();
  console.log(`Server is listening on port ${port}`);
});

app.post("/agent-sql-chat", async (req, res, next) => {
  try {
    const result = await sqlAgentChat(req.body);
    return res.status(200).send({
      result,
    });
  } catch (error) {
    console.log(error);
  }
});
