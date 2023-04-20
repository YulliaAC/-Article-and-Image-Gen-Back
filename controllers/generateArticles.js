const { Configuration, OpenAIApi } = require("openai");
const { Client, GatewayIntentBits } = require("discord.js");
const puppeteer = require("puppeteer");
const { Article } = require("../models/article");
require("dotenv").config();
const validUrl = require("valid-url");
const robot = require("robotjs");

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_KEY,
});

const openai = new OpenAIApi(configuration);

const fetchTittle = async (page, url) => {
  console.log(`Fetch page using url ${url}`);
  await page.goto(url);
  const element = await page.waitForSelector("h1");
  const value = await page.evaluate((element) => element.textContent, element);
  return value;
};

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    // GatewayIntentBits.GuildMembers,
  ],
});


// const imageGen = (title) => {

// client.on('messageCreate', message => {
//     robot.typeString(`/imagine prompt: ${title}`);
//     setTimeout(() => robot.keyTap("enter"), 1000);

// if (message.content.includes('893133616538869790')) {
//   console.log('it`s midjorney');
//   console.log(`${message}`);
//   message.attachments.map((el) => el.url);
// }

// })
// // client.login(process.env.DISCORD_TOKEN)
// }

const generateAiArticle = async (title) => {
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
    prompt: `Topic: ${title}, make an article in 1000 words, make the article valid for anti-bot detecting`,
    temperature: 0.8,
    max_tokens: 4000,
    top_p: 1.0,
    frequency_penalty: 0.5,
    presence_penalty: 0.0,
  });

  const responseTags = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `Create meta tags (title, 1 sentense description, keywords) for web page with the title: ${title}, put this tags to YAML object and escape special characters`,
    temperature: 1,
    max_tokens: 1000,
    top_p: 1.0,
    frequency_penalty: 0.5,
    presence_penalty: 0.0,
  });

  //   const responseImage = await openai.createImage({
  //     prompt: `${title}`,
  //     n: 1,
  //     size: '1024x1024'
  // })

  const metaTagsRaw = responseTags.data.choices[0].text.split("\n");

  let tags = {};
  for (const line of metaTagsRaw) {
    const splited_line = line.split(":");
    if (splited_line.length > 1) {
      key = splited_line[0];
      value = splited_line[1];
      tags[key] = value;
    }
  }

  let image;
  const article = {
    text: responseText.data.choices[0].text,
    title: responseTitle.data.choices[0].text,
    tags: tags,
    image: image,
  };
  // responseImage.data.data[0].url
  return article;
};

const generateArticle = async (req, res) => {
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

  const maxLinks = 1;
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

  let titles = [];
  for (let titile_links of filterLinks) {
    titles.push(await fetchTittle(page, titile_links));
  }

  // const image = (title) => {
  //   client.on('ready', () => {
  //     console.log(`Logged in as ${client.user.tag}!`);
  //    });

  //   robot.typeString(`/imagine prompt:${title}`);
  //   robot.keyTap("enter")

  //   client.on('messageCreate', message => {

  //   if (message.content.includes('893133616538869790')) {
  //     console.log('it`s midjorney');
  //     console.log(`${message}`);
  //     return message.attachments.map((el) => el.url);
  //   }})
  //   client.login(process.env.DISCORD_TOKEN)
  // }

  await browser.close();


  let openAIResponces = [];
  for (const title of titles) {
    openAIResponces.push(generateAiArticle(title));

    client.on("ready", () => {
      const channel = client.channels.cache.get('1097873441333448789')
      channel.send('image')
      console.log(`Logged in as ${client.user.tag}!`);
    });

    client.on("messageCreate", (message) => {
      if (message.content === 'image') {
        robot.typeString(`/imagine prompt: ${title}`);
        setTimeout(() => robot.keyTap("enter"), 1500);
      }
      
      if (message.content.includes("893133616538869790")) {
        console.log("it`s midjorney");
        console.log(`${message}`);
        image = message.attachments.map((el) => el.url);
      }
    });
    client.login(process.env.DISCORD_TOKEN);
  }

  const generateArticles = Promise.all(openAIResponces);
  const generatedArticles = await generateArticles;

  let ids = [];
  for (const article of generatedArticles) {
    console.log(article);
    const newArticle = await Article.create({
      artTitle: article.title,
      body: article.text,
      metaTags: article.tags,
      image: article.image,
    });
    ids.push(newArticle._id);
  }
  res.status(200).json(ids);
};

module.exports = {
  generateArticle,
};
