const mongoose = require('mongoose');
const {handleMongooseError} = require("../helpers");

const articleSchema = new mongoose.Schema (
    {
        artTitle: {
            type: String,
            required: [true, 'Set title for article'],
        },
        body: {
            type: String,
            required: [true, 'Set body for article'],
        },
        metaTags: {
            type: Object,
        },
    },
    {versionKey: false}
);

articleSchema.post("save", handleMongooseError);

const Article = mongoose.model ('articles', articleSchema);

module.exports = {
  Article,
};