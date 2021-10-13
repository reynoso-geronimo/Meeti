const Sequelize= require('sequelize');
const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const slug = require('slug');
const shortid= require ('shortid');
const Usuarios = require('./Usuarios')
const Grupos = require('./Grupos')

const Meeti=db.define(
    'meeti', {
        id:{
            type:Sequelize.UUID,
            primaryKey:true,
            allowNull:false,
            defaultValue: uuidv4
        },
        titulo:{
            type: Sequelize.STRING,
            allowNull:false,
            validate:{
                notEmpty:{
                    msg:"Agrega un titulo"
                }
            }
        },
        invitado:Sequelize.STRING,
        cupo:{
            type: Sequelize.INTEGER,
            defaultValue:0
        },
        descripcion:{
            type:Sequelize.TEXT,
            allowNull:false,
            validate:{
                notEmpty:{
                    msg:'Agrega una Descrcipcion'
                }
            }
        },
        fecha:{
            type:Sequelize.DATEONLY,
            allowNull:false,
            validate:{
                notEmpty:{
                    msg:'Agrega una Fecha'
                }
            }
        },
        hora:{
            type:Sequelize.TIME,
            allowNull:false,
            validate:{
                notEmpty:{
                    msg:'Agrega una Hora'
                }
            }
        },
        direccion:{
            type:Sequelize.STRING,
            allowNull:false,
            validate:{
                notEmpty:{
                    msg:'Agrega una direccion'
                }
            }
        },
        ciudad:{
            type:Sequelize.STRING,
            allowNull:false,
            validate:{
                notEmpty:{
                    msg:'Agrega una Ciudad'
                }
            }
        },
        estado:{
            type:Sequelize.STRING,
            allowNull:false,
            validate:{
                notEmpty:{
                    msg:'Agrega un Estado'
                }
            }
        },
        pais:{
            type:Sequelize.STRING,
            allowNull:false,
            validate:{
                notEmpty:{
                    msg:'Agrega un Pais'
                }
            }
        },
        ubicacion:{
            type:Sequelize.GEOMETRY('POINT'),
            
            
        },
        slug:{
            type:Sequelize.STRING
        },
        interesado:{
            type:Sequelize.ARRAY(Sequelize.INTEGER),
            defaultValue:[]
        }

    },
    {
        hooks:{
            async beforeCreate(meeti){
                const url = slug(meeti.titulo).toLocaleLowerCase();
                meeti.slug= `${url}-${shortid.generate()}`
            }
        }
    }
);
Meeti.belongsTo(Usuarios);
Meeti.belongsTo(Grupos)

module.exports = Meeti;