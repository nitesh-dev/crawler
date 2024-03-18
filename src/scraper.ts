import * as url from "url";
import { JSDOM } from "jsdom";
import fs from "fs";

import { fetchHtml, sleep, toTime } from "./utils.js";
import Logger from "./logger.js";

interface UrlStatus {
  success: boolean;
  url: string;
  text: string;
}

interface ScrapData {
  urls: string[];
  content: string;
}

const logger = new Logger("Scraper");

export class Scraper {
  startUrl = "";
  homeUrl = "";
  private parallelCount = 5;
  private pendingStack: string[] = [];
  private completedStack: UrlStatus[] = [];
  private startedAt = 0;
  private maxTime = 1000 * 30; // 30 sec

  private forceStop = false;

  constructor(url: string) {
    this.startUrl = url;
    this.homeUrl = new URL(url).origin;
    this.pendingStack.push(this.homeUrl);
  }

  private crawlerState = new Map<string, boolean>();

  public async start() {
    this.startedAt = new Date().getTime();

    const promises = [];
    for (let i = 0; i < this.parallelCount; i++) {
      promises.push(this.startScrapping("id: " + i));
    }
    // Wait for all promises to resolve
    await Promise.all(promises);

    console.log("page count: " + this.completedStack.length);
    // console.log(this.completedStack);
    fs.writeFileSync("output.json", JSON.stringify(this.completedStack));
    console.log("timeTaken: " + toTime(new Date().getTime() - this.startedAt));

    return this.completedStack;
  }


  private async startScrapping(id: string) {
    // register the crawler
    this.crawlerState.set(id, true);

    logger.info(`Scrapping started: ${id}`);
    while (this.isCrawlerBusy()) {
      if (this.forceStop) return;
      this.validateTimeOver();

      await sleep(300);
      await this.crawl(id);
    }
  }

  private isCrawlerBusy() {
    for (let [key, busy] of this.crawlerState) {
      if (busy) {
        return true;
      }
    }
    return false;
  }

  private validateTimeOver() {
    const currentTime = new Date().getTime();
    const diff = currentTime - this.startedAt;
    if (diff > this.maxTime) {
      logger.warn("Max time reached");
      this.forceStop = true;
    }
  }



  private async crawl(id: string) {
    let url = this.pendingStack.shift() as string;
    if (url) {
      this.crawlerState.set(id, true);
    } else {
      this.crawlerState.set(id, false);
      return;
    }

    const stack: UrlStatus = { success: false, url: url, text: "" };

    let html = await fetchHtml(url as string);
    if (html.isSuccess && html.data) {
      // let json = await this.scrapData(html.data as string, url as string)

      const data = this.scrapUrlAndText(html.data as string);

      if (data) {
        this.addUrlsToPendingStack(data.urls);
        stack.success = true;
        stack.text = data.content;
      }

      logger.info(`Scrapped by: ${id}`);

      // console.log(data);
    }


    // add to completed stack - filter the duplicate
    if(this.completedStack.findIndex((r) => r.url == stack.url) == -1) {
      this.completedStack.push(stack);
    }
  }

  private addUrlsToPendingStack(urls: string[]) {
    urls.forEach((rUrl) => {
      const url = this.getCleanUrl(rUrl);
      // const url = rUrl;
      if (!this.isUrlInStack(url)) {
        this.pendingStack.push(url);

        logger.info(`Url added to stack: ${url}`);
      } else {
        // logger.error(`Url already in stack: ${url}`);
      }
    });
  }

  private isUrlInStack(url: string) {
    let isExist = this.pendingStack.includes(url);
    if (!isExist) {
      const index = this.completedStack.findIndex((r) => r.url == url);
      isExist = index > -1;
    }

    return isExist;
  }

  private getCleanUrl(rUrl: string) {
    const url = new URL(rUrl);
    let link = url.origin + url.pathname;
    if(link.endsWith("/")) link = link.slice(0, link.length - 1);
    return link;
  }

  private scrapUrlAndText(htmlContent: string) {
    try {
      let document = new JSDOM(htmlContent).window.document;

      const links = new Map<string, string>();
      document.body.querySelectorAll("a").forEach((link) => {
        let url = link.href;
        if (url.startsWith("/")) url = this.homeUrl + url;

        // filter other sites and also filter the same site
        if (url.startsWith(this.homeUrl)) links.set(url, url);
      });

      let text = this.extractTextContent(document.body);

      text = text.replace(/\s+/g, " "); // remove extra spaces
      text = text.replace(/[\r\n]+/g, ""); // remove line breaks

      const data: ScrapData = {
        urls: [...links.values()],
        content: text,
      };

      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  private extractTextContent(element: HTMLElement) {
    let text = "";
    for (let node of element.childNodes) {
      if (node.nodeType === 3) {
        // Text node
        text += node.textContent + " ";
      } else if (node.nodeType === 1) {
        // Element node
        const tagName = (node as Element).tagName.toLowerCase();
        if (tagName !== "script" && tagName !== "style") {
          text += this.extractTextContent(node as HTMLElement);
        }
      }
    }
    return text;
  }
}
