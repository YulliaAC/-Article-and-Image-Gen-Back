const express = require('express');
const {generateArticle, getArticle, scrapTitles} = require('../../controllers')

const router = express.Router();

router.post('/', generateArticle);
router.get('/:articleId', getArticle);
router.post('/scrape', scrapTitles);


module.exports = router;