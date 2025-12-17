const { string } = require('@hapi/joi');
const mongoose=require('mongoose')

const dataActuala= new Date()
const dataFormatata=dataActuala.toLocaleDateString('en-GB', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});



const schemaComanda = new mongoose.Schema({
  idComanda:{
    type:Number,
  },
  transport: {
    type: String,
  },
  plata: {
    type: String,
  },
  nume: {
    type: String,
  },
  prenume: {
    type: String,
  },
  email: {
    type: String,
  },
  telefon: {
    type: Number,
  },
  judete: {
    type: String,
  },
  localitate: {
    type: String,
  },
  adresa: {
    type: String,
  },
  codPostal: {
    type: Number,
  },
  produse: [
    {
      produse: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'modelProduct',
      },
      quantity: {
        type: String,
      },
      price: {
        type: String,
      },
    },
  ],
  data:{
    type:String,
    default: dataFormatata
  },
  ora:{
    type:String
  },
  total:{
    type:Number
  }
});

module.exports= mongoose.model('modelComanda',schemaComanda)