const mongoose=require('mongoose')

const modelPreferate= new mongoose.Schema({
    email:{
        type:String
    },
    produse:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'modelProduct'
    }]
})

module.exports=mongoose.model('modelPreferate',modelPreferate)