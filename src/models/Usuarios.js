//UTILIZAMOS MONGOOSE
const mongoose = require('mongoose');
const { Schema } = mongoose;
//MODULO PARA CIFRAR CONTRASEÑA
const bcrypt = require('bcryptjs');
//INSTANCIAMOS EL ESQUEMA DE LA BD
const UsuarioSchema = new Schema({
    Nombre: { type: String, required: true },
    Cedula: {type: String,required:true},
    Correo: { type: String, required: true },
    Contrasena: { type: String, required: true },
    Rol: {type: String, required:true},
    Fecha: { type: Date, default: Date.now }
});
//PARA ENCRIPTAR LA CONTRASENA
UsuarioSchema.methods.encryptPassword = async (password) => {
    //PARA APLICAR UN HASH
    const salt = await bcrypt.genSalt(10);
    const hash = bcrypt.hash(password, salt);//OBTENGO LA CONTRASENA CIFRADA
    //DEVUELVO EL HASH
    return hash;
};
//PARA DESENCRIPTAR  LA CONTRASENA
UsuarioSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.Contrasena);//CONTRASENA TOMADA, CONTRASENA DE LA BD
}
//PARA EXPORTAR EL MODELO Y USARLO EN OTRAS PARTES
//DE LA APP
module.exports = mongoose.model('Usuario', UsuarioSchema);