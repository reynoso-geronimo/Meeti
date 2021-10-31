const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController");
const usuariosController = require("../controllers/usuariosController");
const usuariosControllerFE = require("../controllers/frontend/usuariosControllerFE");
const authController = require("../controllers/authController");
const adminController = require("../controllers/adminController");
const gruposController = require("../controllers/gruposController");
const gruposControllerFE = require("../controllers/frontend/gruposControllerFE");
const meetiController = require("../controllers/meetiController");
const meetiControllerFE= require('../controllers/frontend/meetiControllerFE')

module.exports = function () {
  router.get("/", homeController.home);

  router.get("/meeti/:slug",
    meetiControllerFE.mostrarMeeti
  );
  //confirma asistencia a meeti
  router.post("/confirmar-asistencia/:slug",
    meetiControllerFE.confirmarAsistencia
  )
  router.get("/asistentes/:slug",
    meetiControllerFE.mostrarAsistentes
  )

  router.get("/usuarios/:id",
    usuariosControllerFE.mostrarUsuario
  )

  router.get('/grupos/:id',
    gruposControllerFE.mostrarGrupo
  )


  router.get("/crear-cuenta", usuariosController.formCrearCuenta);
  router.post("/crear-cuenta", usuariosController.crearNuevoUsuario);
  router.get("/confirmar-cuenta/:correo", usuariosController.confirmarCuenta);

  router.get("/iniciar-sesion", usuariosController.formIniciarSesion);
  router.post("/iniciar-sesion", authController.autenticarUsuario);

  router.get('/cerrar-sesion',
    authController.usuarioAutenticado,
    authController.cerrarSesion
  )

  //panel de admin
  router.get(
    "/administracion",
    authController.usuarioAutenticado,
    adminController.panelAdministracion
  );
  router.get(
    "/nuevo-grupo",
    authController.usuarioAutenticado,
    gruposController.formNuevoGrupo
  );
  router.post(
    "/nuevo-grupo",
    authController.usuarioAutenticado,
    gruposController.subirImagen,
    gruposController.crearGrupo
  );
  router.get(
    "/editar-grupo/:grupoId",
    authController.usuarioAutenticado,
    gruposController.formEditarGrupo
  );
  router.post(
    "/editar-grupo/:grupoId",
    authController.usuarioAutenticado,
    gruposController.EditarGrupo
  );
  //editar la imagen del grupo
  router.get(
    "/imagen-grupo/:grupoId",
    authController.usuarioAutenticado,
    gruposController.formEditarImagen
  );
  router.post(
    "/imagen-grupo/:grupoId",
    authController.usuarioAutenticado,
    gruposController.subirImagen,
    gruposController.editarImagen
  );
  //elimar grupos
  router.get(
    "/eliminar-grupo/:grupoId",
    authController.usuarioAutenticado,
    gruposController.formEliminarGrupo
  );
  router.post(
    "/eliminar-grupo/:grupoId",
    authController.usuarioAutenticado,
    gruposController.eliminarGrupo
  );
  router.get(
    "/nuevo-meeti",
    authController.usuarioAutenticado,
    meetiController.formNuevoMeeti
  );

  router.post(
    "/nuevo-meeti",
    authController.usuarioAutenticado,
    meetiController.santizarCampos,
    meetiController.crearMeeti
  );

  router.get(
    "/editar-meeti/:id",
    authController.usuarioAutenticado,
    meetiController.formEditarMeeti

  )
  router.post(
    "/editar-meeti/:id",
    authController.usuarioAutenticado,
    meetiController.editarMeeti

  )
  router.get('/eliminar-meeti/:id',
  authController.usuarioAutenticado,
  meetiController.formElminarMeeti
  )
  router.post('/eliminar-meeti/:id',
  authController.usuarioAutenticado,
  meetiController.elminarMeeti
  )

  //editar informacion perfil
  router.get(
    "/editar-perfil",
    authController.usuarioAutenticado,
    usuariosController.formEditarPerfil

  )
  router.post(
    "/editar-perfil",
    authController.usuarioAutenticado,
    usuariosController.editarPerfil

  )
  router.get(
    "/cambiar-password",
    authController.usuarioAutenticado,
    usuariosController.formCambiarPassword

  )
  router.post(
    "/cambiar-password",
    authController.usuarioAutenticado,
    usuariosController.cambiarPassword

  )
  router.get(
    "/imagen-perfil",
    authController.usuarioAutenticado,
    usuariosController.formSubirImagePerfil
  )
  router.post(
    "/imagen-perfil",
    authController.usuarioAutenticado,
    usuariosController.subirImagen,
    usuariosController.guardarImagenPerfil,
  )
  return router;
};
