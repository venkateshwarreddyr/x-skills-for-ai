# x-skills-for-ai - Pattern 1: Playwright RPC Bridge

Implementation of the specified architecture.

## Setup

1. cd exp/x-skills-for-ai
2. npm install
3. npx playwright install (or npm run install-playwright)
4. npm run dev

## Usage

- Server: http://localhost:3000
- Browser app: http://localhost:3000/browser/index.html (opens automatically via Playwright)
- **Inspect**: GET /inspect → Returns state, skills, markdown view
- **Execute**: POST /execute `{"skillId": "increment"}` → Executes skill in browser

## Example Flow (Counter App)

1. `curl http://localhost:3000/inspect`
   - Shows skills: increment, decrement, reset
   - State: {count: 0}
   - Markdown view

2. `curl -X POST http://localhost:3000/execute -H "Content-Type: application/json" -d '{"skillId": "increment"}'`

3. Inspect again → count: 1

## Architecture

- **Node**: Express API, security, Playwright bridge
- **Browser**: React-like hooks (useState, useSkill), renderer to DOM + markdown
- **Skills**: Registered via useSkill, executed via RPC
- **No DOM scraping, no browser APIs exposed**

## Files

- `browser/lib/`: Core hooks, renderer, skill registry
- `browser/examples/counter/app.js`: Demo app
- `node/server.ts`: Public API
- `node/bridge.ts`: Playwright RPC

## LLM Tool Schema

```
{
  "name": "execute_skill",
  "parameters": {
    "type": "object",
    "properties": {
      "skillId": {"type": "string"},
      "payload": {"type": "object"}
    }
  }
}
```

Loop: inspect → execute → inspect...

## Troubleshooting

- Browser not loading counter: Uncomment script in index.html or check bridge addScriptTag
- TS errors in bridge: Normal for browser context code
- Restart: Ctrl+C, npm run dev

Framework ready for extension with more apps/skills!