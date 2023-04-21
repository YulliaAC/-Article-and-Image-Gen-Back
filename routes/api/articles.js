const express = require('express');
const {generateArticle, getArticle, storeGoogleSheets} = require('../../controllers')

const router = express.Router();

router.post('/', generateArticle);
router.get('/generated/:articleId', getArticle);
router.get('/store', storeGoogleSheets);

module.exports = router;