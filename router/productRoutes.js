const express = require('express');
const router = express.Router();

const {showprodus,readprodus,cautareProdus,trimteReview,reviewUtil}=require('../controllers/productController')

router.get('/home/parfumuri', showprodus)

router.get('/home/parfumuri/produs/:_id',readprodus)

router.get('/home/cauta',cautareProdus)

router.post('/home/parfumuri/produs/:_id',trimteReview)

router.post('/home/pula',reviewUtil)

module.exports = router;