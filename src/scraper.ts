import * as url from "url";

import { JSDOM } from "jsdom";

import { fetchHtml } from "./utils.js";
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
  private parallelCount = 10;
  private pendingStack: string[] = [];
  private completedStack: UrlStatus[] = [];
  private isRunning = false;
  private isCompleted = false;

  constructor(url: string) {
    this.startUrl = url;
    this.homeUrl = new URL(url).origin;
    this.pendingStack.push(this.homeUrl);
  }

  update() {
    console.log("update");
    this.startScrapping();
  }

  onCompleted() {
    this.isCompleted = true;

    // TODO call the callback if possible
  }

  private async startScrapping() {
    if (this.isRunning || this.isCompleted) return;
    if (this.pendingStack.length == 0) {
      logger.info(
        "Scrapping completed: " +
          this.completedStack.length +
          " urls completed."
      );

      console.log(this.completedStack)
      this.onCompleted();
      return;
    }

    this.isRunning = true;
    let url = this.pendingStack.shift() as string;

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

      console.log(data);
    }

    this.completedStack.push(stack);
    this.isRunning = false;
  }

  private addUrlsToPendingStack(urls: string[]) {
    urls.forEach((rUrl) => {
      //   const url = this.getCleanUrl(rUrl);
      const url = rUrl;
      if (!this.isUrlInStack(url)) {
        this.pendingStack.push(url);

        logger.info(`Url added to stack: ${url}`);
      }
      {
        logger.error(`Url already in stack: ${url}`);
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
    return url.origin + url.pathname;
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
