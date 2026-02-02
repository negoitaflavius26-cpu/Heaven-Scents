const modelComanda=require('../modele/modelComanda')

const afiseazaComenzi = async (req, res,next) => {
  try {
    const comenzi = await modelComanda
      .find({}, { idComanda:1, nume: 1, prenume: 1, email: 1, transport: 1, judete: 1, plata: 1, codPostal: 1, adresa: 1, produse: 1, data: 1, ora: 1,total:1 })
      .sort({ _id: -1 })
      .populate('produse.produse');

    const dataCurenta = Date.now();
    const comenziInTermen = [];
    

    for (const comanda of comenzi) {
      const partiDataComanda = comanda.data.split('/');
      const ziuaComenzii = new Date(`${partiDataComanda[2]}-${partiDataComanda[1]}-${partiDataComanda[0]}`);
      const diferentaTimp =dataCurenta - ziuaComenzii.getTime();
      const zileTrecute = Math.floor(diferentaTimp / (24 * 60 * 60 * 1000));

      comanda.auTrecutDouaZile =zileTrecute >= 2;
      
      let totalPret = 0;
      for (const produs of comanda.produse) {
        totalPret += parseFloat(produs.price);
      }
      comanda.totalPret = totalPret;

      if (!comanda.auTrecutDouaZile) {
        comenziInTermen.push(comanda);
      }
    }
    return res.render('comenzi', { comenzi: comenziInTermen });
  } catch (error) {
next(error)
  }
};

const afiseazaComenziCompletate = async (req, res,next) => {
  try {
    const comenzi = await modelComanda
      .find({}, { idComanda:1, nume: 1, prenume: 1, email: 1, transport: 1, localitate:1, judete: 1, plata: 1, codPostal: 1, adresa: 1, produse: 1, data: 1, ora: 1,total:1 })
      .sort({ _id: -1 })
      .populate('produse.produse');

    const dataCurenta = Date.now();
    
    const comenziDepasite = [];

    for (const comanda of comenzi) {
      const partiDataComanda = comanda.data.split('/');
      const ziuaComenzii = new Date(`${partiDataComanda[2]}-${partiDataComanda[1]}-${partiDataComanda[0]}`);
      const diferentaTimp =dataCurenta - ziuaComenzii.getTime();
      const zileTrecute = Math.floor(diferentaTimp / (24 * 60 * 60 * 1000));

      comanda.auTrecutDouaZile =zileTrecute >= 2;
      
      let totalPret = 0;
      for (const produs of comanda.produse) {
        totalPret += parseFloat(produs.price);
      }
      comanda.totalPret = totalPret;

      if (comanda.auTrecutDouaZile) {
        comenziDepasite.push(comanda);
      }
    }
    return res.render('comenzi-completate', { comenzi: comenziDepasite });
  } catch (error) {
  next(error)
  }
};


const stergeComanda= async(req,res,next)=>{
    const {butonStergere}=req.body
    try {
        await modelComanda.findByIdAndDelete(butonStergere)
        return res.redirect('/admin/dashboard/comenzi')
    } catch (error) {
  next(error)
    }
}

module.exports={afiseazaComenzi,stergeComanda,afiseazaComenziCompletate}