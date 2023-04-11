const {Article} = require('../models/article');
 
const getMetaTags = async(req, res) => {
    const {articleId} = req.params;
    const article = await Article.findById(articleId);

    const {title, description, keywords} = article.metaTags;
    
    res.status(200).json({
        title,
        description,
        keywords
    })
}

module.exports = {
    getMetaTags
 }