import { Browser, launch, LaunchOptions, Page, Response, WaitForSelectorOptions } from 'puppeteer';

export class PageHelper {
  private browser: Browser = null;
  private page: Page = null;
  private readonly retryCount: number = 3;

  constructor() {
    this.browser = null;
    this.page = null;
  }

  public async init(params?: LaunchOptions) {
    try {
      this.browser = await launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-background-timer-throttling',
          '--disable-backgrounding-occluded-windows',
          '--disable-renderer-backgrounding',
          `--window-size=${ (params?.defaultViewport?.width || 800) },${ (params?.defaultViewport?.height || 600) }`
        ],
        ignoreHTTPSErrors: true,
        dumpio: false,
        ...params
      });
      this.page = await this.browser.newPage();
      await Promise.all([
        this.page.coverage.startJSCoverage(),
        this.page.coverage.startCSSCoverage(),
      ]);
    } catch (Exception) /* istanbul ignore next */ {
      throw new Error(Exception.toString());
    }
  }

  public getBrowser() {
    return this.browser;
  }

  public getPageInstance() {
    return this.page;
  }

  public evaluate(cb: () => {}, ...args: any[]) {
    return this.page.evaluate(cb, args);
  }

  public selector(selector: string) {
    return this.page.$(selector);
  }

  /**
   * @param  {string} url
   * @returns Promise
   */
  public async open(url: string): Promise<Response> {
    let i: number = 0;
    while (i < this.retryCount) {
      try {
        return await this.page.goto(url);
      } catch (Exception) /* istanbul ignore next */ {
        i++;
        if (i === this.retryCount) {
          throw new Error(Exception.toString());
        }
      }
    }
  }

  /**
   * @returns Promise
   */
  public async getTitle(): Promise<string> {
    let i: number = 0;
    while (i < this.retryCount) {
      try {
        return await this.page.title();
      } catch (Exception) /* istanbul ignore next */ {
        i++;
        if (i === this.retryCount) {
          throw new Error(Exception.toString());
        }
      }
    }
  }

  /**
   * @returns Promise
   */
  public async getURL(): Promise<string> {
    let i: number = 0;
    while (i < this.retryCount) {
      try {
        return await this.page.url();
      } catch (Exception) /* istanbul ignore next */ {
        i++;
        if (i === this.retryCount) {
          throw new Error(Exception.toString());
        }
      }
    }
  }

  /**
   * @param  {string} elementSelector
   * @returns Promise
   */
  public async clickElement(elementSelector: string): Promise<void> {
    let i: number = 0;
    while (i < this.retryCount) {
      try {
        await this.waitForSelector(elementSelector);
        return await this.page.click(elementSelector);
      } catch (Exception) /* istanbul ignore next */ {
        try {
          i++;
          await this.waitForSelector(elementSelector);
          await this.page.evaluate('arguments[0].click()', elementSelector);
          continue;
        } catch (Exception) /* istanbul ignore next */ {
          i++;
          if (i === this.retryCount) {
            throw new Error(Exception.toString());
          }
        }
      }
    }
  }

  /**
   * @param  {string} elementSelector
   * @param  {string} text
   * @returns Promise
   */
  public async sendElementText(elementSelector: string, text: string): Promise<void> {
    let i: number = 0;
    while (i < this.retryCount) {
      try {
        return await this.page.type(elementSelector, text);
      } catch (Exception) /* istanbul ignore next */ {
        try {
          i++;
          await this.waitForSelector(elementSelector);
          await this.page.evaluate('arguments[0].click()', elementSelector);
          continue;
        } catch (Exception) /* istanbul ignore next */ {
          i++;
          if (i === this.retryCount) {
            throw new Error(Exception.toString());
          }
        }
      }
    }
  }

  public waitForSelector(elementSelector: string, options?: WaitForSelectorOptions) {
    return this.page.waitForSelector(elementSelector, options);
  }

  public getContent() {
    return this.page.content();
  }

  /**
   * @param  {string} elementSelector
   * @returns Promise
   */
  public async clearElement(elementSelector: string) {
    let i: number = 0;
    while (i < this.retryCount) {
      try {
        const elementHandle = await this.page.$(elementSelector);
        await elementHandle.click({ clickCount: 3 });
        return await elementHandle.press('Backspace');
      } catch (Exception) /* istanbul ignore next */ {
        try {
          i++;
          await this.page.waitForSelector(elementSelector);
          await this.page.evaluate('arguments[0].click()', elementSelector);
          continue;
        } catch (Exception) /* istanbul ignore next */ {
          i++;
          if (i === this.retryCount) {
            throw new Error(Exception.toString());
          }
        }
      }
    }
  }

  /**
   * @param  {string} keys
   * @returns Promise
   */
  public async enterKeys(keys: string): Promise<void> {
    let i: number = 0;
    while (i < this.retryCount) {
      try {
        return await this.page.keyboard.press(keys);
      } catch (Exception) /* istanbul ignore next */ {
        i++;
        if (i === this.retryCount) {
          throw new Error(Exception.toString());
        }
      }
    }
  }

  /**
   * @param  {ElementHandle} element
   * @param  {any} answers
   * @returns Promise
   */

  public screenshot() {
    try {
      return this.page.screenshot();
    } catch (Exception) /* istanbul ignore next */ {
      throw new Error(Exception.toString());
    }
  }


  /**
   * @example const [ element ] = await page.getElementsByText(text);
   * @param text
   */
  public async getElementsByText(text: string) {
    const xpath = `//a[contains(text(),'${text}')]`;

    await this.page.waitForXPath(xpath, { timeout: 10 * 2000 });

    return await this.page.$x(xpath);
  }

  public delay(timeout: number) {
    return this.page.waitFor(timeout);
  }

  public async close() {
    try {
      // const pti = require('puppeteer-to-istanbul');
      const [jsCoverage, cssCoverage] = await Promise.all([
        this.page.coverage.stopJSCoverage(),
        this.page.coverage.stopCSSCoverage(),
      ]);
      // pti.write(jsCoverage);
      // pti.write(cssCoverage);
      return await this.browser.close();
    } catch (Exception) /* istanbul ignore next */ {
      throw new Error(Exception.toString());
    }
  }
}
