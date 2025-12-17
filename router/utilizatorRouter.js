const express=require('express')
const router=express.Router()
const {cumparaDinNou,stergeContact,paginaUtilizator,deconectareUtilizator, paginaContact, updateContact,schimbaParola}=require('../controllers/utilizator')


router.post('/cos/cumpara',cumparaDinNou)

router.get('/utilizator',paginaUtilizator)

router.post('/utilizator/deconectare',deconectareUtilizator)

router.get('/utilizator/contact',paginaContact)

router.post('/utilizator/contact/update',updateContact)

router.post('/utilizator/contact/sterge',stergeContact)

router.post('/resetare-parola',schimbaParola)

module.exports=router