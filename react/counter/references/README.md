# Counter Skill

This document explains the Counter skill, its functionality, and how to build similar skills.

## What this skill does

The Counter skill provides a simple way to manage a numerical counter in AI contexts. It supports:
- Incrementing the counter
- Decrementing the counter (with optional parameter)
- Retrieving the current count

## How it works

The skill uses a simple in-memory counter that persists across function calls within a session. In production, this would be replaced with database persistence.

## Building similar skills

To create a skill like this:

1. Create a folder with the skill name
2. Add SKILL.md with metadata and instructions
3. Implement functions in scripts/
4. Add documentation in references/
5. Include sample data in data/
6. Add workflows and prompts in assets/

## Usage

Import and use the functions from scripts/counter.ts in your AI agent code.