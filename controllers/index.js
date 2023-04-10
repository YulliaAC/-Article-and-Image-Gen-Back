const {ctrlWrapper} = require('../helpers');
const {generateArticle} = require('./generateArticles');

module.exports = {
    generateArticle: ctrlWrapper(generateArticle)
}