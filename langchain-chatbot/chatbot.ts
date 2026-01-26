import dotenv from 'dotenv';
dotenv.config();

import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage, ToolMessage } from '@langchain/core/messages';
import * as readline from 'readline';
import { tool } from '@langchain/core/tools';
import { z } from 'zod';

const FINANCE_SERVER_URL = 'http://localhost:3001';

const getStateTool = tool(async () => {
  const response = await fetch(`${FINANCE_SERVER_URL}/state`);
  if (!response.ok) throw new Error(`Server error: ${response.status}`);
  const data = await response.json();
  return `Current state: ${JSON.stringify(data.state, null, 2)}\nAllowed actions: ${data.allowedActions.map((a: any) => a.name).join(', ')}\nMarkdown preview: ${data.markdown.substring(0, 200)}...`;
}, {
  name: 'get_finance_state',
  description: 'Get the current state, allowed actions, and markdown from the finance adjustment app server.',
  schema: z.object({})
});

const executeActionTool = tool(async (inputString: string) => {
  try {
    const { action, payload = {} } = JSON.parse(inputString);
    const response = await fetch(`${FINANCE_SERVER_URL}/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, payload })
    });
    if (!response.ok) throw new Error(`Server error: ${response.status}`);
    const data = await response.json();
    return `Action '${action}' executed. New state: ${JSON.stringify(data.state, null, 2)}\nAllowed actions now: ${data.allowedActions.map((a: any) => a.name).join(', ')}`;
  } catch (error) {
    return `Error executing action: ${(error as Error).message}`;
  }
}, {
  name: 'execute_finance_action',
  description: 'Execute an action on the finance app. Input is JSON string {"action": "ActionName", "payload": {optional payload object}}',
  schema: z.object({
    inputString: z.string().describe('JSON {"action": string, "payload": object}')
  })
});

async function main() {
  const model = new ChatOpenAI({ 
    model: 'gpt-4o-mini', 
    temperature: 0,
  }).bindTools([getStateTool, executeActionTool]);

  const systemPrompt = `You are a conversational assistant for the Financial Adjustment workflow app running as a server at localhost:3001.

Use the tools to:
- Get current state and allowed actions
- Execute actions when appropriate based on user requests

Always check state before acting. Explain changes to the user.

Finance app goals:
- Resolve cases compliantly
- High risk needs escalation`;

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  let messages = [new SystemMessage(systemPrompt)];

  console.log('\\n🤖 Finance Workflow Chatbot');
  console.log('Make sure the finance server is running: cd react/examples/finance-adjustment && npm run server');
  console.log('Type your message or "exit".\\n');

  while (true) {
    const line = await new Promise<string>((resolve) => {
      rl.question('You: ', resolve);
    });

    if (line.trim().toLowerCase() === 'exit') {
      console.log('Goodbye!');
      break;
    }

    messages.push(new HumanMessage(line));

    let response;
    do {
      response = await model.invoke(messages);
      messages.push(response);

      const toolCalls = response.additional_kwargs.tool_calls || [];
      for (const toolCall of toolCalls) {
        const toolName = toolCall.name;
        const toolArgs = toolCall.args;
        let toolResult;
        if (toolName === 'get_finance_state') {
          toolResult = await getStateTool.call(toolArgs);
        } else if (toolName === 'execute_finance_action') {
          toolResult = await executeActionTool.call(toolArgs);
        } else {
          toolResult = 'Unknown tool';
        }
        messages.push(new ToolMessage(toolResult, toolCall.id));
      }
    } while (response.additional_kwargs.tool_calls?.length > 0);

    console.log('\\nBot: ' + response.content + '\\n');
  }

  rl.close();
}

main().catch(console.error);