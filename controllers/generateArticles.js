const { Configuration, OpenAIApi } = require("openai");
const {Article} = require('../models/article');
require("dotenv").config();

const configuration = new Configuration({
    apiKey: process.env.OPEN_AI_KEY,
});

const openai = new OpenAIApi(configuration);

const generateArticle = async (req, res) => {
    const title = req.body.title;
    // console.log(req.body);
    // console.log(title);

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


    const articleText = responseText.data.choices[0].text;
    const articleTitle = responseTitle.data.choices[0].text;
    const metaTags = responseTags.data.choices[0].text;

    const newArticle =  await Article.create({title: articleTitle, body: articleText, metaTags: metaTags})
    res.status(200).json(newArticle)
}



module.exports = {
   generateArticle,
}





