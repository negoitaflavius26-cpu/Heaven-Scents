const mongoose=require('mongoose')
require("dotenv").config()



const connectareBD=async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Conectat la baza de date')
    } catch (error) {
        console.log(error)
    }
}

module.exports={
    
    connectareBD
};