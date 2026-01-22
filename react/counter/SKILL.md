---
name: counter
description: Manage a simple counter with increment and decrement operations.
---

# Counter Skill

This skill provides functionality to manage a counter state, allowing increment and decrement operations.

## When to use this skill
Use this skill when you need to maintain a numerical counter in your AI context, such as tracking scores, counts, or simple state changes.

## Available functions
- `incr()`: Increments the counter by 1
- `decr(param?)`: Decrements the counter by 1, or by the specified param value if provided

## Usage example
To increment the counter: Call `incr()`
To decrement by 1: Call `decr()`
To decrement by 5: Call `decr(5)`

The counter state is persisted and can be accessed across interactions.