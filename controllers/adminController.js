const modelProduct=require('../modele/modelProdus')
const Joi = require('@hapi/joi')
const cheerio=require('cheerio')
const {readFileSync}=require('fs')
const cloudinary=require('../utils/cloudinary')
const path=require('path')
const multer = require('multer');
const diacritics = require('diacritics')
const modelComanda = require('../modele/modelComanda')
const modelInregistrare=require('../modele/modelLogare')
const modelPreferate=require('../modele/modelPreferate')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads'); // Set the destination folder for uploaded files
    },
    filename: function (req, file, cb) {
        cb(null,  file.originalname); // Set the file name for uploaded files
    }
});

const upload = multer({ storage: storage });

const schema=Joi.object({
  brand:Joi.string().required().messages({
    'string.base': `Campul 'Nume' trebuie să fie un șir de caractere`,
    'string.empty': `Completeaza campul 'Brand'`,
    'string.min': `Campul 'Nume' trebuie să aibă cel puțin {#limit} caractere`,
    'any.required': `Campul 'Nume' este obligatoriu`,
  }),
  title:Joi.string().required().messages({
    'string.empty':`Completeaza campul 'Titlu'`,
    'any.required': `Campul 'Titlu' este obligatoriu`
  }),
  categorie:Joi.string().required().messages({
    'string.empty':`Completeaza campul 'Categorie'`,
    'any.required': `Campul 'Categorie' este obligatoriu`
  }),
  type:Joi.string().required().messages({
    'string.empty': `Completeaza campul 'Tip'`,
    'any.required': `Campul 'Tip' este obligatoriu`
  }),
  description:Joi.string().required().messages({
    'string.empty':`Completeaza campul 'Descriere'`
  }),
  composition:Joi.string().required().messages({
    'string.empty':`Completeaza campul 'Descriere'`
  }),
  story:Joi.string().required().messages({
    'string.empty':`Completeaza campul 'Descriere'`
  }),
  price:Joi.string().required().messages({
    'string.empty': `Completeaza campul 'Pret'`,
    'any.required': `Campul 'Pret' este obligatoriu`
  }),
  quantity:Joi.string().required().messages({
    'string.empty': `Completeaza campul 'Cantitate'`,
    'any.required': `Campul 'Cantitate' este obligatoriu`
  }),
  price2: Joi.string().empty('').default(null),
  quantity2: Joi.when('price2', {
    is: Joi.string().empty('').default(null),
    then: Joi.string().required().messages({
      'string.empty': `Completeaza campul 'Cantitate2'`,
      'any.required': `Campul 'Cantitate2' este obligatoriu`
    })
  }),
  price3: Joi.string().empty('').default(null),
  quantity3: Joi.when('price3', {
    is: Joi.string().empty('').default(null),
    then: Joi.string().required().messages({
      'string.empty': `Completeaza campul 'Cantitate3'`,
      'any.required': `Campul 'Cantitate3' este obligatoriu`
    })
  }),
})




// Inregistrare Produs In Baza De Date
const adaugaprodus = async (req, res) => {
  const {error}= await schema.validate(req.body)
  if(error){ 
      const mesajPersoana=error.details[0].message
      const $=cheerio.load(readFileSync('./views/upload.hbs'))
      $('#mesaj-eroare').text(mesajPersoana)
      const trimiteMesaj=$.html()
      console.log(trimiteMesaj)
      return res.send(trimiteMesaj)
  }
    const picture = req.file; // get the uploaded file
    const pictureURL = picture.path;
  
    try {
      const pictureCloudinary = await cloudinary.uploader.upload(pictureURL, {
        folder: 'products',
        width: 300,
        crop: 'scale',
        transformation: [{ width: 300, crop: 'scale' }]
      });
  
      const productData = {
        brand: req.body.brand,
        picture: pictureCloudinary.secure_url, // salvare url in baza de date
        type: req.body.type,
        title: req.body.title,
        categorie: req.body.categorie,
        description: req.body.description,
        composition: req.body.composition,
        story: req.body.story,
        price: req.body.price,
        quantity:req.body.quantity,
        price2:req.body.price2,
        quantity2:req.body.quantity2,
        price3:req.body.price3,
        quantity3:req.body.quantity3,
      };
  
       await modelProduct.create(productData); // create a new product in the database
  
      return res.redirect('/admin/dashboard/produse');
    } catch (error) {
      return res.send(error);
    }
  };

  const afiseazaProduseAdmin= async (req,res)=>{
    try {
        const produse= await modelProduct.find({},{ picture: 1, title: 1, price: 1, _id: 1,brand:1 })
        return res.render('produse',{produse})
    } catch (error) {
        console.log(error)
        res.status(500).send("Produsele nu au fost gasite, avem o problema")
    }
}


const afiseazaActivitate = async (req, res) => {
  try {
    const preferate = await modelPreferate
      .find({}, { email: 1, produse: 1 }).populate('produse')
      .sort({ _id: -1 })
      .populate('produse');
      const cumparate=await modelComanda.find({},{email:1,produse:1})
      .sort({_id:-1})
      .populate('produse.produse')
    return res.render('dashboard', { preferate,cumparate });
  } catch (error) {
    console.log(error);
    res.send('Produsle preferate nu au putut fi afișate');
  }
};

const detaliiProdusAdmin= async(req,res)=>{
  const {_id}=req.params
  try {
    const detalii= await modelProduct.findById(_id)
    return res.render('update',{detalii})
  } catch (error) {
    console.log(error)
  }
}

const updateProdus = async (req, res) => {
  const { updateID } = req.body;


  
  const picture = req.file; // get the uploaded file

  try {
    let updateData = {
      brand: req.body.brand,
      type: req.body.type,
      title: req.body.title,
      categorie: req.body.categorie,
      description: req.body.description,
      composition: req.body.composition,
      story: req.body.story,
      price: req.body.price,
      quantity: req.body.quantity,
      price2: req.body.price2,
      quantity2: req.body.quantity2,
      price3: req.body.price3,
      quantity3: req.body.quantity3,
    };

    if (picture) {
      const pictureURL = picture.path;
      const pictureCloudinary = await cloudinary.uploader.upload(pictureURL, {
        folder: 'products',
        width: 300,
        crop: 'scale',
        transformation: [{ width: 300, crop: 'scale' }]
      });

      updateData.picture = pictureCloudinary.secure_url;
    }

    await modelProduct.findByIdAndUpdate(updateID, updateData, { new: true });
    return res.redirect('/admin/dashboard/produse');
  } catch (error) {
    console.log(error);
    res.send('Produsul nu s-a putut actualiza');
  }
};

const stergeProdus= async(req,res)=>{
   const {stergeID}=req.body
   try {
    await modelProduct.findByIdAndDelete(stergeID)
    return res.redirect('/admin/dashboard/produse')
   } catch (error) {
    console.log(error)
   }
}

const arataUtilizator= async(req,res)=>{
  const {cautaClient}=req.body
  try {
  const utilizator=  await modelComanda.findOne({email:cautaClient})
  const comenzi= await modelComanda.find({email:cautaClient}).populate('produse.produse').sort({ _id: -1 })
  for (const comanda of comenzi) {
    let totalPret = 0;

    
    for (const produs of comanda.produse) {
      
      totalPret += parseFloat(produs.price);
    }

    comanda.totalPret = totalPret;
  }
 
  return res.render('admin-client',{utilizator:utilizator,comenzi:comenzi})
  
  } catch (error) {
    console.log(error)
    res.send(`Utilizatorul ${cautaClient} nu poate fi afisat`)
  }
}

const arataContact= async(req,res)=>{
  const {cautaClient}=req.body
  try {
    const utilizator=  await modelComanda.findOne({email:cautaClient})
    return res.render('admin-contact',{utilizator:utilizator})
  } catch (error) {
    console.log(error)
    res.send('Contactele nu pot fi afisate')
  }
}


const updateContactAdmin= async(req,res)=>{
  const {updateContact}=req.body
  
  try {
      const updateDetalii={
      nume:req.body.nume,
      prenume:req.body.prenume,
      email:req.body.email,
      telefon:req.body.telefon,
      judete:req.body.judete,
      localitate:req.body.localitate,
      adresa:req.body.adresa,
      codPostal:req.body.codPostal,
      }
      console.log(updateContact)
      await modelComanda.findOneAndUpdate({email:updateContact},updateDetalii,{new:true})
      await modelInregistrare.findOneAndUpdate({email:updateContact},{nume:req.body.nume},{new:true})
      const utilizator = await modelComanda.findOne({email:updateContact})
      return res.render('admin-contact',{utilizator:utilizator})
  } catch (error) {
      console.log(error)
      res.send('Modificarile contului nu au putut fi salvate')
  }
}


const cautareProdus = async (req, res) => {
  try {
    const cautaProdus = req.query.cautaProdus;
    const cautaProdusNormalizat = diacritics.remove(cautaProdus).toLowerCase(); // Normalizare fără diacritice

    const produse = await modelProduct.find({
      $or: [
        { title: { $regex: cautaProdusNormalizat, $options: 'i' } },
        { type: { $regex: cautaProdusNormalizat, $options: 'i' } },
        { brand: { $regex: cautaProdusNormalizat, $options: 'i' } }
      ]
    });

    let message = `Rezultatele cautarii pentru "${cautaProdus}"`;
    const numarProduse = `Numar de produse: ${produse.length}`;

    if (!cautaProdus || produse.length === 0) {
      const message = `Nu exista rezultate pentru "${cautaProdus}"`;
      const mesajCautare = `Nu avem niciun produs care să corespundă căutării "${cautaProdus}". Vă rugăm să încercați din nou.`;
      return res.render('produse', { produse, message, mesajCautare });
    } else {
      return res.render('produse', { produse, message, numarProduse });
    }
  } catch (error) {
    console.log(error);
    res.send('Nu am gasit boss');
  }
};


const cautareComanda = async (req, res) => {
  try {
  const {cautaComanda}=req.query
  console.log(cautaComanda)
  const comenzi = await modelComanda.find({idComanda:cautaComanda}).populate('produse.produse')
  console.log(comenzi)
  const dataCurenta = Date.now();
  const comenziDepasite=[]
    const comenziInTermen = [];
    

    for (const comanda of comenzi) {
      const partiDataComanda = comanda.data.split('/');
      const ziuaComenzii = new Date(`${partiDataComanda[2]}-${partiDataComanda[1]}-${partiDataComanda[0]}`);
      const diferentaTimp =dataCurenta - ziuaComenzii.getTime();
      const zileTrecute = Math.floor(diferentaTimp / (24 * 60 * 60 * 1000));

      comanda.auTrecutDouaZile = zileTrecute >= 2;
      
      let totalPret = 0;
      for (const produs of comanda.produse) {
        totalPret += parseFloat(produs.price);
      }
      comanda.totalPret = totalPret;

      if (comanda.auTrecutDouaZile) {
        comenziDepasite.push(comanda);
        return res.render('comenzi-completate', { comenzi: comenziDepasite });
      }
      if( !comanda.auTrecutDouaZile){
        comenziInTermen.push(comanda);
        return res.render('comenzi', { comenzi: comenziInTermen });
      }
    }
  } catch (error) {
  console.log(error);
  res.send('Nu am gasit boss');
  }
};




module.exports={stergeProdus,afiseazaActivitate,adaugaprodus,upload,afiseazaProduseAdmin,detaliiProdusAdmin,updateProdus,arataUtilizator,arataContact,updateContactAdmin, cautareProdus,cautareComanda}

