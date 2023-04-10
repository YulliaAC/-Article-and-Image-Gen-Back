const express = require('express');
const {generateArticle} = require('../../controllers')

const router = express.Router();

router.post('/', generateArticle);

module.exports = router;