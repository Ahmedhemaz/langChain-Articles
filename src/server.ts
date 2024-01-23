import express from "express";
import dotenv from "dotenv";
import { generateFunctionWithLanguage } from "./generateCodeChain.js";

dotenv.config();

const app: express.Express = express();
const port: string | number = process.env.PORT || 3000;
app.use(express.json());

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

app.post("/generate-code", async (req, res, next) => {
  const codeGenerated = await generateFunctionWithLanguage(req.body);

  res.status(200).send({
    code: codeGenerated.code,
  });
});
