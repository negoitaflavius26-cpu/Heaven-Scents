const modelComanda=require('../modele/modelComanda')
const modelProdus = require('../modele/modelProdus')
const nodemailer = require('nodemailer');
const hbs=require('handlebars')
const Joi = require('@hapi/joi')
const fs = require('fs')
const dataActuala= new Date()
const {paginaComanda}=require('../controllers/cosCumparaturi')
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const { default: Stripe } = require('stripe');
const session = require('express-session');
const { parse } = require('path');
const {readFileSync}=require('fs')
const cheerio=require('cheerio')
require("dotenv").config()
const dataFormatata=dataActuala.toLocaleDateString('en-GB', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});



const stripe = require('stripe')(process.env.STRIPE_KEY);


const schema= Joi.object({
  transport:Joi.string().valid('FAN Courier','Cargus','SameDay').required().messages({
    'any.required':'Alegeti firma de curierat'
  }),
  plata:Joi.string().valid('Card','Livrare').required().messages({
    'any.required':'Alegeti modalitatea de plata'
  }),
  nume:Joi.string().min(3).required().messages({
    'string.base': `Campul 'Nume' trebuie să fie un șir de caractere`,
    'string.empty': `Campul 'Nume' nu trebuie să fie gol`,
    'string.min': `Campul 'Nume' trebuie să aibă cel puțin {#limit} caractere`,
    'any.required': `Campul 'Nume' este obligatoriu`,
  }),
  prenume:Joi.string().required().messages({
    'string.base':`Campul 'Prenume' trebuie să fie un șir de caractere`,
    'string.empty': `Campul 'Prenume' nu trebuie sa fie gol`,
    'any.required': `Campul 'Prenume' este obligatoriu`
  }),

  email: Joi.string().min(6).required().email().messages({
    'string.base': `Adresa de email trebuie să fie un șir de caractere`,
    'string.empty': `Adresa de email nu trebuie să fie goală`,
    'string.email': `Trebuie să introduceți o adresă de email validă`,
    'string.min': `Adresa de email trebuie să aibă cel puțin {#limit} caractere`,
    'any.required': `Adresa de email este obligatorie`,
  }),
  telefon:Joi.string().required().length(9).pattern(/^[0-9]+$/).messages({
    'any.required': 'Numarul de telefon este obligatoriu.',
      'string.length': 'Numarul de telefon trebuie sa aiba exact {#limit} cifre.',
      'string.pattern.base': 'Numarul de telefon trebuie sa contina doar cifre.',
  }),
  judete:Joi.string().valid('Alba',
    'arad',
    'arges',
    'bacau',
    'bihor',
    'bistrita-Nasaud',
    'botosani',
    'brasov',
    'braila',
    'buzau',
    'caras-severin',
    'calarasi',
    'cluj',
    'constanta',
    'covasna',
    'dambovita',
    'dolj',
    'galati',
    'giurgiu',
    'gorj',
    'harghita',
    'hunedoara',
    'ialomita',
    'iasi',
    'ilfov',
    'maramures',
    'mehedinti',
    'mures',
    'neamt',).required().messages({
      'any.required': 'Alegeti judetul in care locuiti .',
      'string.empty': 'Alegeti judetul in care locuiti .',
      'any.only': 'Alegeti judetul in care locuiti .',
    }),
localitate:Joi.string().required().messages({
  'any.required':"Completati campul 'Localitate'"
}),
adresa:Joi.string().required().messages({
  'any.required':"Completati campul 'Adresa' ",
  'string.empty': "Completati campul 'Adresa' ",
}),
codPostal:Joi.string().length(6).required().pattern(/^[0-9]+$/).messages({
  'any.required': 'Codul Postal  este obligatoriu.',
  'string.length': 'Codul Postal trebuie sa aiba exact {#limit} cifre.',
  'string.pattern.base': 'Codul Postal  trebuie sa contina doar cifre.',
}),
})

function idComanda() {
  const specialID = Math.floor(100000 + Math.random() * 900000); 
  return specialID.toString(); 
}




const detaliiComanda = async (req, res,next) => {
  const produs = req.session.cos || [];
  console.log(`Sesiunea cos, are id-ul?:`,produs)

  
  const { error } = await schema.validate(req.body);
  const cos = req.session.cos || [];
  let totalPret = 0;
  // Calculate total price
  for (const total of cos) {
    totalPret += parseFloat(total.price);
  }
if (error) {
  const mesajPersoana = error.details[0].message;
  const cos = req.session.cos || [];
  const utilizator = req.session.email;
  try {
    const produsIds = cos.map(item => item.produs._id);
    const produss = await modelProdus.find({ _id: { $in: produsIds } });
    // Attach the variations to the corresponding produss
    for (const produs of produss) {
      const variatie = cos.find(v => v.produs._id.toString() === produs._id.toString());
      if (variatie) {
        produs.variation = variatie;
      }
    }

    const detalii = await modelComanda.findOne({ email: utilizator });
    return res.render('comanda', { cos: produss, detalii: detalii, totalPret: totalPret, error: mesajPersoana });
  } catch (error) {
    next(error)
  }

}
  const detalii = {
    idComanda:idComanda(),
    transport: req.body.transport,
    plata: req.body.plata,
    nume: req.body.nume,
    prenume: req.body.prenume,
    email: req.body.email,
    telefon: req.body.telefon,
    judete: req.body.judete,
    localitate: req.body.localitate,
    adresa: req.body.adresa,
    codPostal: req.body.codPostal,
    produse: produs.map(({ produs, quantity, price }) => ({
      produse: produs._id,
      quantity,
      price,
    })),
    data: dataFormatata,
    ora:dataActuala.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    total:totalPret
  };
  console.log(detalii)

  try {

    if (detalii.plata === 'Card') {

      
      ; // Calculate the total price
      let totalPrice = 0;

      produs.forEach(({ price }) => {
        totalPrice += price;
      });
      const session = await stripe.checkout.sessions.create({
        line_items: req.session.cos.map(({ produs, quantity, price }) => ({
          price_data: {
            currency: 'ron',
            product_data: {
              name: `${produs.title} - ${quantity}ml`,
              images : [produs.picture],
            },
            unit_amount:   price * 100 ,
          },
          quantity:1,
        })),
        mode: 'payment',
        success_url: `${process.env.URL}/cos/detalii/stripe-success?session_id={CHECKOUT_SESSION_ID}&detalii=${encodeURIComponent(JSON.stringify(detalii))}`,
        cancel_url: `${process.env.URL}/cos/detalii/problema`,
      });
      
      console.log(session);
      
      res.redirect(303, session.url);
    }else{
    await modelComanda.create(detalii);
    const produsIds = produs.map(item => item.produs._id); // Extract the _id values from the cos array
    console.log(`Aici trebuie sa fie id-ul produselor din cos`,produsIds)
    const produss = await modelProdus.find({ _id: { $in: produsIds } });
    for (const produsul of produss) {
      const variatie = produs.find(v => v.produs._id.toString() === produsul._id.toString());
      
      if (variatie) {
        console.log(`asta e produs.variation`,produs.variation)
        produsul.variation = variatie; // Attach the variation to the produs
        console.log(`asta e produs.variation`,produs.variation)
        console.log(`Asta este variatia`,variatie)
      }
    }
    console.log(produss)
    const html=hbs.compile(fs.readFileSync('./views/comanda-html.hbs','utf-8'))
    const estimareData = new Date(dataActuala);
estimareData.setDate(estimareData.getDate() + 2);

const day = String(estimareData.getDate()).padStart(2, '0');
const month = String(estimareData.getMonth() + 1).padStart(2, '0');
const year = estimareData.getFullYear();

const estimareLivrare = `${day}/${month}/${year}`;
console.log('Emailul a fost trimis cu succes');
console.log(estimareLivrare);
    const paginaHtml = html({ produs: produss,detalii,estimareLivrare }, { allowProtoPropertiesByDefault: true, allowProtoMethodsByDefault: true });
    const transportator=nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // Set it to true if using SSL/TLS
      auth: {
        user: process.env.EMAIL_ADRESS,
        pass: process.env.EMAIL_PASS,
      },
    });
    const email={
      from:process.env.EMAIL_ADRESS,
      to:req.body.email,
      subject:'Detaliile Comenzii Tale:',
      html:paginaHtml,
    }
    
    console.log('Emailul a fost trimis cu succes');
    console.log(estimareLivrare);
    transportator.sendMail(email,(error,info)=>{
      if(error){
        console.log(error)
      }else{;
        console.log('Emailul a fost trimis cu succes');

      }
    })
    const variante=await modelProdus.find().distinct('categorie').sort()
    req.session.produs = [];
    req.session.cos = [];

    res.render('success-page',{variante})
  }
  } catch (error) {
    next(error)
  }
};

module.exports={detaliiComanda}