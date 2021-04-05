const empleadoCtrl= {};
const passport= require('passport');
const Factura = require('../models/Facturacion');
const Reserva = require('../models/Reservas');
//RUTAS PARA INICIAR SESION
empleadoCtrl.iniciarSesionForm = (req, res) => {
    res.render('empleados/sesionEmpleado');
};
empleadoCtrl.iniciarSesionEmploye= passport.authenticate('local',{
   successRedirect:'/empleados/welcome',
   failureRedirect:'/empleados/sesionEmpleado',
   failureFlash:true 
});
//RUTA PARA LA FACTURA
empleadoCtrl.facturaForm = async(req, res) => {
  await Reserva.find({_id:req.params.id})
  .then(documentos => {
    const contexto = {
      reservas: documentos.map(documentos => {
        return {
          _id: documentos._id,
        }
      })
    }
    res.render('facturacion/facturacion', { reservas: contexto.reservas }); //PRESENTO LAS RESERVAS
  })
  };

//PARA GENERAR NUEVA FACTURA
empleadoCtrl.NuevaFactura = async (req, res) => {
    const {Descripcion, Total_Pagar,id_Reserva } = req.body;
    const errors =[];
    const idReserva = await Factura.findOne({ id_Reserva: id_Reserva });
    if (idReserva) {
      errors.push({
        text: 'Ya se genero esta factura'
      });
    }
    if(!Descripcion){
      errors.push({
        text: 'Debe de describir la solucion del problema'
      });
    }
    if(!Total_Pagar || Total_Pagar<=0){
      errors.push({
        text: 'Debe de llenar el total a pagar'
      });
    }
    if (errors.length > 0) {
      //PARA MOSTRAR MENSAJE DE ALERTAS A LA MISMA VISTA
      res.render('facturacion/facturacion', {
        errors,
        id_Reserva,
        Descripcion,
        Total_Pagar
      });
    } else{
      await Reserva.findByIdAndUpdate(id_Reserva, {
        Generado:'Verdadero'
      });
    const nuevaFactura = new Factura({
      Descripcion, Total_Pagar,id_Reserva
    });
    //PARA GUARDAR EL ID DEL USUARIO 
    nuevaFactura.id_Empleado = req.user.id;
    //nuevaFactura.id_Reserva = req.params.id;
    await nuevaFactura.save();//PARA GUARDAR EN LA BD MONGO
    req.flash('correcto_msj', 'Se a guardado con exito');
    res.redirect('/facturacion/listar-reservas');//PARA ENVIARLO A ESTA LISTA
  }
  };

  empleadoCtrl.listarFactura = async (req, res) => {
   await Reserva.find().sort({ Reserva_Dia: 'desc' })
      .then(documentos => {
        const contexto = {
          reservas: documentos.map(documentos => {
            return {
              _id: documentos._id,
              Nombre: documentos.Usuario.Nombre,
              Cedula: documentos.Usuario.Cedula,
              Nombre_equipo: documentos.Nombre_equipo,
              Marca_equipo: documentos.Marca_equipo,          
              Descripcion_Problema: documentos.Descripcion_Problema,
              Reserva_Dia: documentos.Reserva_Dia,
              Generado: documentos.Generado
            }
          })
        }
        res.render('facturacion/listar-reservas', { reservas: contexto.reservas }); //PRESENTO LAS RESERVAS
      })
  };
  //BIENVENIDO EMPLEADO
  empleadoCtrl.bienvenido = (req, res) => {
    res.render('empleados/welcome');
};
  //ROLES
  empleadoCtrl.roles = function (Rol) {
    return (req, res, next) => {
        //var rol = req.user.Rol
        if (req.user.Rol !== Rol) {
            req.logout();
            return res.redirect('/admin/Denegado');
        }
        next();
    }
};
empleadoCtrl.cerrarSesion= (req,res)=>{
  req.logout();
  res.redirect('/');
};

//EXPORTANDO MODULO
module.exports= empleadoCtrl;