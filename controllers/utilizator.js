const modelInregistrare=require('../modele/modelLogare')
const modelComanda= require('../modele/modelComanda')
const modelProdus = require('../modele/modelProdus')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const modelLogare = require('../modele/modelLogare')

const paginaUtilizator= async (req,res)=>{

    const utilizator=req.session.email
    const variante=await modelProdus.find().distinct('categorie').sort()
    if(!utilizator){
        return res.render('signup',{variante})
    }else{
        try {
            const comenzi = await modelComanda.find({ email: utilizator }).populate('produse.produse').sort({ _id: -1 });
console.log(comenzi);
const variante=await modelProdus.find().distinct('categorie').sort()
            return res.render('utilizator',{comenzi:comenzi,variante})
        } catch (error) {
        next(error)
        }
}    
}

const cumparaDinNou= async(req,res)=>{
    req.session.cos=req.session.cos||[]
    const{quantity,price,parfum}=req.body
    const ObjectId = require('mongoose').Types.ObjectId;
    try {
        const  product= await modelProdus.findById( new ObjectId(parfum))
        console.log("de la cumpara din nou",product)
        req.session.cos.push({ quantity, price,  product })
        req.session.save();
        console.log(req.session.cos);
        return res.redirect('/cos');
    } catch (error) {
       next(error)
    }
}


const paginaContact= async(req,res)=>{
    const utilizator=req.session.email
    if(!utilizator){
        return res.render('signup')
    }else{
    try {
        const variante=await modelProdus.find().distinct('categorie').sort()
        const contact= await modelComanda.findOne({email:utilizator})
        const persoana= await modelInregistrare.findOne({email:utilizator})
        return res.render('contact',{contact:contact,persoana,variante})
    } catch (error) {
next(error)
    }
}
}



const deconectareUtilizator= async(req,res)=>{
    req.session.destroy((err)=>{
        if(err){
            res.send('Sesiunea nu a putut fi stearsa')
        }
    })
    res.redirect('/home')
}


const schimbaParola= async(req,res)=>{
    const clientId=req.body.clientId
    const salt = await bcrypt.genSalt(10); 
    const hashPassword = await bcrypt.hash(req.body.parola, salt);
    const checkPassword= await bcrypt.compare(req.body.verificaParola,hashPassword)
    const parolaNoua={
        parola:hashPassword,
        verificaParola:checkPassword
    }
    if(parolaNoua.verificaParola===true){
        await modelLogare.findByIdAndUpdate(clientId,parolaNoua,{new:true})
        console.log('s-a schimabt parola')
    }
}




const updateContact= async(req,res)=>{
    const {updateContact}=req.body
    try {
        const updateDetalii={
        nume:req.body.nume,
        prenume:req.body.prenume,
        email:req.body.email,
        telefon:req.body.telefon,
        judete:req.body.judete,
        localitate:req.body.localitate,
        adresa:req.body.adresa,
        codPostal:req.body.codPostal,
        }
        console.log(updateContact)
        await modelComanda.findOneAndUpdate({ email: updateContact },updateDetalii,{new:true})
        await modelInregistrare.findOneAndUpdate({email:req.session.email},{nume:req.body.nume},{new:true})
        req.session.nume=req.body.nume
        req.session.email=req.body.email
        req.session.save()
        return res.redirect('/utilizator/contact')
    } catch (error) {
       next(error)
    }
}

const stergeContact = async (req, res) => {
    const { stergeContact } = req.body;
    console.log('stergeContact:', stergeContact); 
    try {
        await modelInregistrare.findByIdAndDelete(stergeContact)
        console.log('Contact deleted:', stergeContact); 
        req.session.destroy()
        return res.redirect('/utilizator');
    } catch (error) {
next(error)
    }
};
module.exports={stergeContact,paginaUtilizator,deconectareUtilizator,paginaContact,updateContact,cumparaDinNou,schimbaParola}