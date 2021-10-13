const Grupos = require('../models/Grupos')
const Meeti= require('../models/Meeti')
const moment= require('moment')

exports.panelAdministracion=async(req,res)=>{
 

    

 const consultas = [];
  consultas.push(Grupos.findAll({where: {usuarioId: req.user.id}}));
  consultas.push(Meeti.findAll({where: {usuarioId: req.user.id}}));

  //promise con await
  const [grupos, meeti] = await Promise.all(consultas);
    
    res.render('administracion',{
        nombrePagina:'Panel de administracion',
        grupos,
        meeti,
        moment 
    })
}