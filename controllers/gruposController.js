const Categorias = require('../models/Categorias')
const Grupos = require('../models/grupos')
const { body } = require("express-validator");

exports.formNuevoGrupo=async(req,res)=>{
    const categorias = await Categorias.findAll();
    
    res.render('nuevo-grupo',{
        nombrePagina:'Crea un Nuevo grupo',
        categorias
    })

}
exports.crearGrupo= async(req,res,next)=>{
    
    const grupo = req.body
    
        body("nombre").escape(),
        body("url").escape(),
        body("descripcion").escape();
      
      grupo.usuarioId= req.user.id

   try {
    await Grupos.create(grupo)
    req.flash('exito', 'Grupo Creado Corretcamente')
    res.redirect('/administracion')
   } catch (error) {
    const erroresSequelize = Object.values(error.errors).map(
        (err) => err.message
      );
        req.flash('error', erroresSequelize)
       res.redirect('/nuevo-grupo')
   }
}