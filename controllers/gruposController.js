const Categorias = require('../models/Categorias')
const Grupos = require('../models/grupos')
const { body } = require("express-validator");
const multer= require('multer')
const shortid= require('shortid')

const configuracionMulter= {
    limits:{ fileSize : 100000 },
    storage: fileStorage = multer.diskStorage({
        destination:(req,file,next)=>{
            next(null,__dirname+'/../public/uploads/grupos/');
        },
        filename:(req,file,next)=>{
            const extension = file.mimetype.split('/')[1];
            next(null, `${shortid.generate()}.${extension}`)
        }
    }),
    fileFilter(req, file , next){
        if(file.mimetype==='image/jpg' || file.mimetype==='image/png'){
            //el formato es valido
            next(null, true)
        }else{
            next(new Error('Formato de archivo no valido'), false)
        }
    }
}

const upload= multer(configuracionMulter).single('imagen')

exports.subirImagen=(req,res,next)=>{
    upload(req,res,function(error){
        if(error){
            if(error instanceof multer.MulterError){
                if(error.code==='LIMIT_FILE_SIZE'){
                    req.flash('error','El Archivo es muy grande limite 1 MB')
                }else{
                    req.flash('error', error.message)
                }
            }else if(error.hasOwnProperty('message')){
                req.flash('error', error.message)
            
            }
            res.redirect('back')
            return
            
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
      if(req.file){grupo.imagen= req.file.filename;}
      


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
exports.formEditarGrupo=async(req,res)=>{
    

    const consultas= [];
    consultas.push(Grupos.findByPk(req.params.grupoId));
    consultas.push(Categorias.findAll() )

    //promise con await
    const [grupo,categorias ] = await Promise.all(consultas)

    res.render('editar-grupo',{
        nombrePagina: `Editar Grupo : ${grupo.nombre}`,
        grupo,
        categorias
    })
}

exports.EditarGrupo=async(req,res)=>{
    const grupo = await Grupos.findOne({where:{id:req.params.grupoId, usuarioId: req.user.id}})

    if(!grupo){
        req.flash('error','operacion no valida');
        res.redirect('/administracion')
        return next()
    }
    const {nombre, descripcion, categoriaId , url} = req.body

    //asignar los valores
    grupo.nombre= nombre;
    grupo.descripcion=descripcion;
    grupo.categoriaId=categoriaId;
    grupo.url=url;

    //guardar en la base de datos
    await grupo.save();
    req.flash('exito', 'Cambios almacenados exitosamente');
    res.redirect('/administracion')
}