const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Usuario = require('../models/Usuarios');//TRAYENDO EL MODELO USUARIO
//PARA PODER DEFINIR UNA ESTRATEGIA LOCAL DE IDENTIFICACION
passport.use(new LocalStrategy({
    //RECIBIENDO EL CORREO DEL USUARIO
    usernameField: 'email',
    passwordField: 'password'
    //PARA RECIBIR LOS DATOS Y PODER VALIDARLO
}, async (email, password, done) => {
    //BUSCANDO EL CORREO DEL USUARIO EN LA BD Y LO GUARDO EN usuario
    const user = await Usuario.findOne({ Correo: email });
    //PREGUNTO SI NO EXISTE UN USUARIO
    if (!user) {
        //TERMINO EL PROCESO DE AUTENTICACION Y MUESTRO EL MENSAJE
        return done(null, false, { message: 'Usuario no Encontrado' });
    } else {
        //PARA PODER VER SI COINCIDE LA CONTRASENA CON matchPAssword;
        const match = await user.matchPassword(password);
        //PREGUNTO SI COINCIDE TRAE ALGO MATCH
        if (match) {
            //AQUI DEVOLVEREMOS VERDADERO YA QUE TODO ESTA VALIDO
            return done(null, user);
        } else {
            //CASO CONTRARIO LE DEVUELVO FALSO YA QUE NO TIENE NADA CORRECTO AL INGRESAR
            return done(null, false, { message: 'Contraseña Incorrecta' })
        }
    }
}));
/*-------------------------*/
//ALMACENAR EL USUARIO EN UNA SESION
passport.serializeUser((user, done) => {
    //SI EL USUARIO ES CORRECTO LO ALMACENO EN UN ID
    done(null, user.id);
});

//PARA TOMAR EL ID Y GENERAR UN USUARIO
passport.deserializeUser((id, done) => {
    Usuario.findById(id, (err, user) => {
        done(err, user);
    });
});