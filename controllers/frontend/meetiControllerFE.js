const Meeti = require("../../models/Meeti");
const Grupos = require("../../models/Grupos");
const Usuarios = require("../../models/Usuarios");
const moment= require('moment')
const Sequelize = require('sequelize');
const Categorias = require("../../models/Categorias");
const Comentarios = require('../../models/Comentarios');
const Op = Sequelize.Op

exports.mostrarMeeti = async (req, res) => {
  //  console.log(req.params.slug)
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
  //consultar por meetis cercanos 
  const ubicacion = Sequelize.literal(`ST_GeomFromText('POINT(${meeti.ubicacion.coordinates[0]} ${meeti.ubicacion.coordinates[1]})')`)

  // St_DISTANCE_Sphere = retorna una linea en metros

  const distancia = Sequelize.fn('ST_DistanceSphere', Sequelize.col('ubicacion'), ubicacion);

  //ecnontrar meetis cercanos
  const cercanos = await Meeti.findAll({
                                        order:distancia,
                                        where: Sequelize.where(distancia, { [Op.lte] : 2000}),
                                        limit:3,
                                        offset:1,
                                        include: [
                                          { model: Grupos },
                                          { model: Usuarios, attributes: ["nombre", "id", "imagen"] },
                                        ],

                                      })


  const comentarios = await Comentarios.findAll({where:{meetiId:meeti.id},
    include:[{
      model:Usuarios,
      attributes:['id','nombre','imagen']
    }]
})



  res.render('mostrar-meeti',{
    nombrePagina:meeti.titulo,
      meeti,
      comentarios,
      cercanos,
      moment

  })
};
exports.confirmarAsistencia=async(req,res)=>{
    
  const {accion } = req.body ;

  if(accion === 'confirmar'){
    //agregar usuario
    Meeti.update(
      {'interesado': Sequelize.fn('array_append', Sequelize.col('interesado'), req.user.id)},{'where':{'slug': req.params.slug}}
      )
      res.send('Has confirmado tu asistencia')
    

  }else{
    //cancelar la asistencia del usuario
    Meeti.update(
      {'interesado': Sequelize.fn('array_remove', Sequelize.col('interesado'), req.user.id)},{'where':{'slug': req.params.slug}}
      )
      res.send('Has cancelado tu asistencia')
    

  }

  
 
}
exports.mostrarAsistentes=async(req,res)=>{
  const meeti= await Meeti.findOne({where:{
    slug: req.params.slug},
  attributes:['interesado']
  })
  const {interesado}= meeti
 
  const asistentes = await Usuarios.findAll({
    attributes:['nombre','imagen'],
    where: {id :interesado}
  })
  res.render('asistentes-meeti',{
    nombrePagina: 'Listado Asistentes Meeti,',
    asistentes
  })

}
exports.mostrarCategoria= async(req,res,next)=>{
  const categoria = await Categorias.findOne({
    attributes:['id','nombre'],
    where:{slug:req.params.categoria}})
   
  const meetis = await Meeti.findAll({order:[['fecha','ASC']],
                                      include:[{
                                        model:Grupos,
                                        where:{categoriaId:categoria.id}
                                      },{
                                        model: Usuarios
                                      }]
  })
 res.render('categoria',{
   nombrePagina: `Categoria : ${categoria.nombre}`,
   meetis,
   moment
 })
}