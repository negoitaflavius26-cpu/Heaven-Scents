const mongoose=require('mongoose')

const schemaModelReview= new mongoose.Schema({
    idReview:[{
        type:mongoose.Schema.Types.ObjectId,
            ref:'modelReview'

    }],
    da:{
        type:Number,
        default:0
    },
    nu:{
        type:Number,
        default:0
    }
})

module.exports=mongoose.model('modelReviewUtil',schemaModelReview)