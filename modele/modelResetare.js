const mongoose= require('mongoose')

const modelResetare=new mongoose.Schema({
    email:{
        type:String
    },
    ore:[{
        type:Date
    }]

})

module.exports=mongoose.model('modelResetare',modelResetare)