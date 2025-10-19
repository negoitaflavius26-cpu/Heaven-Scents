const Joi = require('@hapi/joi')
const cheerio=require('cheerio')
const bcrypt=require('bcrypt')
const {readFileSync}=require('fs')
const modelInregistrare=require('../modele/modelLogare')
const modelProduse = require('../modele/modelProdus')
const hbs=require('handlebars')
const fs = require('fs')
const nodemailer = require('nodemailer');
const crypto=require('crypto');
const jwt=require('jsonwebtoken')
const modelLogare = require('../modele/modelLogare')
const { error } = require('console')
const { CallTracker } = require('assert')
require("dotenv").config()



const paginaAcasa= async (req,res)=>{
    try {
        const variante=await modelProduse.find().distinct('categorie').sort()
        console.log(variante)
        return res.render('home',{variante})
    } catch (error) {
        console.log(error)
    }
}

const paginaExersare= async(req,res)=>{
    return res.render('w3')
}



const paginaLogare= async(req,res)=>{
    try {
        const variante=await modelProduse.find().distinct('categorie').sort()
        console.log(variante)
        return res.render('login',{variante})
    } catch (error) {
        console.log(error)
    }
}

const paginaInregistrare= async(req,res)=>{
    try {
        const variante=await modelProduse.find().distinct('categorie').sort()
        console.log(variante)
        return res.render('signup',{variante})
    } catch (error) {
        console.log(error)
    }
}

//Ascundere parole

// Schema Joi

const schemaEmail=Joi.object({

    email: Joi.string().required().email().messages({
        'string.base': `Adresa de email trebuie să fie un șir de caractere`,
        'string.empty': `Adresa de email nu trebuie să fie goală`,
        'string.email': `Trebuie să introduceți o adresă de email validă`,
        'string.min': `Adresa de email trebuie să aibă cel puțin {#limit} caractere`,
        'any.required': `Adresa de email este obligatorie`,
    })
});

const schema= Joi.object({
    nume: Joi.string().min(3).required().messages({
        'string.base': `Campul 'Nume' trebuie să fie un șir de caractere`,
        'string.empty': `Campul 'Nume' nu trebuie să fie gol`,
        'string.min': `Campul 'Nume' trebuie să aibă cel puțin {#limit} caractere`,
        'any.required': `Campul 'Nume' este obligatoriu`,
      }),
      email: Joi.string().required().email().messages({
        'string.base': `Adresa de email trebuie să fie un șir de caractere`,
        'string.empty': `Adresa de email nu trebuie să fie goală`,
        'string.email': `Trebuie să introduceți o adresă de email validă`,
        'string.min': `Adresa de email trebuie să aibă cel puțin {#limit} caractere`,
        'any.required': `Adresa de email este obligatorie`,
      }),  
      parola: Joi.string().min(8).required().messages({
        'string.base': `Parola trebuie să fie un șir de caractere`,
        'string.empty': `Parola nu trebuie să fie goală`,
        'string.min': `Parola trebuie să aibă cel puțin {#limit} caractere`,
        'any.required': `Campul 'Parola' este obligatoriu`,
      }),
      verificaParola:Joi.string().min(8).required().messages({
        'string.base': `Parola trebuie să fie un șir de caractere`,
        'string.empty': `Reintodu parola pentru verificare`,
        'string.min': `Parola trebuie să aibă cel puțin {#limit} caractere`,
        'any.required': `Campul 'Verificare Parola' este obligatoriu`,
      }),
})

// Inregistare persoane

const inregistrarePersoana= async(req,res)=>{
    const {error}= await schema.validate(req.body)
    const variante=await modelProduse.find().distinct('categorie').sort()
    if(error){ 
        let mesajPersoana = error.details[0].message;
        return res.render('signup',{error:mesajPersoana,variante})
    }
    try {
        // ascundere parola cu bcrypt 
        const salt = await bcrypt.genSalt(10); 
        const hashPassword = await bcrypt.hash(req.body.parola, salt);
        const checkPassword= await bcrypt.compare(req.body.verificaParola,hashPassword)
        const utilizator={
            nume:req.body.nume,
            email:req.body.email,
            parola:hashPassword,
            verificaParola:checkPassword,
        }
        console.log(utilizator)
        const verificaUserNume= await modelInregistrare.find({nume:utilizator.nume})
        const verificaUserEmail= await modelInregistrare.find({email:utilizator.email})
        if(verificaUserEmail.length > 0){
            let mesajPersoana=(`Emailul ${utilizator.email} a fost deja folosit`)
            return res.render('signup',{mesajPersoana,variante})
        } 
        if(utilizator.verificaParola===false){
            console.log('Parola nu este corecta cu cea de mai sus')
        }
        if(verificaUserNume.length===0 && utilizator.verificaParola===true){
        await modelInregistrare.insertMany([utilizator])
        req.session.nume = utilizator.nume;
        req.session.email=utilizator.email;
        req.session.save()
        return res.redirect('/home/parfumuri')
        }
        else{
            let mesajPersoana=(`Numele ${utilizator.nume} este deja folosit`)
            console.log(mesajPersoana)
            return res.render('signup',{mesajPersoana,variante})
        }
    } catch (error) {
        res.status(400).send(error)
    }
}

 // Logare Persoane
const logarePersoana= async (req,res)=>{
    try {
        const verifica=await modelInregistrare.findOne({email:req.body.email})
        const variante=await modelProduse.find().distinct('categorie').sort()
        if(!verifica){
            let mesajPersoana=(`Email-ul: ${req.body.email}  nu a fost gasit`)
            return res.render('login',{mesajPersoana,variante})
        }
        // verifica.parola este hash.ul stocat al parolei
        const utilizator= await bcrypt.compare(req.body.parola, verifica.parola)
        
        if (!req.session.incercariNereusite) {
            req.session.incercariNereusite = 0; // Initialize attempts
        }
        
        console.log('Asta e utilizator',utilizator)
        if(!utilizator){
            let mesajPersoana=('Parola este gresita')
            req.session.incercariNereusite++;
            const uitareParola=req.session.incercariNereusite
            console.log(req.session.incercariNereusite)
            return res.render('login',{mesajPersoana,variante,uitareParola})
        }

        if(verifica.rol === 'admin'  ){
            console.log('User is an admin');
            res.redirect('/admin/dashboard')
        } else {
            req.session.email=verifica.email
            req.session.nume=verifica.nume
            req.session.incercariNereusite=0
            console.log('Mai este sesiunea de incercare?', req.session.incercariNereusite   )
            console.log('User is not an admin');
            return res.redirect('/home/parfumuri');
        }

    } catch (error) {
        console.log(error)
}
}

const uitareParola=async(req,res)=>{
    const variante=await modelProduse.find().distinct('categorie').sort()
    return res.render('pagina-uitare',{variante})
}

const emailParola=async(req,res)=>{
    try {
        const{email}=req.body;
    

    const {error}= await schemaEmail.validate({email})
    const resetareParola=email
    
    const variante=await modelProduse.find().distinct('categorie').sort()
    console.log(email)
    const verificaEmail= await modelInregistrare.findOne({email});
    if(!req.session.resetareParola){
        req.session.resetareParola={}
    }
    const html=hbs.compile(fs.readFileSync('./views/resetareParola.hbs','utf-8'))
    console.log('Exista emailul?',verificaEmail);
    if(error){ 
        let mesajPersoana = error.details[0].message;
        return res.render('pagina-uitare',{error:mesajPersoana,variante})
    }
    if(verificaEmail){
        const token = jwt.sign(
            {userId:verificaEmail._id},
            secretKey='keyboard cat',
        {expiresIn:'1h'})
        const linkResetare=`http://localhost:3000/resetare-parola?token=${token}`
    const paginaHtml = html({verificaEmail,linkResetare},{ allowProtoPropertiesByDefault: true, allowProtoMethodsByDefault: true });
    const emailVerificat=verificaEmail.email

    const sesiuneEmail = req.session.resetareParola || {};
    if (!sesiuneEmail[emailVerificat]) {
        sesiuneEmail[emailVerificat] = [];
    }
    const oraAcum=Date.now()
    String(oraAcum)
    const treiEmail=sesiuneEmail[emailVerificat].filter((ora)=>oraAcum-ora<=60*60*1000)
    
    
    
    if(treiEmail.length===3){
        console.log('asta e sesiune email',sesiuneEmail)
        return res.send('Prea multe cereri au fost facute')
        
    }

else{
        sesiuneEmail[emailVerificat]=treiEmail
        treiEmail.push(oraAcum)
        console.log('asta e sesiune email',sesiuneEmail)
    
    const transportator=nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
      secure: false, // Set it to true if using SSL/TLS
    auth: {
        user: process.env.EMAIL_ADRESS,
        pass: process.env.EMAIL_PASS,
    },
    });
    const email={
    from:'scentsheaven9@gmail.com',
    to:req.body.email,
    subject:'Cerere pentru schimbarea parolei',
    html:paginaHtml,
    }
    transportator.sendMail(email,(error,info)=>{
        if(error){
        console.log(error)
        }else{;
        console.log('Emailul a fost trimis cu succes');
        }
    }
    );
    console.log(transportator,'Asta e transporterull')
    console.log(verificaEmail,'asta e verifica email')
    return res.render('email-uitare',{variante,resetareParola})
} 
    }   if(!verificaEmail){
        let mesajPersoana=`Emailul ${resetareParola} nu exista`;
        return res.render('pagina-uitare',{mesajPersoana,variante})
}

    } catch (error) {
        console.log(error)
    }
    
}



const resetareParola= async(req,res)=>{
    const token=req.query.token
    if(!token){
        return res.status(400).send('Token is required');
    }
        secretKey='keyboard cat';
        jwt.verify(token,secretKey, async(error,decoded)=>{
            if(error){
                const variante= await modelProduse.find().distinct('categorie').sort()
                return res.render('token-expirat',{variante})
            }
            else{
            const idClient=decoded.userId;
            const cautareClient=await modelLogare.findById(idClient)
            console.log('Cauaterea',cautareClient)
            return res.render('schimbareParola',{cautareClient})
            }
        })
    
    }


        
            
        





const paginaBranduri = async (req, res) => {
    try {
      const branduri = await modelProduse.find().distinct('brand').sort();
      const variante=await modelProduse.find().distinct('categorie').sort()
      console.log('Branduri',branduri)
      
      const brandLitera = {};
      console.log('brandLitera', brandLitera)
      branduri.forEach(brand => {
        const primaLitera = brand.charAt(0).toUpperCase();
  
        if (!brandLitera[primaLitera]) {
          brandLitera[primaLitera] = []; // Initialize as an empty array before pushing values
        }
        console.log('brandLitera', brandLitera)
        brandLitera[primaLitera].push(brand);
        console.log('brandLitera', brandLitera)
      });
  
      
      return res.render('branduri', {  brandLitera,variante });
    } catch (error) {
      console.error('Error:', error);
      // Handle the error and send an appropriate response
      return res.status(500).send('Internal Server Error');
    }
  };

const citesteBrand=async(req,res)=>{
    const {brand}=req.params
    try {
        const brandul= await modelProduse.find({brand})
        const variante=await modelProduse.find().distinct('categorie').sort()
        
        return res.render('brand',{brandul:brandul,variante})
    } catch (error) {
        console.log(error)
        res.send(`Brandul ${brand} nu a fost gasit`)
    }

}

const citesteCategoria= async (req,res)=>{
    const {categorie}=req.params
    try {
        const products= await modelProduse.find({categorie})
        const variante=await modelProduse.find().distinct('categorie').sort()
        console.log(products)
        return res.render('categorie',{products,variante})

    } catch (error) {
        console.log(error)
    }
}


module.exports={paginaExersare, citesteCategoria, paginaAcasa,paginaLogare,paginaInregistrare,logarePersoana,inregistrarePersoana,paginaBranduri,citesteBrand,uitareParola,emailParola,resetareParola}