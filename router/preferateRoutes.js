const express=require('express')
const router=express.Router()

const {adaugaProdus,paginaPreferate,stergePreferat}=require('../controllers/preferateController')

router.get('/preferate',paginaPreferate)


router.post('/preferate',adaugaProdus)


router.post('/preferate/sterge',stergePreferat)

module.exports=router