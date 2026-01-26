import express from 'express';
import cors from 'cors';
import type { Action } from 'x-skills-for-ai/types';
import { FinancialAdjustmentApp } from './index.js';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

let currentResult = FinancialAdjustmentApp();

app.get('/state', (req, res) => {
  res.json(currentResult);
});

app.post('/action', (req, res) => {
  const { action, payload } = req.body as { action: string, payload?: any };
  const actionObj = { name: action } as any;
  currentResult = FinancialAdjustmentApp(actionObj, payload);
  res.json(currentResult);
});

app.listen(port, () => {
  console.log(`Finance Adjustment App server running at http://localhost:${port}/state`);
  console.log(`POST to /action with { "action": "RequestAdditionalDocuments", "payload": {} }`);
});