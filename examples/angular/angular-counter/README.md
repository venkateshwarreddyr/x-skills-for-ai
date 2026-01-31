# Angular Counter Example

This is a full Angular app demonstrating the `@x-skills-for-ai/angular` wrapper.

## Folder Structure

```
examples/angular/angular-counter/
├─ package.json
├─ angular.json
├─ tsconfig.json
├─ tsconfig.app.json
├─ tsconfig.spec.json
├─ src/
│  ├─ main.ts
│  ├─ index.html
│  └─ app/
│     ├─ app.ts
│     ├─ app.html
│     ├─ app.config.ts
│     └─ counter/
│        ├─ counter.component.ts
│        ├─ counter.component.html
│        └─ counter.component.css
```

## Run Locally

1. Install dependencies at monorepo root:

```bash
cd ram
npm install
```

2. Build packages:

```bash
npm run build:all
```

3. Run the dev server:

```bash
npm run dev:angular-example
```

Or:

```bash
cd examples/angular/angular-counter
npm run dev
```

4. Open [http://localhost:4200/angular-counter/](http://localhost:4200/angular-counter/)

## Features

- Increment/Decrement counter with Angular signals.
- `XSkillDirective` registers `increment` and `decrement` skills.
- Skills executable via buttons or browser console:

```js
window.__XSKILLS__.execute("increment")
window.__XSKILLS__.execute("decrement")
