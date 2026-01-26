# 🤖 Langchain Agent Chatbot - Controls Finance Adjustment Server

Langchain tool-calling agent that interacts with the finance-adjustment app running as a server.

## How it Works
- Finance app runs as HTTP server (localhost:3001)
- Agent uses tools to GET state and POST actions
- Natural language chat: "Escalate this high-risk case" → agent executes appropriate action

## Setup & Run

1. **Start Finance Server** (in one terminal):
   ```
   cd react/examples/finance-adjustment
   npm install
   npm run server
   ```

2. **Start Chatbot Agent** (in another terminal):
   ```
   cd langchain-chatbot
   npm install
   echo "OPENAI_API_KEY=sk-..." > .env
   npm start
   ```

## Example Conversation
```
You: What's the current status?
Bot: Gets state → "OPEN, high risk..."

You: Escalate to director because high amount
Bot: Gets state, sees allowed, executes EscalateToFinanceDirector → "Status now PENDING_DIRECTOR_APPROVAL"
```

## Tools
- `get_finance_state`: View current state/allowed actions
- `execute_finance_action`: Run action with payload

## Customization
- Change server URL in code
- Add more tools
- Switch LLM model

No code pasting - uses live server state!