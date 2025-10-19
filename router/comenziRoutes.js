const express=require('express')
const router=express.Router()
const {afiseazaComenzi,stergeComanda,afiseazaComenziCompletate}=require('../controllers/comenzi')


router.get('/admin/dashboard/comenzi',afiseazaComenzi)

router.get('/admin/dashboard/comenzi/completate',afiseazaComenziCompletate)

router.post('/admin/dashboard/comenzi/sterge',stergeComanda)

module.exports=router