const mongoose=require('mongoose')

const signupSchema= new mongoose.Schema({
    nume:{
        type:String,
        unique:true
    },
    email:{
        type:String,
        unique:true
    },
    parola:{
        type:String
    },
    rol:{
        type:String,
        enum:['user','admin'],
        default:'user',
    }
})

module.exports=mongoose.model('modelInregistrare',signupSchema)