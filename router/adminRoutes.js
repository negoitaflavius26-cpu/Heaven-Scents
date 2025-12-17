const express=require('express')
const router=express.Router()
const {stergeProdus,isAdmin,afiseazaActivitate,cautareProdus,adaugaprodus,upload,afiseazaProduseAdmin,detaliiProdusAdmin,updateProdus, arataUtilizator,arataContact,updateContactAdmin,cautareComanda}=require('../controllers/adminController')





router.get('/admin/cauta', isAdmin,cautareProdus)

router.get('/admin/dasboard/produse/:_id',isAdmin,detaliiProdusAdmin)

router.post('/admin/dasboard/produse/actualizare',upload.single('picture'),isAdmin,updateProdus)

router.post('/admin/dasboard/produse/sterge',isAdmin,stergeProdus)

router.get('/admin/dashboard',isAdmin,afiseazaActivitate)


router.get("/admin/dashboard/produse",isAdmin,afiseazaProduseAdmin)

router.get('/admin/dashboard/wallet',(req,res)=>{
    res.render('wallet')
},isAdmin)

router.get("/admin/dashboard/produse/incarca",(req,res)=>{
    res.render('upload')
},isAdmin)

router.post('/admin/dashboard/produse/incarca', upload.single('picture'),  isAdmin,adaugaprodus)

router.post('/admin/utilizator/:email',isAdmin,arataUtilizator)

router.get('/admin/utilizator/contact/:email',isAdmin,arataContact)

router.post('/admin/utilizator/contact/:email',isAdmin,arataContact)

router.post('/admin/utilizator/contact/actualizeaza/:email',isAdmin,updateContactAdmin)

router.get("/admin/dashboard/statistici",(req,res)=>{
    res.render('statistici')
},isAdmin)

router.get('/admin/idComanda',isAdmin,cautareComanda)

module.exports=router;


