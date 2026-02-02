const express=require('express')
const app=express()
const {connectareBD}=require('./connect')
const hbs=require('hbs')
const bodyParser=require('body-parser')
const path=require('path')
const preferateRoutes=require('./router/preferateRoutes')
const router=require('./router/router')
const adminRoutes=require('./router/adminRoutes')
const comenziRoutes=require('./router/comenziRoutes')
const cosRoute=require('./router/cosRoute')
const productRoutes=require('./router/productRoutes')
const utilizatorRute=require('./router/utilizatorRouter')
const stripeSucces= require('./router/stripeSucces')
require("dotenv").config()
const session = require('express-session');
const cors = require('cors');
const modelProdus = require('./modele/modelProdus')

hbs.registerHelper('eq', function (a, b, options) {
  if (a === b) {
    return options.fn(this);
  }
  return options.inverse(this);
});


app.use(cors({
  origin: 'https://stripe.com/cookie-settings/enforcement-mode'
}))

hbs.registerHelper('eq', function (a, b) {
  return a === b;
});

hbs.registerHelper('greaterThan',function(a,b,options){
  if (a > b) {
    return options.fn(this);
  }
})

app.use(session({
  secret: process.env.SESSION_SECRET,
  cookie:{
    sameSite:"strict"
  }
}))

app.use((req, res, next) => {
  res.locals.user=req.session.user
  res.locals.nume = req.session.nume;
  res.locals.email=req.session.email;
  res.locals.produse_vizionate=req.session.produse_vizionate;
  res.locals.incercariNereusite=req.session.incercariNereusite;
  res.locals.resetareParola=req.session.resetareParola
  next();
});


app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json())

app.use(express.json())
app.use(express.static(__dirname + '/public'));
app.use('/uploads', express.static('uploads'));

const pathView=path.join(__dirname,"./views")
app.use(express.urlencoded({extended:false}))
app.set('view engine','hbs')
app.set('views',pathView)

app.use('/',router)
app.use('/', adminRoutes)
app.use('/', productRoutes)
app.use('/',cosRoute)
app.use('/',utilizatorRute)
app.use('/',comenziRoutes)
app.use('/',stripeSucces)
app.use('/',preferateRoutes)

app.use((err, req, res, next) => {
    console.error(err.stack); 
    res.status(500).send("Internal Server Error"); 
});

const start=async()=>{
  try {
    await connectareBD.connect()
    app.listen(3000,console.log('Serverul asculta la portul 3000'))
  } catch (error) {
    console.log(error)
  }
}


start()
