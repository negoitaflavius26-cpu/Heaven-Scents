const express = require('express');
const router = express.Router();
const {citesteCategoria, paginaAcasa, paginaLogare, paginaInregistrare, logarePersoana, inregistrarePersoana,paginaBranduri,citesteBrand,uitareParola,emailParola,resetareParola} = require('../controllers/controller');
const modelComanda=require('../modele/modelComanda')

router.get('/home', paginaAcasa);



router.get('/home/categorie/:categorie',citesteCategoria)

router.get('/account/login/parola-uitata',uitareParola)

router.post('/account/login/parola-uitata',emailParola)

router.get(`/resetare-parola`, resetareParola)

router.get('/account/login', paginaLogare);

router.post('/account/login', logarePersoana);

router.get('/account/signup', paginaInregistrare);

router.post('/account/signup', inregistrarePersoana);

router.get('/home/branduri',paginaBranduri)

router.get('/home/branduri/:brand',citesteBrand)

module.exports = router;