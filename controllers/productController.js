
const modelProdus=require('../modele/modelProdus');
const modelReview=require('../modele/modelReview');
const modelComanda=require('../modele/modelComanda')
const modelReviewUtil=require('../modele/modelReviewUtil')




const dataActuala= new Date()
const dataFormatata=dataActuala.toLocaleDateString('en-GB', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

const showprodus = async (req, res) => {
    try {
    const produs = await modelProdus.find({}, { picture: 1, title: 1, price: 1, _id: 1,brand:1 });
    const variante=await modelProdus.find().distinct('categorie').sort()
    return res.render("parfumuri", { produs,variante });
    } catch (error) {
next(error)
    }
};



const filtruProduseVandute=async(req,res)=>{
  try{
    const produs= await modelComanda.aggregate([
    {$lookup:{
        from:'modelproducts',
        localField:'produse.produse',
        foreignField:'_id',
        as:'produsComandat'
    }},
    {$unwind:'$produsComandat'},
    {$group:{
        _id:'$produsComandat._id', title:{$first:'$produsComandat.title'}, cumparat:{$sum:1},
        price:{$first:'$produsComandat.price'},brand:{$first:'$produsComandat.brand'},
        picture:{$first:'$produsComandat.picture'}
    }},
    {$sort:{
        cumparat:-1
    }}
])
console.log('astea sunt produsele',produs);
const variante=await modelProdus.find().distinct('categorie').sort()
return res.render("parfumuri", { produs,variante });
  }
  catch{
 next(error)
  }
}



const filtruproduseIeftine=async(req,res)=>{
  try{
    const produs= await modelProdus.aggregate([
    {$project:{
        _id:1,tile:1,price:1,picture:1,brand:1
    }},
    {$sort:{
        price:1
    }}
])
console.log('astea sunt produsele',produs);
const variante=await modelProdus.find().distinct('categorie').sort()
return res.render("parfumuri", { produs,variante });
  }
  catch{
 next(error)
  }
}

const filtruProduseScumpe= async(req,res)=>{
  try{
   const produs= await  modelProdus.aggregate([
    {$project:{
        _id:1,tile:1,price:1,picture:1,brand:1
    }},
    {$sort:{
        price:-1
    }}
])
console.log('astea sunt produsele',produs);
const variante=await modelProdus.find().distinct('categorie').sort()
return res.render("parfumuri", { produs,variante });
  }catch{
    next(error)
  }
}


const readprodus = async (req, res) => {
    const { _id } = req.params;
    const parere= await modelReview.find({produs:_id},{nume:1,review:1,produs:1,data:1,da:1,nu:1}).sort({ _id: -1 })
    req.session.produse_vizionate=req.session.produse_vizionate || [];
    console.log(parere)
    try {
      const produs = await modelProdus.findById(_id);
      const produseBrand = await modelProdus.find({ brand: produs.brand, _id: { $ne: produs._id } });
      const variante=await modelProdus.find().distinct('categorie').sort();
      const alreadyViewed = req.session.produse_vizionate.some(
        (item) => item.produs._id === _id
      );
      if (!alreadyViewed) {
        req.session.produse_vizionate.unshift({ produs});
        req.session.produse_vizionate=req.session.produse_vizionate.slice(0,6);
        await req.session.save(); 
      }
      console.log('Produsele vizionate', req.session.produse_vizionate);
      const produse_vizionate=req.session.produse_vizionate;
      return res.render('produs', { produs: produs, produseBrand: produseBrand,variante,parere, produse_vizionate: produse_vizionate });
    } catch (err) {
    next(error)
    }
  };

const cautareProdus = async (req, res) => {
    try {
    const cautaProdus = req.query.cautaProdus;
    const produs = await modelProdus.find({
        $or: [
        { title: { $regex: cautaProdus, $options: 'i' } },
        { type: { $regex: cautaProdus, $options: 'i' } },
        { brand: { $regex: cautaProdus, $options: 'i' } }
        ]
    });
    const variante=await modelProdus.find().distinct('categorie').sort()
    let message = `Rezultatele cautarii pentru  "${cautaProdus}"`;
    const numarProduse=`Numar de produse: ${produs.length}`
    if(!cautaProdus || produs.length===0){
        const  message= `Nu exista rezultate pentru  "${cautaProdus}"`;
        const mesajCautare= `Nu avem nici-un produs care sa corespunda cautarii"${cautaProdus}".Va rugam sa incercati din nou `
        return res.render('produse-cautate', { produs,  message, mesajCautare,variante });
    }else{
        return res.render('produse-cautate', { produs, message,numarProduse,variante });
    }
    } catch (error) {
  next(error)
    }
};

const reviewUtil = async (req, res, next) => { 
    let { da, nu } = req.body;
    const reviewId = da || nu;

    try {
       
        if (!req.session.voturiReview) {
            req.session.voturiReview = [];
        }

        
        if (req.session.voturiReview.includes(reviewId)) {
       
            return res.redirect(req.get('Referer') || '/');
        }

        
        if (da) {
            await modelReview.findByIdAndUpdate(da, { $inc: { da: 1 } });
        } else if (nu) {
            await modelReview.findByIdAndUpdate(nu, { $inc: { nu: 1 } });
        }

        
        req.session.voturiReview.push(reviewId);

       
        return res.redirect(req.get('Referer') || '/');

    } catch (error) {
        next(error); 
    }
}
const trimteReview= async(req,res)=>{
  const utilizator=req.session.nume
  const { _id } = req.params
  const review={
    nume:utilizator,
    review:req.body.review,
    produs:req.body.produs,
    data:dataFormatata,
  }
  const produs = await modelProdus.findById(review.produs);
  console.log('asta e produs',produs)
    const produseBrand = await modelProdus.find({ brand: produs.brand, _id: { $ne: produs._id } })
    const variante=await modelProdus.find().distinct('categorie').sort()
    const ObjectId = require('mongoose').Types.ObjectId;
    const verifica = await modelComanda.find({
      nume: utilizator,
      produse: {
        $elemMatch: {
          produse: new ObjectId(review.produs)
        }
      }
    }).populate('produse');
    console.log(review)
    await modelReview.create(review)
    console.log('User e conecat')
    return res.redirect(`/home/parfumuri/produs/${_id}`);
  }





module.exports = { showprodus, readprodus,cautareProdus,trimteReview,trimteReview,reviewUtil,filtruProduseScumpe,filtruproduseIeftine,filtruProduseVandute};
