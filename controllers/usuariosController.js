const Usuarios = require("../models/Usuarios");
const { body, validationResult } = require("express-validator");
const enviarEmail= require('../handlers/emails');



const multer = require("multer");
const shortid = require("shortid");
const fs= require('fs')

const configuracionMulter = {
  limits: { fileSize: 100000 },
  storage: (fileStorage = multer.diskStorage({
    destination: (req, file, next) => {
      next(null, __dirname + "/../public/uploads/perfiles/");
    },
    filename: (req, file, next) => {
      const extension = file.mimetype.split("/")[1];
      next(null, `${shortid.generate()}.${extension}`);
    },
  })),
  fileFilter(req, file, next) {
    if (
      file.mimetype === "image/jpg" ||
      "image/jpeg" ||
      file.mimetype === "image/png"
    ) {
      //el formato es valido
      next(null, true);
    } else {
      next(new Error("Formato de archivo no valido"), false);
    }
  },
};

const upload = multer(configuracionMulter).single("imagen");

exports.subirImagen = (req, res, next) => {
  upload(req, res, function (error) {
    if (error) {
      if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
          req.flash("error", "El Archivo es muy grande limite 1 MB");
        } else {
          req.flash("error", error.message);
        }
      } else if (error.hasOwnProperty("message")) {
        req.flash("error", error.message);
      }
      res.redirect("back");
      return;
    } else {
      next();
    }
  });
};


exports.formCrearCuenta = (req, res) => {
  res.render("crear-cuenta", {
    nombrePagina: "Crea tu Cuenta",
  });
};



exports.crearNuevoUsuario = async (req, res, next) => {
  const usuario = req.body;
  const rules = [
    body("confirmar").notEmpty().withMessage("Debes de confirmar tu password"),
    body("confirmar").equals(req.body.password).withMessage("Los passwords no coinciden"),
  ];

  await Promise.all(rules.map((validation) => validation.run(req)));
  const errores = validationResult(req);
    const erroresExpress = errores.errors.map((err)=>err.msg)

  try {
     nuevoUsuario = await Usuarios.create(usuario);
     //enviar email de confirmacion
    const url = `http://${req.headers.host}/confirmar-cuenta/${usuario.email}`

    await enviarEmail.enviarEmail({
       usuario,
       url,
       subject:'Confirma tu Cuenta de Meeti',
       archivo: 'confirmar-cuenta'
     })
     req.flash("exito", 'Hemos enviado un E-mail, confirma tu cuenta ');
    res.redirect("/iniciar-sesion");
  

  } catch (error) {
    console.log(error)
    const erroresSequelize = Object.values(error.errors).map(
      (err) => err.message
    );

    console.log(erroresSequelize);
    console.log(erroresExpress)
    
    const erroresGenerales =[...erroresExpress,...erroresSequelize]

    req.flash("error", erroresGenerales);
    res.redirect("/crear-cuenta");
  }
};

exports.formIniciarSesion = (req, res) => {
  res.render("iniciar-sesion", {
    nombrePagina: "Inicia Sesion",
  });
};
exports.confirmarCuenta=async(req,res,next)=>{
 
  const usuario =await  Usuarios.findOne({where:{email:req.params.correo}})
  if(!usuario){
   
    req.flash('error','Token de Activacion invalido')
    res.redirect('/crear-cuenta')
    return next()
  }
    else{
   usuario.activo= 1   
   await usuario.save()
   req.flash('exito','Cuenta Activada, inicia sesion')
   res.redirect('/iniciar-sesion')
    }
}


exports.formEditarPerfil=async(req,res)=>{
  const usuario = await Usuarios.findByPk(req.user.id)

  res.render('editar-perfil', {
    nombrePagina:'Editar Perfil',
    usuario
  })
}
exports.editarPerfil= async(req,res)=>{
  const usuario = await Usuarios.findByPk(req.user.id)
  body("nombre").escape(); 
  body("email").escape(); 
  const {nombre, descripcion, email}= req.body
  usuario.nombre=nombre;
  usuario.descripcion=descripcion;
  usuario.email=email
  await usuario.save()
  req.flash('exito', 'Cambios Guardados Correctamente');
  res.redirect('/administracion')
}
exports.formCambiarPassword=(req,res)=>{
  res.render('cambiar-password',{
    nombrePagina:'Cambiar Password'
  })
}

exports.cambiarPassword=async (req,res,next)=>{
  const usuario = await Usuarios.findByPk(req.user.id)
  //verificar el password sea correcto
  if(!usuario.validarPassword(req.body.anterior)){
    req.flash('error', 'El Password es Incorrecto');
    res.redirect('/administracion')
    return next()
  }
 
  //si el password es correcto hashear el nuevo
  const hash = usuario.hashPassword(req.body.nuevo);
  
  usuario.password=hash;

  await usuario.save();
  req.logout();
  req.flash('exito', 'password guardado exitosamente vuelve a iniciar sesion');
  res.redirect('/iniciar-sesion');
}

exports.formSubirImagePerfil=async(req,res)=>{
  const usuario = await Usuarios.findByPk(req.user.id)
  res.render('imagen-perfil',{
    nombrePagina:'Subir Imagen Perfil',
    usuario
  })
}
exports.guardarImagenPerfil= async(req,res)=>{
  const usuario = await Usuarios.findByPk(req.user.id)
  if(req.file && usuario.imagen){
    const imagenAnteriorPath= __dirname+`/../public/uploads/perfiles/${usuario.imagen}`
    
    //eliminar archivo con fs
    fs.unlink(imagenAnteriorPath,(error)=>{
        if(error){
            console.log(error)
        }
        return;
    })
}
//si hay imagen nueva almacenar
if(req.file){
    usuario.imagen = req.file.filename;
}
//guardar en la base de datos

await usuario.save()

req.flash('exito', 'Cambios Almacenados correctamente')
res.redirect('/administracion')
}