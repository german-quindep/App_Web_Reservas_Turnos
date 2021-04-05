//UTILIZAMOS MONGOOSE
const mongoose = require('mongoose');
const { Schema } = mongoose;
//INSTANCIAMOS EL ESQUEMA DE LA BD
const ReservaSchema = new Schema({
    Nombre_equipo: { type: String, required: true },
    Marca_equipo: { type: String, required: true },
    Descripcion_Problema: { type: String, required: true },
    Reserva_Dia: { type: String, required: true },
    Reserva_Fin: { type: String, required: true },
    Generado: {type: String},
    Usuario: { type: Schema.Types.ObjectId, ref: 'Usuario',autopopulate: true}
});
ReservaSchema.plugin(require('mongoose-autopopulate'));
//PARA EXPORTAR EL MODELO Y USARLO EN OTRAS PARTES
//DE LA APP

module.exports = mongoose.model('Reserva', ReservaSchema);