const mongoose = require('mongoose');
const {handleMongooseError} = require("../helpers");

const formDataSchema = new mongoose.Schema (
    {
        quantity: {
            type: Number,
            required: [true, 'Set quantity'],
        },
        gptBlogPrompt: {
            type: String,
        },
        imagesGeneralPrompt: {
            type: String,
        },
        wayOfGeneration: {
            type: String,
            enum: ["Input topic", "Input 1 competitor website"],
            required: [true, 'Set way of generation'],
        },
        url: {
            type: String,
        },
        topic: {
            type: String,
        },
    },
    {versionKey: false}
);

formDataSchema.post("save", handleMongooseError);

const FormData = mongoose.model ('formData', formDataSchema);  

module.exports = { 
    FormData
};