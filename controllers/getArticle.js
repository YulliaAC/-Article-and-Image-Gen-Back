const { Article } = require("../models/article");

const getArticle = async (req, res) => {
  const { articleId } = req.params;
  const article = await Article.findById(articleId);

  const { title, description, keywords } = article.metaTags;
  const { _id, artTitle, body, image } = article;

  res.status(200).json({
    _id,
    artTitle,
    body,
    meta: {
      title,
      description,
      keywords,
    },
    image
  });
};

module.exports = {
  getArticle,
};
