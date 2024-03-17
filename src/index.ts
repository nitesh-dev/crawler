import { Scraper } from "./scraper.js";

const scrapers = new Map<string, Scraper>();

new Scraper("https://typerbuddy.com/").start();

