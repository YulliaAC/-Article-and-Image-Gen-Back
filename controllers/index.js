const {ctrlWrapper} = require('../helpers');
const {generateArticle} = require('./generateArticles');
const {getArticle} = require('./getMetaTags');

module.exports = {
    generateArticle: ctrlWrapper(generateArticle),
    getArticle: ctrlWrapper(getArticle)
}