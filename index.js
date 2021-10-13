const express = require("express");
const expressEjsLayouts = require("express-ejs-layouts");
const path = require('path')
const flash= require('connect-flash');
const router= require('./routes')
const session = require('express-session')
const cookieParser= require('cookie-parser')
const passport = require('./config/passport')
//variables de enetorno
require('dotenv').config({path: 'variables.env'})

//config y modelos de db
const db = require('./config/db');
    require('./models/Usuarios')
    require('./models/Categorias')
    require('./models/Grupos')
    require('./models/Meeti')
        db.sync().then(()=>{console.log('DB CONECTADA')}).catch((error)=>{console.log(error)})


const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
//habilitar ejs como template engine
app.use(expressEjsLayouts)
app.set('view engine' , 'ejs')

//archivos estaticos

app.use(express.static('public'));
//habilitar cookie parser
app.use(cookieParser());

//crear la sesion
app.use(session({
    secret:process.env.SECRETO,
    key:process.env.KEY,
    resave:false,
    saveUninitialized:false,
}))
//inicializar passport

app.use(passport.initialize())
app.use(passport.session())

//agrega flash messages
app.use(flash());

app.set('views',path.join(__dirname,'./views'));

//middleware propio (usuario logeado, flash messages, fecha actual)
app.use((req,res,next)=>{
    res.locals.mensajes= req.flash()
    const fecha = new Date();
    res.locals.year = fecha.getFullYear()
    next()
})

app.use('/', router())

app.listen(process.env.PORT,()=>{
    console.log(`funcionando en el puerto ${process.env.PORT}`)
})

