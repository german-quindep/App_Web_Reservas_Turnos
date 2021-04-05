const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../helpers/autenticarAdmin");
const { authenticate } = require("passport");
const {
  sesionForm,
  registroAdminForm,
  registroAdmin,
  iniciarSesionAdmin,
  roles,
  bienvenido,
  accesoDenegado,
  verFactura,
  generarInformeForm,
  generarInforme,
  cerrarSesion,
} = require("../controllers/admin.controller");

//PARA DAR EL FORMULARIO ADMIN
router.get("/admin/sesionAdmin", sesionForm);
//METODO POST
router.post("/admin/sesionAdmin", iniciarSesionAdmin);
//DANDOLE LA BIENVENIDA AL ADMINISTRADOR
router.get(
  "/admin/welcome",
  isAuthenticated,
  roles("Administrador"),
  bienvenido
);
//PARA MOSTRAR EL FORMULARIO DE REGISTRO
router.get(
  "/admin/registroAdmin",
  isAuthenticated,
  roles("Administrador"),
  registroAdminForm
);
//PARA REGISTRAR AL USUARIO
router.post(
  "/admin/registroAdmin",
  isAuthenticated,
  roles("Administrador"),
  registroAdmin
);
//PARA VER LAS FACTURAS
router.get(
  "/facturacion/lista-Facturas",
  isAuthenticated,
  roles("Administrador"),
  verFactura
);
//PARA GENERAR EL INFORME
router.get(
  "/admin/informe",
  isAuthenticated,
  roles("Administrador"),
  generarInformeForm
);
//PARA TRAER DATOS DEL INFORME
router.post(
  "/admin/informe",
  isAuthenticated,
  roles("Administrador"),
  generarInforme
);
//PARA ACCESO DENEGADO
router.get("/admin/Denegado", accesoDenegado);
//PARA CERRAR SESION
router.get("/admin/cerrar-sesion", cerrarSesion);
//EXPORTANDO FUNCION
module.exports = router;
