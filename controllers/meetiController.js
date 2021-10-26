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

exports.formEditarMeeti=async (req,res,next)=>{
    const consultas = []
    consultas.push(Grupos.findAll({where:{usuarioId:req.user.id}}))
    consultas.push(Meeti.findByPk(req.params.id));

    //retornar un promise
    const [grupos, meeti]= await Promise.all(consultas);
    if(!grupos || !meeti){
        req.flash("error", 'Operacion no valida');
        res.redirect('/administracion')
        return next()
    }
    res.render('editar-meeti',{
        nombrePagina:`Editar Meeti: ${meeti.titulo}`,
        grupos,
        meeti
    })
}
exports.editarMeeti=async(req,res,next)=>{
    const meeti= await Meeti.findOne({where:{id:req.params.id, usuarioId:req.user.id}})
    if(!meeti){
        req.flash("error", 'Operacion no valida');
        res.redirect('/administracion')
        return next()
    }
    const {grupoId, titulo, invitado,fecha,hora,cupo,descripcion,direccion,ciudad,estado,pais,lat,lng}= req.body
    meeti.grupoId=grupoId;
    meeti.titulo=titulo
    meeti.invitado=invitado
    meeti.fecha=fecha
    meeti.hora=hora
    meeti.cupo=cupo
    meeti.descripcion=descripcion
    meeti.direccion=direccion
    meeti.ciudad=ciudad
    meeti.estado=estado
    meeti.pais=pais
    //asignar el point
    const point = {type:'Point', coordinates:[parseFloat(lat),parseFloat(lng)]}
     meeti.ubicacion= point;

    await meeti.save()
    req.flash('exito', 'Cambios guardados correctamente');
    res.redirect('/administracion')
}
exports.formElminarMeeti=async(req,res,next)=>{
    const meeti= await Meeti.findOne({where:{id:req.params.id, usuarioId:req.user.id}})
    if(!meeti){
        req.flash("error", 'Operacion no valida');
        res.redirect('/administracion')
        return next()
    }
    //mostrar la vista
    res.render('eliminar-meeti',{
        nombrePagina:`Eliminar Meeti: ${meeti.titulo}`
    })
}

exports.elminarMeeti=async(req,res,next)=>{
    await Meeti.destroy({where:{id:req.params.id}})
    req.flash('exito','Meeti Eliminado');
    res.redirect('/administracion')
    
}