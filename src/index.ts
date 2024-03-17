import { Scraper } from "./scraper.js";

console.log("Hello, world!");

// map of scrapers

const scrapers = new Map<string, Scraper>();

// loop
function update() {
  for (let [url, scraper] of scrapers) {
    scraper.update();
  }
}

// add some task
scrapers.set(
  "1",
//   new Scraper("https://www.chatbase.co/")
  new Scraper("https://prochimps.com/")
);

setInterval(update, 1000);
