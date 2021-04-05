const mongoose = require('mongoose');
const { Schema } = mongoose;

//INSTANCIAMOS Y CREAMOS LA BD
const FacturaSchema = new Schema({
    Descripcion: { type: String, require: true },
    Total_Pagar: { type: Number, require: true },
    Fecha:       { type: Date, default: Date.now },
    id_Empleado: { type: Schema.Types.ObjectId, ref:'Usuario',autopopulate:true },
    id_Reserva:  { type: Schema.Types.ObjectId, ref:'Reserva',autopopulate: true}
});
//INSTANCIANDO EL PLUGIN POPULATE
FacturaSchema.plugin(require('mongoose-autopopulate'));
//EXPORTANDO EL MODULO
module.exports = mongoose.model('Factura', FacturaSchema);