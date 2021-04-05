//CREO LA CONSTANTE PARA ALMACENARLA
const reservaCtrl = {};
//INSTANCIO EL SCHEMA RESERVA DEL MODELS
const Reserva = require('../models/Reservas');
//DANDOLE FORMATO A LA FECHA ACTUAL
const dateTime = require('node-datetime');
var dt = dateTime.create();
var formatted = dt.format('Y-m-dTH:M');
const moment = require('moment');
const Factura= require('../models/Facturacion');
//OBTENER EL INSTANTE DE HOY
//RUTA PARA IR NUEVA RESERVA
reservaCtrl.AgregarReservaForm = (req, res) => {
  res.render('reservas/nueva-reserva');
};

//CREAR NUEVA RESERVA
reservaCtrl.CrearReserva = async (req, res) => {
  const { Nombre_equipo, Marca_equipo, Descripcion_Problema, Reserva_Dia } = req.body;
  //CREO ARREGLO PARA GUARDAR LOS ERRORES
  const errors = [];
  //>= $gte || <= $lte || != $ne
  //PREGUNTO SI ES IGUAL A LA FECHAS YA REGISTRADAS
  const fechaValidar = await Reserva.findOne({ Reserva_Dia: moment(Reserva_Dia).format() });
  if (fechaValidar) {
    errors.push({
      text: 'Este horario ya esta en uso por favor elija uno de 30 minutos despues o vaya a Consultar Reservas'
    });
  }
  //VALIDO EL FORMULARIO
  //VALIDO MARCA DEL EQUIPO
  if (!Marca_equipo) {
    errors.push({
      text: 'Por Favor Ingrese La Marca Del Equipo'
    });
  }
  if (!Descripcion_Problema) {
    errors.push({
      text: 'Por favor Ingrese La Descripcion del Problema'
    });
  }
  if (!Reserva_Dia) {
    errors.push({
      text: 'Por Favor Ingresar Fecha y Hora'
    });
  }
  if (Reserva_Dia == formatted) {
    errors.push({
      text: 'Por Favor Ingresar Fecha Valida'
    });
  }
  if (Reserva_Dia <= formatted) {
    errors.push({
      text: 'Por Favor Ingresar Fecha Superior'
    });
  }
  //PREGUNTO SI TIENE ALGO EL ARREGLO ERRORES
  if (errors.length > 0) {
    //PARA MOSTRAR MENSAJE DE ALERTAS A LA MISMA VISTA
    res.render('reservas/nueva-reserva', {
      errors,
      Nombre_equipo,
      Marca_equipo,
      Descripcion_Problema,
      Reserva_Dia
    });
  } else {
    //INSTANCIANDO RESERVA
    //OBTENER EL INSTANTE DE HOY
    Reserva_Fin = Reserva_Dia;
    Reserva_Fin = moment(Reserva_Fin);
    //console.log(Reserva_Fin.format('hh:mm'));
    //AGREGAR UN STRING CON EL FORMATO DEL TIEMPO QUE QUEREMOS SUMAR
    mediahora = "00:30";
    //HACEMOS LA SUMA
    Reserva_Fin.add(moment.duration(mediahora));
    //CREO ARREGLO PARA GUARDAR LOS ERRORES
    //IMPRIMIRMOS EL RESULTADO
    const nuevaReserva = new Reserva({
      Nombre_equipo, Marca_equipo, Descripcion_Problema,
      Reserva_Dia: moment(Reserva_Dia).format(),
      Reserva_Fin: moment(Reserva_Fin).format()
    });
    //PARA GUARDAR EL ID DEL USUARIO 
    nuevaReserva.Usuario = req.user.id;
    await nuevaReserva.save();//PARA GUARDAR EN LA BD MONGO
    req.flash('correcto_msj', 'Se a guardado con exito');
    res.redirect('/reservas/todas-reservas');//PARA ENVIARLO A ESTA LISTA
  }
};

//RENDERIZAR RESERVAS
reservaCtrl.renderReservas = async (req, res) => {
  await Reserva.find({ Usuario: req.user.id }).sort({ Reserva_Dia: 'desc' })
    .then(documentos => {
      const contexto = {
        reservas: documentos.map(documentos => {
          return {
            _id: documentos._id,
            Nombre_equipo: documentos.Nombre_equipo,
            Marca_equipo: documentos.Marca_equipo,
            Descripcion_Problema: documentos.Descripcion_Problema,
            Reserva_Dia: documentos.Reserva_Dia,
            Generado: documentos.Generado
          }
        })
      }
      res.render('reservas/lista-reservas', { reservas: contexto.reservas }); //PRESENTO LAS RESERVAS
    })
};

//RUTA EDIT FORM
reservaCtrl.editReservasForm = async (req, res) => {
  //GUARDO EN UNA CONST TODO LO QUE VIENE DE LA CONSULTA SEGUN EL ID 
  const reserva = await Reserva.findById(req.params.id).lean();
  //LLEVO ESE DATO RESERVA PARA ASI PINTARLO EN EL FRONT END
  res.render('reservas/editar-reservas', { reserva });
};


//ACTUALIZAR LOS DATOS
reservaCtrl.editReservas = async (req, res) => {
  //TOMO LOS VALORES DEL FORMULARIO
  const { Nombre_equipo, Marca_equipo, Descripcion_Problema, Reserva_Dia } = req.body;
  //console.log(Reserva_Dia.format());
  //PARA EDITAR LA FECHA
  Reserva_Fin = Reserva_Dia;
  Reserva_Fin = moment(Reserva_Fin);
  //console.log(Reserva_Fin.format('hh:mm'));
  //AGREGAR UN STRING CON EL FORMATO DEL TIEMPO QUE QUEREMOS SUMAR
  mediahora = "00:30";
  //HACEMOS LA SUMA
  Reserva_Fin.add(moment.duration(mediahora));
  //IMPRIMIRMOS EL RESULTADO
  //console.log(Reserva_Fin.format());
  /*EMPIEZO HACER EL UPDATE A LOS SIGUIENTES CAMPOS SEGUN EL ID QUE 
  VIENE DEL FORMULARIO EDITAR RESERVAS*/
  await Reserva.findByIdAndUpdate(req.params.id, {
    Nombre_equipo, Marca_equipo,
    Descripcion_Problema,
    Reserva_Dia: moment(Reserva_Dia).format(),
    Reserva_Fin: moment(Reserva_Fin).format(),
    Usuario: req.user.id
  });
  //MENSAJE FLASH
  req.flash('correcto_msj', 'Se a editado con exito');
  //REDIRECCIONO A TODAS LAS RESERVAS
  res.redirect('/reservas/todas-reservas');
};

//ELIMINAR
reservaCtrl.deleteReservas = async (req, res) => {
  //console.log(req.params.id); COMPRUEBO SI ME LLEGA EL ID
  await Reserva.findByIdAndDelete(req.params.id); //ELIMINO por el ID
  //MENSAJE FLASH
  req.flash('correcto_msj', 'Se a borrado con exito');
  res.redirect('/reservas/todas-reservas'); //REDIRECCIONO NUEVAMENTE A TODAS LAS RESERVA
};

//PARA VER TODAS LAS RESERVAS
reservaCtrl.renderConsulta = async (req, res) => {
  await Reserva.find().sort({ Reserva_Dia: 'desc' })
    .then(documentos => {
      const contexto = {
        reservas: documentos.map(documentos => {
          return {
            Nombre_equipo: documentos.Nombre_equipo,
            Marca_equipo: documentos.Marca_equipo,
            Descripcion_Problema: documentos.Descripcion_Problema,
            Reserva_Dia: documentos.Reserva_Dia,
            Reserva_Fin: documentos.Reserva_Fin
          }
        })
      }
      res.render('reservas/consultar-reservas', { reservas: contexto.reservas }); //PRESENTO LAS RESERVAS
    })
};
//PARA VER LAS FACTURAS GENERADAS
reservaCtrl.verFactura = async (req,res)=>{
  await Factura.find({id_Reserva: req.params.id})
  .then(documentos => {
    const contexto = {
      facturas: documentos.map(documentos => {
        return {
          _id: documentos._id,
          Descripcion: documentos.Descripcion,
          Total_Pagar: documentos.Total_Pagar,
          Fecha: documentos.Fecha,
          id_Empleado: documentos.id_Empleado.Nombre,          
          id_Reserva: documentos.id_Reserva.Usuario.Nombre,
        }
      })
    }
    res.render('facturacion/ver-facturas', { facturas: contexto.facturas }); //PRESENTO LAS RESERVAS
  })
};


//PARA LOS ROLES
reservaCtrl.roles = function (Rol) {
  return (req, res, next) => {
      //var rol = req.user.Rol
      if (req.user.Rol !== Rol) {
          req.logout();
          return res.redirect('/admin/Denegado');
      }
      next();
  }
};

module.exports = reservaCtrl;