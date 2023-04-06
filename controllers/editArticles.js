const ctrlWrapper = require('../helpers');
const { Configuration, OpenAIApi } = require("openai");
const {Article} = require('../models/article');

const configuration = new Configuration({
    apiKey: process.env.OPEN_AI_KEY,
});

const openai = new OpenAIApi(configuration);




