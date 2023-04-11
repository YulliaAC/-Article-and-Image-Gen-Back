const {ctrlWrapper} = require('../helpers');
const {generateArticle} = require('./generateArticles');
const {getMetaTags} = require('./getMetaTags');

module.exports = {
    generateArticle: ctrlWrapper(generateArticle),
    getMetatags: ctrlWrapper(getMetaTags)
}