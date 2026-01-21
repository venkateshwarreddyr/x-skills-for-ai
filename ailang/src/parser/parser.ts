import peg from "pegjs";
import fs from "fs";
import path from "path";
import { glob } from "glob";

export function parseAILang(filePath: string) {
  const grammarPath = path.join(__dirname, "../../src/parser/ailang.pegjs");
  const grammar = fs.readFileSync(grammarPath, "utf8");
  const parser = peg.generate(grammar);

  function parseFile(fp: string): any[] {
    const text = fs.readFileSync(fp, "utf8");
    const ast = parser.parse(text);
    const allItems: any[] = [];
    for (const item of ast) {
      if (item.type === "import") {
        const dir = path.dirname(fp);
        const pattern = path.join(dir, item.path);
        const files = glob.sync(pattern).filter(f => f.endsWith('.ail'));
        for (const file of files) {
          allItems.push(...parseFile(file));
        }
      } else {
        allItems.push(item);
      }
    }
    return allItems;
  }

  return parseFile(filePath);
}