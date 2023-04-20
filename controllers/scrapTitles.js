const puppeteer = require("puppeteer");
const validUrl = require("valid-url");

const fetchTittle = async (page, url) => {
    console.log(`Fetch page using url ${url}`);
    await page.goto(url);
    const element = await page.waitForSelector("h1");
    const value = await page.evaluate((element) => element.textContent, element);
    return value;
  };

  let titles = [];
  for (let titile_links of filterLinks) {
    titles.push(await fetchTittle(page, titile_links));
  }

  const scrapTitles = async (req, res) => {
    const url = req.body.url;
    if (url === "") {
      return res.status(400).json({ message: "provide url in body" });
    }
  
    if (!validUrl.isUri(url)) {
      return res.status(400).json({ message: `url: ${url} is not valid` });
    }
  
    const browser = await puppeteer.launch({});
    const page = await browser.newPage();
    try {
      await page.goto(url);
    } catch (error) {
      return res
        .status(400)
        .json({ message: `Not able to fetch url ${url}. Error: ${error}` });
    }
    let linksData = await page.$$eval("a", (articleLinks) => {
      return articleLinks.map((articleLink) => articleLink.href);
    });
  
    const maxLinks = 10;
    let countLinks = 0;
    let filterLinks = [];
  
    for (const link of linksData) {
      if (link.includes("/articles")) {
        countLinks = countLinks + 1;
        filterLinks.push(link);
        if (maxLinks === countLinks) {
          break;
        }
      }
    }
    await browser.close();
}

module.exports = {
    scrapTitles
}