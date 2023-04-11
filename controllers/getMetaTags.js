const {Article} = require('../models/article');
 
const getMetaTags = async(req, res) => {
    const {articleId} = req.params;
    const article = await Article.findById(articleId);
    
    res.status(200).json(article.metaTags)
}

module.exports = {
    getMetaTags
 }