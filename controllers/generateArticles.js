const { Configuration, OpenAIApi } = require("openai");
const {Article} = require('../models/article');
require("dotenv").config();

const configuration = new Configuration({
    apiKey: process.env.OPEN_AI_KEY,
});

const openai = new OpenAIApi(configuration);

const generateArticle = async (req, res) => {
    const title = req.body.title;
    console.log(req.body);
    // const title = req.body.title
    console.log(title);

    const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `Topic: ${title}, make an article in 1000 words`,
            temperature: 0.8,
            max_tokens: 1000,
            top_p: 1.0,
            frequency_penalty: 0.5,
            presence_penalty: 0.0
    })

    const articleText =  response.data.choices[0].text;
    // console.log(articleText);

    const newArticle =  await Article.create({title: title, body: articleText})
    res.status(200).json(newArticle)
}

module.exports = {
   generateArticle
}





