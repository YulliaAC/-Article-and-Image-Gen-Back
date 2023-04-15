const {Article} = require('../models/article');
 
const getArticle = async(req, res) => {
    const {articleId} = req.params;
    const article = await Article.findById(articleId);

    const {title, description, keywords} = JSON.parse(article.metaTags);
    const {_id, artTitle, body} = article;
    
    obj = JSON.parse(article.metaTags)
    console.log(obj)
    res.status(200).json({
        _id,
        artTitle,
        body,
        meta: obj
    })
}


module.exports = {
    getArticle
}