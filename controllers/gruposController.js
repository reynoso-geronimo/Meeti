const Categorias = require('../models/Categorias')
const Grupos = require('../models/grupos')
const { body } = require("express-validator");
const multer= require('multer')
const shortid= require('shortid')

const configuracionMulter= {
    storage: fileStorage = multer.diskStorage({
        destination:(req,file,next)=>{
            next(null,__dirname+'/../public/uploads/grupos/');
        },
        filename:(req,file,next)=>{
            const extension = file.mimetype.split('/')[1];
            next(null, `${shortid.generate()}.${extension}`)
        }
    })
}

const upload= multer(configuracionMulter).single('imagen')

exports.subirImagen=(req,res,next)=>{
    upload(req,res,function(error){
        if(error){
            console.log(error)
            //todo manejar errores
        }else{
            next();
        }
    })
}

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

      //leer la imagen
      grupo.imagen= req.file.filename;

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