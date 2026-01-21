import { parseAILang } from "./parser/parser";
import { astToIR } from "./compiler/compiler";
import { generateAIContext } from "./compiler/contextGenerator";
import { generateVisualization } from "./visualizer";
import fs from "fs";

const command = process.argv[2];
if (command === 'visualize') {
  const filePath = process.argv[3] || "examples/employee-onboarding/app.ail";
  const ast = parseAILang(filePath);
  const ir = astToIR(ast);
  const html = generateVisualization(ir);
  const outputPath = filePath.replace('.ail', '.html');
  fs.writeFileSync(outputPath, html);
  console.log(`Visualization saved to ${outputPath}`);
} else {
  const filePath = process.argv[2] || "examples/multi-domain.ail";
  const ast = parseAILang(filePath);
  const ir = astToIR(ast);
  const currentState = {
    Todo: { id: "42", title: "Write blog", status: "PENDING" },
    User: { id: "user_1", role: "MEMBER" },
    Invoice: { id: "99", status: "APPROVED", amount: 500 }
  };
  console.log(JSON.stringify(generateAIContext(currentState, ir.actions), null, 2));
}