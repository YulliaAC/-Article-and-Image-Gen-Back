const { Configuration, OpenAIApi } = require("openai");
const puppeteer = require("puppeteer");
const Url = require("url-parse");
const { Article } = require("../models/article");
require("dotenv").config();

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_KEY,
});

const openai = new OpenAIApi(configuration);

const generateArticle = async (req, res) => {
  let titles = [];
  let array = []
  const url = req.body.url;

  const browser = await puppeteer.launch({});
  const page = await browser.newPage();

  await page.goto(url);

  let linksData = await page.$$eval("a", (articleLinks) => {
    return articleLinks.map(articleLink => articleLink.href);
})
  const maxLinks = 10
  let countLinks = 0
  let filterLinks = [];
  for (const link of linksData) {
    if (link.includes('/articles')){
        countLinks = countLinks + 1;
        filterLinks.push(link);
        if (maxLinks == countLinks) {
            break;
        }
    }
  }
  console.log(filterLinks)
//   let linksData = await page.$$eval("a", (articleLinks) => {
//     return articleLinks.map((articleLink) => {
//         // console.log(`${articleLink.getAttribute("href")}`.includes("https://www.gamespot.com/"));

//         if (`${articleLink.getAttribute("href")}`.includes("/articles")) {
//             const 
//             const parsed_url = new Url(`${articleLink.getAttribute("href")}`)
//             if (parsed_url.protocol == '') {
//                 return {
//                     link: req.body.url + `${articleLink.getAttribute("href")}`,
//                 };
//             }
//             else {
//                 return {
//                     link: `${articleLink.getAttribute("href")}`,
//                 };
//             }
//         // const fullUrl = new Url(`${linkEl.getAttribute("href")}`);
//         // if (fullUrl.protocol === "") {
//         //   item.link = `${url} + ${linkEl.getAttribute("href")}`;
//         // }

//         }
//     });
//   });

//   const quantity = 10;
//   const slicedLinksData = linksData.slice(0, quantity);
//   console.log(slicedLinksData);

  for (let item of filterLinks) {
    console.log(item);
   
    // console.log(item.link);
    await page.goto(item);
    const element = await page.waitForSelector("h1");
    const value = await page.evaluate(
      (element) => element.textContent,
      element
    );
    console.log(value)
    titles.push(value);
  }
//   await browser.close();

  for (const title of titles) {
    const responseTitle = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Paraphrase the folowing title for the article: ${title}`,
      temperature: 1,
      max_tokens: 100,
      top_p: 1.0,
      frequency_penalty: 0.5,
      presence_penalty: 0.0,
    });

    const responseText = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Topic: ${title}, make an article in 1000 words`,
      temperature: 0.8,
      max_tokens: 4000,
      top_p: 1.0,
      frequency_penalty: 0.5,
      presence_penalty: 0.0,
    });

    const responseTags = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Create meta tags (title, 1 sentense description, keywords) for web page with the title: ${title}, return JS object`,
      temperature: 1,
      max_tokens: 1000,
      top_p: 1.0,
      frequency_penalty: 0.5,
      presence_penalty: 0.0,
    });

    // const responseImage = await openai.createImage({
    //     prompt: `${title}`,
    //     n: 1,
    //     size: '1024x1024'
    // })
    //   const image_url = responseImage.data.data[0].url;
    //   console.log(image_url);

    const articleText = responseText.data.choices[0].text;
    const articleTitle = responseTitle.data.choices[0].text;
    const metaTags = responseTags.data.choices[0].text;
    // console.log()
    // const objMetaTags = eval("(" + metaTags + ")");

    const newArticle = await Article.create({
      artTitle: articleTitle.toString(),
      body: articleText.toString(),
      metaTags: JSON.stringify(metaTags, null, 2),
    });
    // return newArticle;

//    console.log(newArticle);
    array.push(newArticle)
    
  }

  res.status(200).json(array);
};

module.exports = {
  generateArticle,
};
