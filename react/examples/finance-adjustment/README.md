# 💼 Financial Adjustment Approval — RAM Example

This example demonstrates a **real enterprise-grade use case** where RAM
outperforms traditional UI-driven systems and agent frameworks.

## 🧠 Problem This Solves

Financial adjustment workflows are:

- Compliance-heavy
- Multi-step
- Human + AI collaborative
- Audit-critical

Traditional dashboards fail to make decisions explicit.
Agent frameworks fail to make decisions safe.

RAM solves both.

## 🧩 What RAM Provides Here

- Deterministic state transitions
- Explicit allowed decisions
- AI-readable + human-readable context
- Runtime enforcement of compliance
- Full audit trail

## 🔁 How the Flow Works

1. Case enters \`OPEN\`
2. RAM renders decision surface (Markdown)
3. AI selects **one of the allowed actions**
4. Runtime enforces validity
5. Human can take over at any step
6. Every action is logged

No UI rewrites.  
No prompt hacking.  
No hallucinated transitions.

## 🤖 Example AI Decision

\`\`\`json
{
  \"action\": \"EscalateToFinanceDirector\",
  \"reasoning\": \"High amount and high risk require senior approval\"
}
\`\`\`

If invalid, RAM rejects it **before** state mutation.

## 🚀 Server Mode (New!)

Run the app as an HTTP server for integration with agents/chatbots:

```bash
cd react/examples/finance-adjustment
npm install
npm run server
```

- GET \`http://localhost:3001/state\` - Get current markdown, state, allowed actions
- POST \`http://localhost:3001/action\` - \`{ "action": "ActionName", "payload": {} }\`

Perfect for Langchain agents or other AI tools.

## 📁 Folder structure

```
react/examples/
└── finance-adjustment/
    ├── index.ts
    ├── app.ts
    ├── actions.ts
    ├── invariants.ts
    ├── server.ts  ← New!
    └── README.md
```

## 🎯 When to Use RAM

This pattern excels in:
* Financial operations
* Trust & safety
* Incident response
* Compliance workflows
* Security access approvals

If correctness matters more than UI, RAM is the right layer.

## 🧠 Final Thought

> RAM is not an AI framework.
> It is a **decision surface** for AI and humans to safely share control.

## 🚀 Quick Start (Original)

```bash
cd react/examples/finance-adjustment
npm install
npm run build
# Use with react/lib/runner.ts or similar