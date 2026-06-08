const express = require('express');
const { recommendTools } = require('../controllers/toolController');
const router = express.Router();
router.post('/recommend', recommendTools);
module.exports = router;
