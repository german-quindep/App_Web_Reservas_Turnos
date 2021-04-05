//PARA FACILITAR LA CREACION DE RUTAS
const express = require('express');
const router = express.Router();
//INSTANCIO EL MODULO DATETIME PARA COMPARAR MAS RAPIDO LAS FECHAS
const { AgregarReservaForm,
   CrearReserva,
   editReservasForm,
   editReservas,
   deleteReservas,
   renderReservas,
   renderConsulta,
   verFactura,
   roles
} = require('../controllers/reservas.controller');
//TRAER EL AUTHENTICATED
const { isAuthenticated } = require('../helpers/autenticar');
const { authenticate } = require('passport');
//PARA CREAR RUTAS DESDE EL SERVIDOR
//PARA CREAR UNA RESERVA NUEVA
router.get('/reservas/agregar-reserva', isAuthenticated,roles('Cliente'), AgregarReservaForm);

//RECIBIR LA RUTA DE nueva-reserva.hbs
router.post('/reservas/nueva-reserva', isAuthenticated,roles('Cliente'), CrearReserva);

//ENVIAR AL FORMULARIO DE EDITAR RESERVAS LOS DATOS
router.get('/reservas/editar/:id', isAuthenticated,roles('Cliente'), editReservasForm);

//EDITAR EL FORMULARIO
router.put('/reservas/editar-reservas/:id', isAuthenticated,roles('Cliente'), editReservas);

/*--------------------------------------------*/
/*METODO ELIMINAR*/
router.delete('/reservas/eliminar-reservas/:id', isAuthenticated,roles('Cliente'),deleteReservas);
/*------------------------------------------ */
//VER LAS RESERVAS REGISTRADAS 
router.get('/reservas/todas-reservas', isAuthenticated,roles('Cliente'), renderReservas);
//PARA VER TODAS LAS RESERVAS 
router.get('/reservas/consultar-reservas', isAuthenticated,roles('Cliente'), renderConsulta);
//CONSULTAR FACTURA
//CONSULTAR FACTURA
router.get('/facturacion/ver-facturas/:id',isAuthenticated,roles('Cliente'),verFactura);
//EXPORTO EL MODULO ROUTER PARA QUE SEA UTILIZADO EN OTRO LADO
module.exports = router;