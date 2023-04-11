const express = require('express');
const {generateArticle, getMetatags} = require('../../controllers')

const router = express.Router();

router.post('/', generateArticle);
router.get('/:articleId', getMetatags)

module.exports = router;