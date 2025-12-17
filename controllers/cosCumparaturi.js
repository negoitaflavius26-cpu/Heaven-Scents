const modelComanda = require('../modele/modelComanda');
const modelProdus=require('../modele/modelProdus')

const paginaCos = async (req, res) => {
  const cos = req.session.cos || [];
  const variante=await modelProdus.find().distinct('categorie').sort()
  console.log("Asta e cos",cos)
  return res.render("cos", { cos ,variante});
};

const adaugaInCos = async (req, res) => {
  req.session.produs = req.session.produs || [];
  req.session.cos = req.session.cos || [];
  const parfumId = req.body.parfum; // Get the value of the "parfum" field from the form submission
  
  console.log(parfumId)

  for (const item of req.session.produs) {
    const { _id, quantity, price } = item;
    if (_id === parfumId) {
      const produs = await modelProdus.findById( _id);
        req.session.cos.push({ quantity, price, _id, produs });
    }
  }
  if(!parfumId==req.session.produs){
    const mesaj=`Va rugam sa selectati cantitatea parfumului`
    const variante=await modelProdus.find().distinct('categorie').sort()
    const produs= await modelProdus.findById(parfumId)
    return res.render('produs',{produs,mesaj,variante})
  }
  req.session.produs=[]
  req.session.save();
  console.log('Asta e seiunea cos',req.session.cos);
  return res.redirect('/cos');
};
const variatieProdus = async (req, res) => {
  req.session.produs=[]
  const { quantity, price } = req.body;
  const { _id } = req.params;
  const variante=await modelProdus.find().distinct('categorie').sort()
  const ObjectId = require('mongoose').Types.ObjectId;

const produs =  await  modelProdus.findById(new ObjectId( _id));

  if (produs) {
    req.session.produs = req.session.produs || [];
    const pret=req.session.produs
    pret.push({ quantity, price, _id });
    console.log(pret);
    return res.render('produs', { produs,pret:pret,variante });
  } else {

    return res.status(404).send('produs not found');
  }
};
const stergeProdus=async (req,res)=>{
  const {produsStersButton}=req.body;

  req.session.cos=req.session.cos || []
  req.session.cos=req.session.cos.filter((parfum)=>parfum.produs._id!==produsStersButton)
  req.session.cos=req.session.cos || []
  req.session.save()
  return res.redirect('/cos')
  
}

const paginaComanda = async (req, res) => {
  const cos = req.session.cos || [];
  const utilizator = req.session.email;
  let totalPret = 0;
  for ( const total of cos){
    totalPret += parseFloat(total.price);
    console.log(totalPret)
  }
  try {
    const produsIds = cos.map(item => item.produs._id); // Extract the _id values from the cos array
    const produss = await modelProdus.find({ _id: { $in: produsIds } });
    // Attach the variations to the corresponding produss
    for (const produs of produss) {
      const variatie = cos.find(v => v.produs._id.toString() === produs._id.toString());
      if (variatie) {
        produs.variation = variatie; // Attach the variation to the produs
      }
    }

    const detalii = await modelComanda.findOne({ email: utilizator });
    if(cos.length===0){
      const variante=await modelProdus.find().distinct('categorie').sort()
      const mesajEroare='Cosul de cumparaturi este gol, va rugam sa selectati minim un produs'
      return res.render('cos',{mesajEroare,variante})
    }else{
    return res.render('comanda', { cos: produss, detalii: detalii,totalPret:totalPret });
    }
  } catch (error) {
next(error)
  }
};


module.exports={paginaCos,stergeProdus,paginaComanda,variatieProdus,adaugaInCos}


