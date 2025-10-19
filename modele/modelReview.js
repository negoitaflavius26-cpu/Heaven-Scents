const mongoose= require ('mongoose')


const dataActuala= new Date()
const dataFormatata=dataActuala.toLocaleDateString('en-GB', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

const schemaReview= new mongoose.Schema({
    nume:{
      type:String,
    },
    review:{
      type:String
    },
    produs:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:'modelProduct'
  }],
  data:{
    type:String,
    default:dataFormatata,
  },
  da:{
    type:Number,
    default:0
  },
  nu:{
    type:Number,
    default:0
  }
})

module.exports= mongoose.model('modelReview',schemaReview)