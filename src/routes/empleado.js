const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../helpers/autenticarEmploye');
const { authenticate } = require('passport');
const {
    iniciarSesionForm,
    iniciarSesionEmploye,
    facturaForm,
    NuevaFactura,
    listarFactura,
    roles,
    bienvenido,
    cerrarSesion
} = require('../controllers/empleado.controller');

router.get('/empleados/sesionEmpleado', iniciarSesionForm);
//PARA VER SI ESTA REGISTRADO O NO EL USUARIO EMPLEADO
router.post('/empleados/sesionEmpleado', iniciarSesionEmploye);
//RUTA PARA ABRIR EL FORMULARIO
router.get('/facturacion/nueva-facturacion/:id', isAuthenticated, roles('Empleado'), facturaForm);
//RUTA PARA GENERAR LA FACTURA
router.post('/facturacion/nueva-factura', isAuthenticated, roles('Empleado'), NuevaFactura);
//RUTA PARA MOSTRAR LAS FACTURAS A GENERAR
router.get('/facturacion/listar-reservas', isAuthenticated, roles('Empleado'), listarFactura);
//CERRAR SESION
router.get('/empleados/cerrar-sesion', cerrarSesion);
//BIENVENIDO EMPLEADO
router.get('/empleados/welcome', isAuthenticated,roles('Empleado'),bienvenido);

//EXPORTANDO FUNCION
module.exports = router;