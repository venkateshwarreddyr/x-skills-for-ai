# RAM Todo App

A modular todo application built using the RAM (React-like framework for AI) framework.

## Features

- Add, toggle, delete, and clear completed todos
- Invariants to ensure data integrity
- AI-readable Markdown output
- Modular architecture

## Installation

1. Ensure the RAM library is built:
   ```bash
   cd ../lib
   npm install
   npm run build
   ```

2. Install dependencies for the app:
   ```bash
   cd ../examples/todo-app
   npm install
   ```

## Running the App

### Development (with ts-node):
```bash
npm run dev
```

### Production (build and run):
```bash
npm run build
npm start
```

The app will output Markdown context that can be used by AI agents to interact with the todo list.

## Structure

- `types.ts`: Type definitions
- `actions.ts`: Action definitions with requirements and effects
- `invariants.ts`: Data validation rules
- `app.ts`: Main AIComponent
- `index.ts`: Entry point