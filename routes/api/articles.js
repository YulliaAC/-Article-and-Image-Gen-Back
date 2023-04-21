const express = require('express');
const {generateArticle, getArticle} = require('../../controllers')
const {storeGoogleSheets} = require('../../middlewares/storeGoogleMiddleware');

const router = express.Router();

router.post('/', storeGoogleSheets, generateArticle);
router.get('/generated/:articleId', getArticle);
// router.get('/store', storeGoogleSheets);

module.exports = router;