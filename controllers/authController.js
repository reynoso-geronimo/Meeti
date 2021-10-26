const passport=require('passport')

exports.autenticarUsuario=passport.authenticate('local',{
    successRedirect: '/administracion',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage : ' Ambos campos son obligatorios'
})
//revisar si el usuario esa autenticado o no
exports.usuarioAutenticado = (req,res,next)=>{
    //usuario autenticado
    if(req.isAuthenticated()){
        return next();
    }

    //si no esta autenticado
    return res.redirect('/iniciar-sesion')
}

exports.cerrarSesion=(req,res,next)=>{
    req.logout();
    req.flash('correcto','Cerraste Sesion')
    res.redirect('/iniciar-sesion')
    next();
}