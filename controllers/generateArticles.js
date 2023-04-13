const { Configuration, OpenAIApi } = require("openai");
const puppeteer = require('puppeteer');
const {Article} = require('../models/article');
require("dotenv").config();

const configuration = new Configuration({
    apiKey: process.env.OPEN_AI_KEY,
});

const openai = new OpenAIApi(configuration);  



const generateArticle = async (req, res) => {
        let titles = [];
  
        const browser = await puppeteer.launch({})
        const page = await browser.newPage();
    
        await page.goto('https://www.gamespot.com/')

        // const title = async () => {
            const element = await page.waitForSelector("a")
            const title = await page.evaluate(element => element.textContent, element)
            // await page.waitForSelector('a');
            // links = links.filter(link => link.querySelector('h1'))
            // console.log(links);
            // browser.close();
        // }
        
        // for(i = 1; i < 11; i++){
        // const element = await page.waitForSelector("a(" + i + ")")
        // // const element = await page.waitForSelector("h1")
        // // const title = await page.evaluate(element => element.textContent, element)
        // titles.push(await page.evaluate(element => element.textContent, element))
        // console.log(titles);
        // }
        browser.close();
        

    const responseTitle = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `Paraphrase the folowing title for the article: ${title}`,
        temperature: 1,
        max_tokens: 100,
        top_p: 1.0,
        frequency_penalty: 0.5,
        presence_penalty: 0.0
    })

    const responseText = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `Topic: ${title}, make an article in 1000 words`,
        temperature: 0.8,
        max_tokens: 4000,
        top_p: 1.0,
        frequency_penalty: 0.5,
        presence_penalty: 0.0
    })


    const responseTags = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `Create meta tags (title, 1 sentense description, keywords) for web page with the title: ${title}, return JS object`,
        temperature: 1,
        max_tokens: 1000,
        top_p: 1.0,
        frequency_penalty: 0.5,
        presence_penalty: 0.0
    })

    // // const responseImage = await openai.createImage({
    // //     prompt: `${title}`,
    // //     n: 1,
    // //     size: '1024x1024'
    // // })
    // //   const image_url = responseImage.data.data[0].url;
    // //   console.log(image_url);

    const articleText = responseText.data.choices[0].text;
    const articleTitle = responseTitle.data.choices[0].text;
    const metaTags = responseTags.data.choices[0].text;
    const objMetaTags = eval('(' + metaTags + ')');

   
    const newArticle =  await Article.create({artTitle: articleTitle, body: articleText, metaTags: objMetaTags})
    res.status(200).json(newArticle)
}



module.exports = {
   generateArticle,
}





