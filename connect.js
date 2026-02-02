const mongoose=require('mongoose')
require("dotenv").config()

let instanta
class SingleDB{
    constructor(){
        if(instanta){
            return instanta
        }else{
            instanta=this
        }
    }

    connect=async()=>{
  await mongoose.connect(process.env.MONGO_URI)
                 console.log('Conectat la baza de date')
    }
}

const connectareBD= new SingleDB()

Object.freeze(connectareBD)

module.exports={
    
    connectareBD
};