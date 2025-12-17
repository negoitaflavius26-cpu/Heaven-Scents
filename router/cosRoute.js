const express=require('express')
const router= express.Router()
const {paginaCos,stergeProdus,paginaComanda,variatieProdus,adaugaInCos}=require('../controllers/cosCumparaturi')

const {detaliiComanda}=require('../controllers/comanda')

router.get('/cos', paginaCos);

router.post('/cos', adaugaInCos);

router.get('/cos/detalii', paginaComanda);

router.post('/cos/detalii', detaliiComanda);

router.post('/cos/comanda', detaliiComanda);

router.post('/cos/sterge', stergeProdus);

router.post('/home/parfumuri/produs/:_id/:qunatity/:price', variatieProdus);
module.exports=router