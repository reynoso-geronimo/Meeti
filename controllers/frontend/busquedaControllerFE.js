const Meeti = require('../../models/Meeti');
const Grupos = require('../../models/Grupos');
const Usuarios = require('../../models/Usuarios');

const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const moment = require('moment');

exports.resultadosBusqueda = async (req, res) => {
   
    // leer datos de la url 
    
    const { categoria, titulo, ciudad, pais } = req.query;

    // si la categoria esta vacia
    let meetis
    if(categoria === ''){
       
        meetis = await Meeti.findAll({ 
            where :  { 
                titulo : { [Op.iLike] :  '%' + titulo + '%' },
                ciudad : { [Op.iLike] :  '%' + ciudad + '%' },
                pais : { [Op.iLike] :  '%' + pais + '%' }
            },
            include: [
                {
                    model: Grupos
                },
                { 
                    model: Usuarios, 
                    attributes : ['id',  'nombre', 'imagen']
                }
            ]
        });


    } else {
      
        meetis = await Meeti.findAll({ 
            where :  { 
                titulo : { [Op.iLike] :  '%' + titulo + '%' },
                ciudad : { [Op.iLike] :  '%' + ciudad + '%' },
                pais : { [Op.iLike] :  '%' + pais + '%' }
            },
            include: [
                {
                    model: Grupos,
                    where:{categoriaId:{[Op.eq]:categoria}}
                    
                },
                { 
                    model: Usuarios, 
                    attributes : ['id',  'nombre', 'imagen']
                }
            ]
        });
    }
 
    // filtrar los meetis por los terminos de busqueda
    

    // pasar los resultados a la vista
    res.render('busqueda', {
        nombrePagina : 'Resultados Búsqueda',
        meetis, 
        moment
    })

}