//IMPORTANDO EL MODULO EXPRESS
const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const moment= require('moment');
//INICIALIZACIONES
const app = express();
require('./conexion');
require('./config/passport');

/*-----------------------------------*/
//CONFIGURACIONES
app.set('port', 3000);
//PARA QUE NODEJS SEPA DONDE SE ENCUENTRA MI CARPETA VISTAS
app.set('views', path.join(__dirname, 'views'));
//PARA TENER LA VISTA DE HANDLERBAS
//QUE BUSQUE EN TODO LO RELACIONADO A EXTENSION .hbs
app.engine('.hbs', exphbs({
   //PARA QUE TOME TODO LO QUE SEA DE RUTA HBS
   //CONFIGURANDO LA PLANTILLA
   defaultLayout: 'main',
   //PARA QUE OBTENGA LA DIRECCION DE LA CARPETA LAYOUTS
   layoutsDir: path.join(app.get('views'), 'layouts'),
   //PARA QUE TENGA LA DIRECCION DE LA CARPETA PARTIALS
   partialsDir: path.join(app.get('views'), 'partials'),
   extname: '.hbs',
   helpers:{
      ifEquals: function(arg1, arg2, options) {
         return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
     },
     ifCond: function(v1,v2,options){
      if(v1 === v2) {
         return options.fn(this);
       }
       return options.inverse(this);
     },
     niceDate:  function (dateTime) {
      return moment (dateTime).format('D/MM/YYYY H:mm');
     }
   }
}));
//PARA CONFIGURAR EL MOTOR DE LA VISTA DE HBS
app.set('view engine', '.hbs');


/*----------------------------------------------*/
//MIDLEWARES
//Para recibir los datos del usuario cuando ingrese algo
app.use(express.urlencoded({ extended: false }));
/*SIRVE PARA QUE PUEDAN ENVIAR OTRO TIPO DE METODOS LOS FORMULARIOS
EJEMPLO PUT DELETE POST*/
app.use(methodOverride('_method'));
//PARA CONFIGURAR LA SESION
app.use(session({
   secret: 'mysecretapp',
   resave: true,
   saveUninitialized: true
}));
//PARA PODER USAR PASSPORT Y LAS SESIONES
app.use(passport.initialize());
app.use(passport.session());
//INVOCANDO FLASH
app.use(flash());

/*--------------------------------------------*/
//VARIABLES GLOBALES
app.use((req, res, next) => {
   res.locals.correcto_msj = req.flash('correcto_msj');
   res.locals.error_msj = req.flash('error_msj');
   //PARA EL PASSPORT
   res.locals.error = req.flash('error');
   //PARA QUE SALGA EL NOMBRE DEL USUARIO CUANDO SE LOGUEE
   res.locals.user = req.user || null;
   //PARA QUE NO SE QUEDE EL NAVEGADOR
   next();
});


/*-------------------------------------------*/
//RUTAS
app.use(require('./routes/index'));
app.use(require('./routes/reservas'));
app.use(require('./routes/usuario'));
//app.use(require('./routes/facturacion'));
app.use(require('./routes/admin'));
app.use(require('./routes/empleado'));
/*-------------------------------------------*/
//ARCHIVOS STATICOS
//
app.use(express.static(path.join(__dirname, 'public')));



/*-------------------------------------------*/
//INICIAR SERVIDOR
app.listen(app.get('port'), () => {
   console.log('Servidor Abierto', app.get('port'));
});