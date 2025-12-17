require("dotenv").config()

const stripe = require('stripe')(process.env.STRIPE_KEY);

const express = require('express');
const modelProduct = require('../modele/modelProdus')

const router = express.Router();
const dataActuala= new Date()
const nodemailer = require('nodemailer');
const hbs=require('handlebars')
const fs = require('fs')


const modelComanda=require('../modele/modelComanda')
const dataFormatata=dataActuala.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
});


router.get('/cos/detalii/stripe-success', express.raw({type: 'application/json'}), async (req, res) => {
    const session_id = req.query.session_id;
    const detalii = JSON.parse(req.query.detalii);    
    
    console.log(detalii);
  
    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);
  
    try {
      if (session.payment_status === 'paid') {
        await modelComanda.create(detalii);
        console.log(detalii.email);
        console.log(detalii.produse);
        const product = detalii.produse;
        const productIds = product.map(item => item.produse); 
        console.log(`Id-ul produsului`, productIds);
        
        // Retrieve the necessary product details from your database
        const products = await modelProduct.find({ _id: { $in: productIds } });
        console.log(`Produsele`, products);
  
        for (const produs of products) {
          const variatie = product.find(item => item.produse === produs._id.toString());
          console.log(`Variatia`, variatie);
          
          if (variatie) {
            produs.variation = variatie;
          }
        }
  
        console.log(products);
  
        const html = hbs.compile(fs.readFileSync('./views/comanda-html.hbs', 'utf-8'));
        const estimareData = new Date(dataActuala);
        estimareData.setDate(estimareData.getDate() + 2);
        
        const day = String(estimareData.getDate()).padStart(2, '0');
        const month = String(estimareData.getMonth() + 1).padStart(2, '0');
        const year = estimareData.getFullYear();
        
        const estimareLivrare = `${day}/${month}/${year}`;
        const paginaHtml = html({ product: products, detalii ,estimareLivrare}, { allowProtoPropertiesByDefault: true, allowProtoMethodsByDefault: true });
        
        const transportator = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 587,
          secure: false, // Set it to true if using SSL/TLS
          auth: {
            user: process.env.EMAIL_ADRESS,
            pass: process.env.EMAIL_PASS,
          },
        });
  
        const email = {
          from:  process.env.EMAIL_ADRESS,
          to: detalii.email,
          subject: 'Detaliile Comenzii Tale:',
          html: paginaHtml,
        };
  
        transportator.sendMail(email, (error, info) => {
          if (error) {
            console.log(error);
          } else {
            console.log('Emailul a fost trimis cu succes');
          }
        });
        const variante=await modelProduct.find().distinct('categorie').sort()
  
        req.session.produs = [];
        req.session.cos = [];
        req.session.email=detalii.email
        req.session.nume=detalii.nume
        return res.render('success-page', { email: detalii.email,nume:detalii.nume,variante }); // Pass the email to the success page
      }
    } catch (error) {
      console.log(error);
      res.send('Plata nu a mers');
    }
  });

module.exports=router