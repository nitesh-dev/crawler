import { Scraper } from "./scraper.js";
import express from "express";

const app = express();
const port = 3000;

// new Scraper("https://www.chatbase.co/").start();
// new Scraper("https://typerbuddy.com").start();
// new Scraper("https://www.keybr.com/multiplayer").start();

// take url params

app.get("/", async (req, res) => {
  const url = req.query.url;

  if (!req.query.url) {
    res.status(400).json("Please provide url");
    return;
  }

  try {
    const urlTest = new URL(url as string);

    const data = await new Scraper(url as string).start();
    res.status(200).json(data.data);
  } catch (error: any) {
    res.status(400).json(error.message);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
