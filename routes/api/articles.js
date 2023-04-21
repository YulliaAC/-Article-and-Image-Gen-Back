const express = require('express');
const {generateArticle, getArticle} = require('../../controllers')
const {storeGoogleSheets} = require('../../controllers/storeGoogleSheets');

const router = express.Router();

router.post('/', generateArticle);
router.get('/generated/:articleId', getArticle);
router.get('/store', storeGoogleSheets);

module.exports = router;