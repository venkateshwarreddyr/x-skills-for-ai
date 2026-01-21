Below is a **clean, practical README** you can put directly into a repo.
No hype, no fluff — written for engineers.

---

# AILang Compiler

**Build AI-compatible systems by compiling intent into explicit workflows, state machines, and action contracts.**

---

## Why this exists

Modern applications are built for **humans + browsers**:

* UI hides state
* Buttons imply constraints
* Logic is scattered across frontend + backend

AI cannot reliably operate these systems.

**AILang solves this by making application logic explicit and machine-readable.**

Instead of building UI-first systems, we build:

* explicit state
* explicit actions
* explicit constraints
* deterministic workflows

Then:

* humans use UI on top
* AI operates directly on the contract

---

## What this compiler does

AILang compiles **high-level intent** into **executable decision systems**.

```
AILang
  ↓
State Machine / Workflow
  ↓
Action Schemas (tools)
  ↓
Event Logs
  ↓
AI + Humans
```

---

## Core Concepts

### 1. State (Single Source of Truth)

```ailang
state Order {
  status: CREATED | PAID | CONFIRMED | CANCELLED
  balance: number
  seat: string?
}
```

No hidden UI state.
No implicit transitions.

---

### 2. Actions (What can be done)

```ailang
action Pay(amount: number) {
  requires Order.status == CREATED
  requires Order.balance >= amount
  effect Order.status = PAID
}
```

Actions replace:

* buttons
* forms
* UI flows

---

### 3. Constraints (Why things fail)

```ailang
constraint SeatAvailable {
  seat not in ReservedSeats
}
```

Constraints are:

* explicit
* evaluatable
* logged

---

### 4. Workflow (Ordering, Time, Retries)

```ailang
workflow MovieBooking {
  start -> SelectSeat
  SelectSeat -> Pay
  Pay -> Confirm
}
```

Workflows define:

* valid sequences
* timeouts
* retries
* compensation

---

## What gets generated

The compiler outputs **infrastructure-ready artifacts**:

### 1. Workflow Definition

* Temporal
* AWS Step Functions
* Conductor
* BPMN

### 2. Action Schemas

* OpenAI / Anthropic tool specs
* JSON Schema
* HTTP APIs

### 3. Runtime Contracts

* allowed actions per state
* reasoned rejections
* replayable logs

---

## Example: Movie Ticket Booking

### AILang input

```ailang
state Booking {
  status: INIT | SEAT_SELECTED | PAID | CONFIRMED
  balance: number
}

action SelectSeat(seat: string) {
  requires status == INIT
  effect status = SEAT_SELECTED
}

action Pay(amount: number) {
  requires status == SEAT_SELECTED
  requires balance >= amount
  effect status = PAID
}

action Confirm {
  requires status == PAID
  effect status = CONFIRMED
}
```

### Generated AI Action Contract

```json
{
  "name": "Pay",
  "input_schema": {
    "amount": "number"
  },
  "constraints": [
    "status == SEAT_SELECTED",
    "balance >= amount"
  ]
}
```

AI can now:

* inspect state
* choose valid actions
* understand failures

No UI scraping.

---

## Debugging Philosophy

> **We debug decisions, not screens.**

### Required features

* deterministic state
* structured action logs
* constraint evaluation reasons
* full replay

Example failure log:

```json
{
  "action": "Pay",
  "result": "rejected",
  "reasons": ["balance < amount"]
}
```

This is the equivalent of DevTools for AI systems.

---

## Compiler Architecture

```
parser/
  └─ AILang grammar
analyzer/
  └─ state validation
  └─ constraint checking
ir/
  └─ intermediate decision model
generators/
  ├─ temporal/
  ├─ step-functions/
  ├─ openai-tools/
runtime/
  └─ action registry
  └─ event logger
```

---

## Non-Goals

* ❌ Not a UI framework
* ❌ Not an AI agent framework
* ❌ Not prompt engineering

AILang is **application logic**, not presentation.

---

## Who this is for

* Backend engineers
* Platform teams
* AI infrastructure builders
* Workflow-heavy domains (payments, bookings, ops)

If your system has:

* multi-step flows
* constraints
* money
* retries
* humans + AI

You need this.

---

## Design Principles

1. Explicit > implicit
2. Deterministic > probabilistic
3. Replayable > observable
4. Contracts > prompts
5. AI is a user, not a scraper

---

## Roadmap (suggested)

* [ ] Grammar + parser
* [ ] Type checker
* [ ] Temporal generator
* [ ] OpenAI tool generator
* [ ] Event-sourced runtime
* [ ] Replay CLI
* [ ] Visualizer (optional, human-only)

---

## One-line vision

> **AILang does for AI what React did for browsers —
> but at the decision layer, not the view layer.**

---

If you want next:

* a **minimal grammar**
* a **Temporal codegen example**
* or a **real enterprise workflow (billing, refunds)**

Say the word.
