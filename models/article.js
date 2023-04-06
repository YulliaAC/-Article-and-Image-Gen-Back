const mongoose = require('mongoose');
const {handleMongooseError} = require("../helpers");

const articleSchema = new mongoose.Schema (
    {
        title: {
            type: String,
            required: [true, 'Set title for article'],
        },
        body: {
            type: String,
            required: [true, 'Set body for article'],
        }
    },
    {versionKey: false}
);

articleSchema.post("save", handleMongooseError);

const Article = mongoose.model ('articles', articleSchema);

module.exports = {
  Article,
};