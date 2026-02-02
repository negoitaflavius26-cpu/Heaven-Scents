const express = require('express');
const router = express.Router();

const {showprodus,readprodus,cautareProdus,trimteReview,reviewUtil,filtruProduseScumpe,filtruproduseIeftine,filtruProduseVandute}=require('../controllers/productController')

router.get("/home/parfumuri/cele-mai-vandute",filtruProduseVandute)

router.get('/home/parfumuri/produse-ieftine',filtruproduseIeftine)

router.get('/home/parfumuri/produse-scumpe',filtruProduseScumpe)

router.get('/home/parfumuri', showprodus)

router.get('/home/parfumuri/produs/:_id',readprodus)

router.get('/home/cauta',cautareProdus)

router.post('/home/parfumuri/produs/:_id',trimteReview)

router.post('/home/review-util', reviewUtil);

module.exports = router;