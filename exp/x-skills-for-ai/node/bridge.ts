import { chromium, Page, Browser } from 'playwright';
import type { InspectResult, ExecuteResult } from '../shared/types.js';

export class PlaywrightBridge {
  private page: Page | null = null;
  private browser: Browser | null = null;

  async launch(port: number): Promise<void> {
    this.browser = await chromium.launch({ headless: false }); // Visible for dev, set true for prod
    this.page = await this.browser.newPage();
    await this.page.goto(`http://localhost:${port}/browser/index.html`);
    await this.page.waitForLoadState('networkidle');
    // Ensure __XSKILLS__ is ready
    await this.page.waitForFunction(() => !!window.__XSKILLS__);
    console.log('✅ Playwright RPC Bridge ready - Browser loaded with skills');
    await this.page.addScriptTag({ url: `http://localhost:${port}/browser/examples/counter/app.js` });
    await this.page.waitForTimeout(1000); // Allow app to load and register skills
  }

  async inspect(): Promise<InspectResult> {
    if (!this.page) {
      throw new Error('Bridge not launched. Call launch() first.');
    }
    return await this.page.evaluate(() => window.__XSKILLS__.inspect()) as InspectResult;
  }

  async executeSkill(skillId: string, payload: any = {}): Promise<ExecuteResult> {
    if (!this.page) {
      throw new Error('Bridge not launched. Call launch() first.');
    }
    return await this.page.evaluate(
      (arg) => window.__XSKILLS__.executeSkill(arg[0], arg[1]),
      [skillId, payload]
    ) as ExecuteResult;
  }

  async close(): Promise<void> {
    if (this.page) {
      await this.page.close();
    }
    if (this.browser) {
      await this.browser.close();
    }
  }
}