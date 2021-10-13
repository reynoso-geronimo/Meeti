const Meeti = require("../models/meeti");
const Grupos = require("../models/grupos");
const {body}= require('express-validator')

exports.formNuevoMeeti=async(req,res)=>{
    const grupos = await Grupos.findAll({where:{usuarioId:req.user.id}})
    res.render('nuevo-meeti',{
        nombrePagina:'Crear Nuevo Meeti',
        grupos
    })
}
exports.crearMeeti=async(req,res)=>{
    const meeti = req.body;

    //asignar el usuario

    meeti.usuarioId= req.user.id
    //almacena la ubicacion con un point

    const point = {type: 'Point', coordinates: [parseFloat(req.body.lat),parseFloat(req.body.lng)]}
    meeti.ubicacion= point
   

    //cupo opcional
    if(req.body.cupo ===''){
        meeti.cupo=0
    }
    //almacenar en la bd
    try {   
        await Meeti.create(meeti)
        req.flash('exito', 'Se  creo el Meeti correctamente')
        res.redirect('/administracion')
    } catch (error) {
        const erroresSequelize = Object.values(error.errors).map(
            (err) => err.message
          );
          req.flash("error", erroresSequelize);
        res.redirect('/nuevo-meeti')
    }
}
exports.santizarCampos=(req,res,next)=>{
    body("titulo").escape(); 
    body("invitado").escape();
    body("fecha").escape();
    body("hora").escape();
    body("direccion").escape();
    body("invitado").escape();
    body("ciudad").escape();
    body("estado").escape();
    body("pais").escape();
    body("lat").escape();
    body("lng").escape();
    body("grupoId").escape();

    next()
}