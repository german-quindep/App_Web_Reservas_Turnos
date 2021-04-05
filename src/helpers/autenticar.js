const helpers = {};
//VALIDO LA SESION DEL USUARIO 
//ESTO ES UN MIDDLEWARES
helpers.isAuthenticated = (req,res,next)=>{
    if(req.isAuthenticated()){
        return next();
    }
req.flash('error_msj','No autorizado');
res.redirect('/usuarios/inciar-sesion');
};
module.exports = helpers;