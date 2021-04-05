const adminCtrl = {};
//REQUIREO EL MODELS ADMIN
const Admin = require('../models/Usuarios');
const Factura= require('../models/Facturacion');
//REQUIERO PASSPORT
const passport = require('passport');

//RUTA DEL FORMULARIO INICIAR SESION
adminCtrl.sesionForm = (req, res) => {
    res.render('admin/sesionAdmin');
};
//PARA AUTENTICAR AL USUARIO
adminCtrl.iniciarSesionAdmin = passport.authenticate('local', {
    successRedirect: '/admin/welcome',//SI ES VERDADERO IRA A RESERVAR
    failureRedirect: '/admin/sesionAdmin', //SI ES FALSO RETORNO A INICIAR SESION
    failureFlash: true
});
adminCtrl.registroAdminForm = (req, res) => {
    res.render('admin/registroAdmin');
};

//REGISTRAR EL USUARIO

adminCtrl.registroAdmin = async (req, res) => {
    //PARA TOMAR LOS DATOS POR SEPRADO
    const { Nombre, Cedula, Correo, Contrasena, Confi_Contrasena, Rol } = req.body;
    //EMPIEZO VALIDAR EL FORMULARIO
    const errors = [];
    if (Nombre.length <= 0) {
        errors.push({ text: 'Debe escribir el nombre' });
    }
    if (Cedula.length <= 9) {
        errors.push({ text: 'Debe tener al menos 10 digitos la cedula' });
    }
    if (Contrasena.length < 4) {
        errors.push({ text: 'La Contraseña Debe ser mayor a 4 digitos' })
    }
    if (Contrasena != Confi_Contrasena) {
        errors.push({ text: 'Contraseña no coinciden' });
    }
    if (errors.length > 0) {
        res.render('admin/registroAdmin', { errors, Nombre, Correo, Cedula, Contrasena, Confi_Contrasena });
    } else {
        //PARA VALIDAR UN EMAIL REPETIDO
        const correoValidar = await Admin.findOne({ Correo: Correo });
        if (correoValidar) {
            req.flash('error_msj', 'Este correo ya existe');
            res.redirect('/admin/sesionAdmin');
        } else {
            const nuevoAdmin = new Admin({ Nombre, Cedula, Correo, Contrasena, Rol });
            //PARA GUARDAR LA CONTRASEÑA CIFRADA
            //LO VULEVO A GUARDAR EN LA MISMA VARIABLE DE PASSWORD
            nuevoAdmin.Contrasena = await nuevoAdmin.encryptPassword(Contrasena);
            await nuevoAdmin.save();//GUARDO EL NUEVO USUARIO EN LA BD
            req.flash('correcto_msj', 'Registro con exito');
            res.redirect('/admin/sesionAdmin');
        }
    }
};

adminCtrl.bienvenido = (req, res) => {
    res.render('admin/welcome');
};
adminCtrl.roles = function (Rol) {
    return (req, res, next) => {
        //var rol = req.user.Rol
        if (req.user.Rol !== Rol) {
            req.logout();
            return res.redirect('/admin/Denegado');
        }
        next();
    }
};
//PARA VER LA FACTURA
adminCtrl.verFactura = async (req,res)=>{
    await Factura.find().sort({ Fecha: 'desc' })
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
      res.render('facturacion/lista-facturas', { facturas: contexto.facturas }); //PRESENTO LAS RESERVAS
    })
};
//PARA GENERAR EL INFORME
adminCtrl.generarInformeForm= async(req,res)=>{
    res.render('admin/informe');
}
//METODO POST PARA GENERAR EL INFORMW
adminCtrl.generarInforme= async(req,res)=>{
        //$gte -> MAYOR QUE IGUAL
    //$lte -> MENOR QUE IGUAL
    const {Fecha_Inicio,Fecha_Fin}=req.body;
    //{Fecha:{"$gte":new Date("2020-08-12"),"$lte":new Date("2020-08-18")}}
  await Factura.find({Fecha:{$gte: new Date(Fecha_Inicio), $lte:new Date(Fecha_Fin)}})
    .then(documentos => {
        const contexto = {
          facturas: documentos.map(documentos => {
            return {
              _id: documentos._id,
              Descripcion: documentos.Descripcion,
              Total_Pagar: documentos.Total_Pagar,
              Fecha: documentos.Fecha,
              Fecha_Inicio:req.body.Fecha_Inicio,
              Fecha_Fin:req.body.Fecha_Fin,
              id_Empleado: documentos.id_Empleado.Nombre,          
              id_Reserva: documentos.id_Reserva.Usuario.Nombre,
            }
          })
        }
        res.render('admin/informe', { facturas: contexto.facturas }); //PRESENTO LAS RESERVAS
      })
}
//ACCESO DENEGADO
adminCtrl.accesoDenegado = (req, res) => {
    res.render('admin/Denegado');
};
//CERAR SESION
adminCtrl.cerrarSesion = (req, res) => {
    req.logout();
    res.redirect('/');
};
//EXPORTANDO EL MODULO
module.exports = adminCtrl;