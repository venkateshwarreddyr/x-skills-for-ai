import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

import { PlaywrightBridge } from './bridge.js';
import type { InspectResult, ExecuteResult } from '../shared/types.js';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use('/browser', express.static(path.join(__dirname, '../browser')));

const bridge = new PlaywrightBridge();

app.get('/inspect', async (req, res) => {
  try {
    const result: InspectResult = await bridge.inspect();
    res.json(result);
  } catch (error) {
    console.error('Inspect error:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

app.post('/execute', async (req, res) => {
  try {
    const { skillId, payload = {}, actor } = req.body;
    if (!skillId) {
      return res.status(400).json({ error: 'skillId required' });
    }
    const result: ExecuteResult = await bridge.executeSkill(skillId, payload);
    res.json(result);
  } catch (error) {
    console.error('Execute error:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

const server = app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📱 Browser app: http://localhost:${PORT}/browser/index.html`);
  console.log('🔌 Launching Playwright bridge...');
  try {
    await bridge.launch(PORT);
    console.log('✅ Full system ready!');
    console.log('Test:');
    console.log(`  curl http://localhost:${PORT}/inspect`);
    console.log(`  curl -X POST http://localhost:${PORT}/execute -H "Content-Type: application/json" -d '{"skillId": "increment"}'`);
  } catch (error) {
    console.error('Bridge launch failed:', error);
  }
});

process.on('SIGINT', async () => {
  await bridge.close();
  server.close();
  process.exit(0);
});