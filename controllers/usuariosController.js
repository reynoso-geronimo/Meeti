const Usuarios = require("../models/Usuarios");
const { body, validationResult } = require("express-validator");

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
     req.flash("exito", 'Hemos enviado un E-mail, confirma tu cuenta ');
    res.redirect("/iniciar-sesion");
  

  } catch (error) {
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
