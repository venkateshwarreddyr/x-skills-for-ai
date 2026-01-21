# AILang Compiler

A minimal yet extendable compiler for AILang, a domain-specific language for defining workflows and state machines.

## Installation

```bash
npm install
```

## Build

```bash
npm run build
```

## Usage

```bash
npm start [file.ail]
```

If no file is provided, it defaults to `examples/todo.ail`.

## Example

See `examples/todo.ail` for a sample workflow definition.

## Architecture

- **Parser**: Parses AILang files into AST using PEG.js
- **IR**: Intermediate representation of states, actions, and workflows
- **Compiler**: Converts AST to IR
- **Context Generator**: Generates AI-compatible JSON context
- **Runtime**: Executes actions, manages state, logs events
- **MCP**: Stubs for Model Context Protocol integrations