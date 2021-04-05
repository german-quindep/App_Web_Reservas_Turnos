const usuarioCtrl = {};
//INSTANCIANDO EL MONGO
const Usuario = require('../models/Usuarios');
//PASSPORT
const passport = require('passport');
//INSTANCIANDO JWT
//const jwt = require('jsonwebtoken');
//IMPORTANTDO CONFIGJWT
//const config = require('../config/confiJWT');
//RUTAS PARA INICIAR SESION
usuarioCtrl.iniciarSesionForm = (req, res) => {
    res.render('usuarios/iniciarSesion');
};
//AUTENTICAR EL USUARIO POR METODO POST
// Test to check for authentication

usuarioCtrl.iniciarSesion = passport.authenticate('local', {
    successRedirect: '/reservas/todas-reservas',//SI ES VERDADERO IRA A RESERVAR
    failureRedirect: '/usuarios/inciar-sesion', //SI ES FALSO RETORNO A INICIAR SESION
    failureFlash: true
});
//PARA CREAR OTRA RUTA DE REGISTRAR
usuarioCtrl.registroForm = (req, res) => {
    res.render('usuarios/registrarse');
};
//REGISTRAR EL USUARIO
usuarioCtrl.registro = async (req, res, next) => {
    //PARA TOMAR LOS DATOS POR SEPRADO
    const { Nombre,Cedula, Correo, Contrasena, Confi_Contrasena } = req.body;
    //EMPIEZO VALIDAR EL FORMULARIO
    const errors = [];
    if (Nombre.length <= 0) {
        errors.push({ text: 'Debe escribir el nombre' });
    }
    if(Cedula.length <= 9 ){
        errors.push({text: 'Debe tener al menos 10 digitos la cedula'});
    }
    if (Contrasena.length < 4) {
        errors.push({ text: 'La Contraseña Debe ser mayor a 4 digitos' })
    }
    if (Contrasena != Confi_Contrasena) {
        errors.push({ text: 'Contraseña no coinciden' });
    }
    if (errors.length > 0) {
        res.render('usuarios/registrarse', { errors, Nombre, Cedula, Correo, Contrasena, Confi_Contrasena });
    } else {
        //PARA VALIDAR UN EMAIL REPETIDO
        const correoValidar = await Usuario.findOne({ Correo: Correo });
        if (correoValidar) {
            req.flash('error_msj', 'Este correo ya existe');
            res.redirect('/usuarios/registrarse');
        } else {
            const nuevoUsuario = new Usuario({ Nombre,Cedula, Correo, Contrasena, Rol:'Cliente' });
            //PARA GUARDAR LA CONTRASEÑA CIFRADA
            //LO VULEVO A GUARDAR EN LA MISMA VARIABLE DE PASSWORD
            nuevoUsuario.Contrasena = await nuevoUsuario.encryptPassword(Contrasena);
            await nuevoUsuario.save();//GUARDO EL NUEVO USUARIO EN LA BD
            //JWT
            /*const token = jwt.sign({ id: nuevoUsuario._id }, config.secret, {
                expiresIn: 60 * 60 * 24 //PARA QUE SEA 1 DIA QUE EXPIRE
            });
            res.json({ auth: true, token })*/
            req.flash('correcto_msj', 'Registro con exito');
            res.redirect('/usuarios/inciar-sesion');
        }
    }
};
//AREA ADMIN
/*usuarioCtrl.admin = (req, res, next) => {
    res.json('admin');
};*/
//CERRAR SESSION
usuarioCtrl.cerrarSesion = (req, res) => {
    req.logout();
    res.redirect('/');
};

//EXPORTANDO
module.exports = usuarioCtrl;