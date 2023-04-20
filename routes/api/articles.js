const express = require('express');
const {generateArticle, getArticle} = require('../../controllers')

const router = express.Router();

router.post('/', generateArticle);
router.get('/:articleId', getArticle);


module.exports = router;