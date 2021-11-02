const Comentarios = require('../../models/Comentarios')

exports.agregarComentario = async (req,res,next)=>{
    const {comentario} = req.body
   
    await Comentarios.create({
        mensaje:comentario,
        usuarioId:req.user.id,
        meetiId:req.params.id
    })
    res.redirect('back');
    next()
}