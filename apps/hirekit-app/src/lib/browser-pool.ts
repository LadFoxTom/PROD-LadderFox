import puppeteer, { Browser, Page } from 'puppeteer';

interface BrowserInstance {
  browser: Browser;
  activePages: number;
  requestCount: number;
}

class BrowserPool {
  private instance: BrowserInstance | null = null;
  private maxPages = 2;
  private retireAfter = 50;

  async getPage(): Promise<Page> {
    if (this.instance && this.instance.activePages < this.maxPages) {
      this.instance.activePages++;
      this.instance.requestCount++;

      if (this.instance.requestCount >= this.retireAfter) {
        const page = await this.instance.browser.newPage();
        this.retire();
        return page;
      }

      return this.instance.browser.newPage();
    }

    if (this.instance) {
      await this.retire();
    }

    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--disable-background-timer-throttling',
        '--memory-pressure-off',
      ],
    });

    this.instance = { browser, activePages: 1, requestCount: 1 };
    return browser.newPage();
  }

  async releasePage(page: Page): Promise<void> {
    try {
      await page.close();
    } catch {
      // Page may already be closed
    }
    if (this.instance && this.instance.activePages > 0) {
      this.instance.activePages--;
    }
  }

  private async retire(): Promise<void> {
    if (!this.instance) return;
    try {
      await this.instance.browser.close();
    } catch {
      // Ignore close errors
    }
    this.instance = null;
  }

  async cleanup(): Promise<void> {
    await this.retire();
  }
}

const browserPool = new BrowserPool();

process.on('SIGINT', async () => {
  await browserPool.cleanup();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await browserPool.cleanup();
  process.exit(0);
});

export { browserPool };
