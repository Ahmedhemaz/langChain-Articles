import express from "express";
import dotenv from "dotenv";
import { loadFileToVectorDb } from "./file-data-loader.js";
import { getCollectionData } from "./get-collection-data.js";
import { getRelatedData } from "./get-related-data.js";
import { getRelatedDataAsRetrieval } from "./get-related-data-as-retrieval.js";

dotenv.config();

const app: express.Express = express();
const port: string | number = process.env.PORT || 3000;
app.use(express.json());

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

app.post("/load-file-to-vdb", async (req, res, next) => {
  await loadFileToVectorDb();

  res.status(200).send({
    message: "loaded",
  });
});

app.get("/get-file-data", async (req, res, next) => {
  const loadedData = await getCollectionData("c-test-collection");
  res.status(200).send({
    loadedData,
  });
});

app.post("/get-related-data", async (req, res, next) => {
  const data = await getRelatedData(req.body);
  res.status(200).send({
    data,
  });
});

app.post("/get-related-data-as-retrieval", async (req, res, next) => {
  const data = await getRelatedDataAsRetrieval(req.body);
  res.status(200).send({
    data,
  });
});
