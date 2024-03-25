import { Tool, ToolParams } from "@langchain/core/tools";
import { promises as fsPromises } from "fs";

export class HtmlGeneratorTool extends Tool {
  static lc_name() {
    return "HtmlGeneratorTool";
  }

  name = "html-generator-tool";

  description = "Use this tool to generate styled html with the given data in a proper way.";

  constructor(config?: ToolParams) {
    super(config);
  }

  async _call(htmlContent: string) {
    try {
      await fsPromises.writeFile("./report.html", htmlContent);
      return "created";
    } catch (err) {
      console.error("Error writing file:", err);
    } finally {
      return "created";
    }
  }
}

const tools = [new HtmlGeneratorTool()];
