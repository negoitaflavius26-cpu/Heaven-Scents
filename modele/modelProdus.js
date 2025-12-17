const { string, number } = require('@hapi/joi')
const mongoose=require('mongoose')

const modelProduct = new mongoose.Schema({
    brand:{
    type:String
    },
    picture: {
    type: String,
    },
    type:{
    type:String
    },
    title: {
    type: String,
    required:true
    },
    categorie: {
    type: String,
    },
    description: {
    type: String,
    },
    composition: {
    type: String,
    },
    story: {
    type: String,
    },
    price: {
    type: Number,
    required:true
    },
    price2:{
        type:Number,
    },
    price3:{
        type:Number,
    },
    quantity:{
        type:Number,
    },
    quantity2:{
        type:Number
    },
    quantity3:{
        type:Number
    }
});

module.exports=mongoose.model("modelProduct", modelProduct)