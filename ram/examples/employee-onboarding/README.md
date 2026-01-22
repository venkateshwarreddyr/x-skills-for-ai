# Employee Onboarding Example

This is RAM's flagship example application demonstrating all core concepts:

* **React-like hooks** for state management
* **Actions with inputs** for user interactions
* **Invariants** for business rule enforcement
* **Workflow/strict mode** using @xstate/fsm
* **Memory checkpoints** for audit trails
* **Markdown rendering** for AI context

## The Problem

An AI agent helps onboard an employee by:

1. Collecting employee details
2. Adding income sources
3. Verifying incomes
4. Completing onboarding

**Constraints:**
- Income cannot be negative
- Verification only after at least one income
- Onboarding only after all incomes are verified

## Running the Example

```bash
npm install
npm run build
npm start
```

The app will present a markdown interface showing:
- Current workflow phase
- Employee state
- Allowed actions
- Business goals

Choose actions by number, or type "checkpoints" to see the audit trail.

## Architecture

### State Shape
```typescript
type AppState = {
  workflow: "NEW" | "INCOME_ADDED" | "VERIFIED" | "COMPLETED";
  employee: {
    name: string;
    incomes: {
      source: string;
      amount: number;
      verified: boolean;
    }[];
  };
};
```

### Workflow FSM
Uses @xstate/fsm to control allowed transitions:
- NEW → INCOME_ADDED (AddIncome)
- INCOME_ADDED → VERIFIED (VerifyIncome)
- VERIFIED → COMPLETED (CompleteOnboarding)

### Actions
- **AddIncome**: Adds income source with amount
- **VerifyIncome**: Marks all incomes as verified
- **CompleteOnboarding**: Finalizes the process

### Invariants
- Income amounts must be positive
- All incomes must be verified before completion

### Checkpoints
Automatic snapshots before/after each action for recovery and auditing.

## Why This Example?

This demonstrates why RAM exists:
- **Deterministic workflows** prevent illegal state transitions
- **AI-friendly interfaces** via markdown
- **Safety through invariants** and checkpoints
- **Composable actions** with typed inputs
- **Memory management** for complex interactions

Perfect for enterprise applications requiring AI assistance with strict business rules.