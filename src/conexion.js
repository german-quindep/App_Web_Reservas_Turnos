const mongoose = require('mongoose');
//CREANDO LA CONEXION DE LA BASE DE DATOS
mongoose.connect('mongodb://localhost:27017/SystemLogin-BD', {
    //CONFIGURANDO  USUARIO Y CONTRASEÑA DE LA BASE DE DATOS MONGOSE
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
    //PARA VER LA PROMESA SI ES ERROS O ES CORRECTO LA CONEXION
    .then(db => console.log('Conectado'))
    .catch(err => console.log(err));