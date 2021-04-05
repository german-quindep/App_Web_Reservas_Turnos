//PARA FACILITAR LA CREACION DE RUTAS
const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../helpers/autenticar');
const { authenticate } = require('passport');
const { iniciarSesionForm,
   iniciarSesion,
   registroForm,
   registro,
   cerrarSesion

} = require('../controllers/usuario.controller');
//PARA CREAR RUTAS DESDE EL SERVIDOR
router.get('/usuarios/inciar-sesion', iniciarSesionForm);
//PARA AUTENTICAR EL USUARIO POR EL FORMULARIO POST
router.post('/usuarios/inciar-sesion', iniciarSesion);
//PARA CREAR OTRA RUTA
router.get('/usuarios/registrarse', registroForm);
//PARA REGISTRAR AL USUARIO POR EL METODO POST
router.post('/usuarios/registrarse', registro);
//PARA CERRAR SESION
router.get('/usuario/cerrar-sesion', cerrarSesion);
//EXPORTAR
module.exports = router;