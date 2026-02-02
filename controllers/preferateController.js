const modelPreferate=require('../modele/modelPreferate')
const modelProdus=require('../modele/modelProdus')



const adaugaProdus = async(req,res,next)=>{
    const {adaugaPreferat}=req.body

    const produse={
        email:req.session.email,
        produse:adaugaPreferat
    }
    const email=req.session.email
    if(email){
    await modelPreferate.create(produse)
    return res.redirect('/preferate')
    }
    if(!email){
        return res.redirect('/account/signup')
    }
}

const paginaPreferate= async(req,res,next)=>{
    const utilizator=req.session.email
    const variante=await modelProdus.find().distinct('categorie').sort()
    if(!utilizator){
        return res.render('signup' ,{variante})
    }else{
    try {
        const preferate= await modelPreferate.find( {email: utilizator}).populate('produse')
        const variante=await modelProdus.find().distinct('categorie').sort()
        console.log(preferate)
        return res.render('preferate',{preferate : preferate,variante})
        
    } catch (error) {
       next(error)
    }
}
}

const stergePreferat= async(req,res,next)=>{
    
    const {stergeProdus}=req.body
    console.log(stergeProdus)
    try {
        const ObjectId = require('mongoose').Types.ObjectId;
        await modelPreferate.findByIdAndDelete( new ObjectId(stergeProdus))
        
        return res.redirect('/preferate')
        
    } catch (error) {
        next(error)
    }
}

module.exports={adaugaProdus,paginaPreferate,stergePreferat}