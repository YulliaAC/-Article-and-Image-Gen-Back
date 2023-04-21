const {generateArticle} = require('./generateArticles');
const {getArticle} = require('./getArticle');
const {storeGoogleSheets} = require('./storeGoogleSheets');

module.exports = {
    generateArticle,
    getArticle,
    storeGoogleSheets
}