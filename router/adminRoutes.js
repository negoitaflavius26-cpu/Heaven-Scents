const express=require('express')
const router=express.Router()
const {stergeProdus,afiseazaActivitate,cautareProdus,adaugaprodus,upload,afiseazaProduseAdmin,detaliiProdusAdmin,updateProdus, arataUtilizator,arataContact,updateContactAdmin,cautareComanda}=require('../controllers/adminController')





router.get('/admin/cauta', cautareProdus)

router.get('/admin/dasboard/produse/:_id',detaliiProdusAdmin)

router.post('/admin/dasboard/produse/actualizare',upload.single('picture'),updateProdus)

router.post('/admin/dasboard/produse/sterge',stergeProdus)

router.get('/admin/dashboard',afiseazaActivitate)


router.get("/admin/dashboard/produse",afiseazaProduseAdmin)

router.get('/admin/dashboard/wallet',(req,res)=>{
    res.render('wallet')
})

router.get("/admin/dashboard/produse/incarca",(req,res)=>{
    res.render('upload')
})

router.post('/admin/dashboard/produse/incarca', upload.single('picture'),  adaugaprodus)

router.post('/admin/utilizator/:email',arataUtilizator)

router.get('/admin/utilizator/contact/:email',arataContact)

router.post('/admin/utilizator/contact/:email',arataContact)

router.post('/admin/utilizator/contact/actualizeaza/:email',updateContactAdmin)

router.get("/admin/dashboard/statistici",(req,res)=>{
    res.render('statistici')
})

router.get('/admin/idComanda',cautareComanda)

module.exports=router;


