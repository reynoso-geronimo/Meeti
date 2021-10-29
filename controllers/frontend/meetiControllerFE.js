const Meeti = require("../../models/Meeti");
const Grupos = require("../../models/Grupos");
const Usuarios = require("../../models/Usuarios");
const moment= require('moment')

exports.mostrarMeeti = async (req, res) => {
    console.log(req.params.slug)
  const meeti = await Meeti.findOne({
    where: { slug: req.params.slug },
    include: [
      { model: Grupos },
      { model: Usuarios, attributes: ["nombre", "id", "imagen"] },
    ],
  });
  if(!meeti){
      res.redirect('/');
  }
  res.render('mostrar-meeti',{
    nombrePagina:meeti.titulo,
      meeti,
      moment
  })
};
