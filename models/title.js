const mongoose = require('mongoose');
const {handleMongooseError} = require("../helpers");

const scrapedTitleSchema = new mongoose.Schema (
    {
       title: {
        type: String,
        required: [true, 'Set a title']
       } 
    },
    {versionKey: false}
)

scrapedTitleSchema.post("save", handleMongooseError);

const scrapedTitle = mongoose.model ('scrapedTitles', scrapedTitleSchema);

module.exports = {
  scrapedTitle
};