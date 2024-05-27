//Declaraciones de funcionamiento
const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const session = require('express-session');
//Controladores de la app
const PjAutomate_controller = require('./src/controllers/project-automate-controller.js');
const Fileman_controller = require('./src/controllers/filemanager.js');
const pm_controller = require('./src/controllers/project-manager-controller.js');
//Modelos de funciones
const pj_manager = require('./src/models/project-manager-model.js');
const session_db = require('./src/models/session_controller_model.js');
//Configuracion
//const systemConfig = Fileman_controller.configure.readConfig();
const config = require('./config/config.js');


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ###################################### Gestion de Configuracion ################################################//

// Ruta para recibir y guardar la configuración del cliente
app.post('/saveConfig', (req, res) => {
  const { newSystemConfig } = req.body;


  if (!newSystemConfig) {
    return res.status(400).send('Faltan datos del cliente o configuración.');
  }

  Fileman_controller.configure.saveConfig(newSystemConfig, (err, message) => {
    if (err) {
      console.error('Error al guardar la configuración:', err);
      res.status(500).send('Error al guardar la configuración.');
    } else {
      res.send(message);
    }
  });
});

// Ruta para leer la configuración del cliente
app.get('/getConfig', (req, res) => {

  Fileman_controller.configure.readConfig((err, config) => {
    if (err) {
      console.error('Error al leer la configuración:', err);
      res.status(500).send(err.message);
    } else {
      res.json(config);
    }
  });
});

// Nueva ruta para aplicar la configuración del cliente
app.post('/applyConfig', (req, res) => {

  configure.applyConfig((err, message) => {
    if (err) {
      console.error('Error al aplicar la configuración:', err);
      res.status(500).send(err.message);
    } else {
      res.send(message);
    }
  });
});
// ###################################### Gestion de Configuracion ################################################//
// ###################################### Gestion de db SQLITE LOCAL ################################################//


// ###################################### Gestion de db SQLITE LOCAL ################################################//

// Evaluar el contenido de demo.js para que la función esté disponible
//eval(demoJsContent);
let msg = '';

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'views')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.use(
  session({
    secret: '12345',
    resave: false,
    saveUninitialized: false,
    rolling: true, // Renueva la sesión en cada solicitud
    cookie: {
      maxAge: 600000, // Tiempo en milisegundos (10 minutos)
    },
  })
);

// Middleware para autenticación
app.use((req, res, next) => {
  if (req.session.isLoggedIn) {
    next(); // Si está autenticado, continuar con la siguiente ruta o middleware
  } else {
    // Si no está autenticado, redirigir a la página de inicio de sesión
    if (req.url === '/' || req.url === '/login'|| req.url === '/config-server') {
      next();
    } else {
      next();
      //res.redirect('/login'); // Corregir aquí
    }
  }
});

//login
app.get('/login', (req, res) => {
  res.render('login', { msg });
});

//login
app.get('/config-server', (req, res) => {
  res.render('config-server', { msg });
});

// Ruta para manejar la autenticación
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const uservalid = await session_db.system.validarUsuario(
      username,
      password
    );
    if (uservalid !== null && uservalid.state === 1) {
      req.session.isLoggedIn = true;
      req.session.username = username;
      req.session.user_id = uservalid.id;
      req.session.name = uservalid.name;
      req.session.lastname = uservalid.lastname;
      req.session.email = uservalid.email;
      req.session.profilePic = uservalid.profilePic;
      req.session.def_dashboard_id = uservalid.def_dashboard_id;

      res.redirect('/app-selector');
    } else {
      let msg =
        uservalid === null || uservalid.state === 0
          ? 'Usuario deshabilitado'
          : 'Usuario o contraseña incorrectos';
      res.redirect(302, `/?msg=${encodeURIComponent(msg)}`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al autenticar el usuario');
  }
});

// Middleware para establecer la variable username en las respuestas
app.use((req, res, next) => {
  res.locals.username = req.session.username || null;
  next();
});

//dashboard
app.get('/app-selector', async (req, res) => {
  try {
    const dashboard = await pj_manager.system.obtenerdashboard(
      req.session.def_dashboard_id
    );
    console.log(dashboard, req.session.def_dashboard_id);
    body = dashboard.path;
    title = 'App Selector';
    res.render('app-selector', {
      session: req.session,
      title: title,
      body: body,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Error al obtener el app selector');
  }
});

//------------------------------------------------------------------------------ PROJECT MANAGER ----------------------------------------------------------------------------------------------------------//
//APP PROJECT MANAGER
app.use('/project-manager', pm_controller);
//------------------------------------------------------------------------------ PROJECT MANAGER ----------------------------------------------------------------------------------------------------------//

// Ruta para crear un nuevo registro
app.post('/crear', (req, res) => {
  const nuevoRegistro = req.body; // Suponemos que los datos llegan en el cuerpo de la solicitud

  pjManagerModel.create(nuevoRegistro, (err, resultado) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error al crear el registro');
    }

    res.status(201).json(resultado); // Devuelve el nuevo registro creado
  });
});

// Ruta para obtener todos los registros
app.get('/listar', (req, res) => {
  pjManagerModel.find({}, (err, registros) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error al obtener los registros');
    }

    res.json(registros); // Devuelve todos los registros
  });
});

// Ruta para obtener un registro por ID
app.get('/detalle/:id', (req, res) => {
  const id = req.params.id;

  pjManagerModel.findById(id, (err, registro) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error al obtener el registro');
    }

    res.json(registro); // Devuelve el registro encontrado
  });
});

// Ruta para eliminar un registro por ID
app.delete('/eliminar/:id', (req, res) => {
  const id = req.params.id;

  pjManagerModel.findByIdAndRemove(id, (err, registroEliminado) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error al eliminar el registro');
    }

    res.json(registroEliminado); // Devuelve el registro eliminado
  });
});

//------------------------------------------------------------------------------ PROJECT MANAGER ----------------------------------------------------------------------------------------------------------//

//APP PROJECT AUTOMATE
//dashboard
app.get('/powerautomate', (req, res) => {
  res.render('powerautomate', { username: req.session.username });
});

//logout
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

//dashboard
app.get('/icons', (req, res) => {
  res.render('icons', { username: req.session.username });
});

// Ruta principal
app.get('/sysmodals', (req, res) => {
  // Renderiza la vista EJS en lugar del archivo HTML
  body = '../views/partials/modals-test.html';
  title = 'Administrar Proyectos';
  res.render('sysmodals', { session: req.session });
});

//Project automate functions
app.post('/topvideosubmit', async (req, res) => {
  // Recibe los datos enviados desde el cliente
  const formData = req.body || {};

  try {
    // Ejecutar la función y manejar el rechazo si ocurre
    const result = await PjAutomate_controller.TopVideo.createscriptssh(
      formData
    );
    console.log(result);
    res.send(result);
  } catch (error) {
    console.error('Error al ejecutar el script:', error);
    res.status(500).send('Error al ejecutar el script');
  }
});

//run top video scripts
app.post('/runTopVideosScript', async (req, res) => {
  try {
    const scriptArgs = req.body.args || '';
    const pythonScriptPath = '/var/www/projectflow_nodejs/python/initial.py'; // Ruta al script de Python en tu servidor
    //const result = await PjAutomate_controller.TopVideo.listInputVideosssh(); //proyect_id,task_id,video_name,style
    res.send(result);
    console.log(result);
  } catch (err) {
    console.error('Error al ejecutar el script:', err);
    res.status(500).send('Error al ejecutar el script');
  }
});

//Filemanager functions
//get local folder files
app.post('/getlocalfiles', async (req, res) => {
  try {
    const scriptArgs = req.body.args || '';
    const pythonScriptPath = '/var/www/projectflow_nodejs/python/initial.py'; // Ruta al script de Python en tu servidor
    const files = await Fileman_controller.localfiles.getInputFolders(); //proyect_id,task_id,video_name,style
    res.send(files);
    console.log(files);
  } catch (err) {
    console.error('Error al ejecutar el script:', err);
    res.status(500).send('Error al ejecutar el script');
  }
});

// Ruta para manejar la subida un archivo
app.post(
  '/uploadafile',
  Fileman_controller.upload.single('archivo'),
  (req, res) => {
    // La subida se completó con éxito
    res.send('Archivo subido exitosamente');
  }
);

// Ruta para manejar la subida de varios archivos
app.post(
  '/uploadfiles',
  Fileman_controller.upload.array('archivos', 5),
  (req, res) => {
    // La subida se completó con éxito
    res.send('Archivos subidos exitosamente');
  }
);

//

//Manejador de rutas sin acceso
app.use((req, res, next) => {
  res.status(403).render('error/403');
});
// Manejador de rutas no encontradas
app.use((req, res, next) => {
  res.status(404).render('error/404');
});

// Manejador de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('error/500');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
