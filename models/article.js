const mongoose = require('mongoose');
const {handleMongooseError} = require("../helpers");

const articleSchema = new mongoose.Schema (
    {
        artTitle: {
            type: String,
            required: [true, 'Set title for the article'],
        },
        body: {
            type: String,
            required: [true, 'Set body for the article'],
        },
        metaTags: {
            type: Object,
            required: [true, 'Set meta tags for the article'],
        },
        image: {
            type: String,
        }
    },
    {versionKey: false}
);

articleSchema.post("save", handleMongooseError);

const Article = mongoose.model ('articles', articleSchema);

module.exports = {
  Article
};