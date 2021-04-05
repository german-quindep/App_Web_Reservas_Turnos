//PARA FACILITAR LA CREACION DE RUTAS
const express = require('express');
const router = express.Router();
const {
    renderIndex,
    renderAbout,
    renderServicio
} = require('../controllers/index.controller');
//RUTA INDEX
router.get('/', renderIndex);
//RUTA DEL ABOUT
router.get('/about', renderAbout);
//RUTA DEL SERVICIO
router.get('/servicios', renderServicio);
module.exports = router;