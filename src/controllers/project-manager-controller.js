const express = require('express');
const session = require('express-session');
const path = require('path');
const router = express.Router();
const pj_manager = require('../../src/models/project-manager-model.js');
const Fileman_controller = require('../../src/controllers/filemanager.js');

// Ruta principal
router.get('/', async (req, res) => {
  // Renderiza la vista EJS en lugar del archivo HTML

  const rolproyecto = await pj_manager.system.listarrolesproyecto();
  const projects = await pj_manager.projects.obtenerRegistros();
  const categories = await pj_manager.system.listarcategorias();
  const roles = await pj_manager.system.listarroles();
  const dashboards = await pj_manager.system.listardashboards();
  const mprojects = await pj_manager.macroprojects.obtenerRegistros();
  const genres = await pj_manager.projects.obtenerGeneros();

  body = '../views/partials/project_manager/projects.html';
  title = 'Administrar Proyectos';

  data = {
    macroproject: mprojects,
    roles: roles,
    projectrole: rolproyecto,
    categories: categories,
    projects: projects,
    genres: genres,
  };
  res.render('project-manager', {
    title: title,
    data: data,
    session: req.session,
  });
});

// ------------------------------------------------------------------------------------------------------------------------------------------------ Utilizar el middleware de carga en una ruta específica
router.post(
  '/upload-project-image',
  Fileman_controller.projectsImageStorage.single('project_pic'),
  (req, res) => {
    // La imagen se ha subido correctamente
    res.send('Imagen subida correctamente');
  }
);
// ------------------------------------------------------------------------------------------------------------------------------------------------ Utilizar el middleware de carga en una ruta específica

//------------------------------------------------------------------------------ PROJECT MANAGER -USUARIOS----------------------------------------------------------------------------------------------//

//----------------------------------### CREAR NUEVO USUARIO ###----------------------------------//
router.post('/crearusuario', async (req, res) => {
  try {
    const nuevoUsuario = req.body; // Los nuevos datos para actualizar
    console.log('Se ha ejecutado el create', nuevoUsuario);

    const nuevoRegistro = await pj_manager.users.crearusuario(nuevoUsuario);

    if (!nuevoRegistro) {
      return res.status(404).send('No se pudo guardar el usuario');
    }

    // Si la creacion se realiza con éxito, redirige al usuario a la página de administración de usuarios
    res.redirect('/project-manager/user?id=' + nuevoRegistro);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Error al actualizar el registro');
  }
});
//----------------------------------### CREAR NUEVO USUARIO ###----------------------------------//

//----------------------------------### ELIMINAR USUARIO POR ID ###----------------------------------//
router.get('/deleteUser', async (req, res) => {
  try {
    const user = req.query.id; // Los nuevos datos para actualizar
    console.log('Se ha ejecutado el delete', user);

    const Registro = await pj_manager.users.eliminarUsuario(user);

    if (!Registro) {
      return res.status(404).send('No se pudo guardar el usuario');
    }

    // Si la actualización se realiza con éxito, redirige al usuario a la página de administración de proyectos
    res.redirect('/project-manager/usersgrid');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Error al eliminar el registro');
  }
});
//----------------------------------### ELIMINAR USUARIO POR ID ###----------------------------------//

//----------------------------------### BUSCAR USUARIO POR TERMINO ###----------------------------------//

router.get('/buscarUsuarios', async (req, res) => {
  try {
    const { term } = req.query; // Obtiene el término de búsqueda de la consulta

    // Llama a la función para buscar usuarios por términos
    const usuariosEncontrados =
      await pj_manager.users.buscarUsuariosPorTerminos(term);
    console.log(usuariosEncontrados, 'usuario en ruta');

    // Comprueba si se encontraron usuarios
    if (typeof usuariosEncontrados === 'string') {
      console.log('no se encontro usuario');
      return { message: usuariosEncontrados };
    }

    // Si se encontraron usuarios, devuelve la lista de usuarios
    console.log('se encontro usuario y se envia en json');
    res.json(usuariosEncontrados);
  } catch (error) {
    console.error('Error en la ruta /buscarUsuarios:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});
//----------------------------------### BUSCAR USUARIO POR TERMINO ###----------------------------------//

//----------------------------------### ACTUALIZAR USUARIO POR ID ###----------------------------------//

router.post('/user-update/:id', async (req, res) => {
  try {
    const registroId = req.params.id; // Obtén el ID del registro a actualizar
    const datosActualizados = req.body; // Los nuevos datos para actualizar
    console.log('Se ha ejecutado el update', registroId, datosActualizados);

    const registroActualizado = await pj_manager.users.actualizardatosusuario(
      registroId,
      datosActualizados
    );

    if (!registroActualizado) {
      return res.status(404).send('Registro no encontrado');
    }

    // Si la actualización se realiza con éxito, redirige al usuario a la página de administración de proyectos
    res.redirect('/project-manager/usersgrid');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Error al actualizar el registro');
  }
});

//----------------------------------### ACTUALIZAR USUARIO POR ID ###----------------------------------//

//----------------------------------### ACTUALIZAR ROL DE USUARIO POR ID ###----------------------------------//

router.post('/update-user-role/:id', async (req, res) => {
  try {
    const registroId = req.params.id; // Obtén el ID del registro a actualizar
    const datosActualizados = req.body; // Los nuevos datos para actualizar
    console.log('Se ha ejecutado el update', registroId, datosActualizados);

    const registroActualizado = await pj_manager.users.actualizarrolusuario(
      registroId,
      datosActualizados
    );

    if (!registroActualizado) {
      return res.status(404).send('Registro no encontrado');
    }

    // Si la actualización se realiza con éxito, redirige al usuario a la página de administración de proyectos
    res.redirect('/project-manager/usersgrid');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Error al actualizar el registro');
  }
});

//----------------------------------### ACTUALIZAR ROL DE USUARIO POR ID ###----------------------------------//

//----------------------------------### ACTUALIZAR ESTADO DE USUARIO POR ID ###----------------------------------//

router.post('/update-user-state/', async (req, res) => {
  try {
    const { userId, newState } = req.query; // Obtén el ID del registro a actualizar

    const registroActualizado = await pj_manager.users.actualizarestadosuario(
      userId,
      newState
    );
    if (!registroActualizado) {
      return res.status(404).send('Registro no encontrado');
    }

    // Si la actualización se realiza con éxito, redirige al usuario a la página de administración de proyectos
    return 'Se ha actualizo el estado correctamente';
  } catch (error) {
    console.error(error);
    return res.status(500).send('Error al actualizar el registro');
  }
});
//----------------------------------### ACTUALIZAR ESTADO DE USUARIO POR ID ###----------------------------------//

//----------------------------------### ACTUALIZAR CONTRASEÑA DE USUARIO POR ID ###----------------------------------//

// Ruta para recibir los datos en el cliente
router.post('/update-user-password/:id', async (req, res) => {
  try {
    const registroId = req.params.id; // Obtén el ID del registro a actualizar
    const newpassword = req.body; // Los nuevos datos para actualizar
    console.log('Se ha ejecutado el pasword updater', registroId, newpassword);

    const uservalid = await session_db.system.validarUsuario(
      newpassword.username,
      newpassword.currentPassword
    );
    console.log('Resultado de la validación:', uservalid);

    if (uservalid !== null) {
      console.log('Contraseña válida');

      const registroActualizado = await pj_manager.users.actualizarpassusuario(
        registroId,
        newpassword
      );
      console.log('Resultado de la actualización:', registroActualizado);

      if (!registroActualizado) {
        console.log('Registro no encontrado');
        return res.status(404).send('Registro no encontrado');
      }

      // Si la actualización se realiza con éxito, redirige al usuario a la página de administración de proyectos
      console.log('Redirigiendo al usuario');
      res.redirect('/project-manager/usersgrid');
    } else {
      console.log('Contraseña incorrecta');
      return res.status(404).send('Contraseña incorrecta');
    }
  } catch (error) {
    console.error('Error en el servidor:', error);
    return res.status(500).send('Error al actualizar el registro');
  }
});

//----------------------------------### ACTUALIZAR CONTRASEÑA DE USUARIO POR ID ###----------------------------------//

//----------------------------------### LISTAR USUARIOS /DE FORMA INTERNA ###----------------------------------//

// Ruta para recibir los datos en el cliente
router.get('/users-data', async (req, res) => {
  // Recupera los datos de la consulta en el cliente
  const data = await pj_manager.users.obtenerRegistros();
  // Envía los datos como respuesta en formato JSON
  res.json(data);
});

//----------------------------------### LISTAR USUARIOS /DE FORMA INTERNA ###----------------------------------//
//----------------------------------### LISTAR USUARIOS /DE FORMA INTERNA Solo nombres e id ###----------------------------------//

// Ruta para recibir los datos en el cliente
router.get('/users-data-id-name', async (req, res) => {
  // Recupera los datos de la consulta en el cliente
  const data = await pj_manager.users.obtenerNombresId();
  // Envía los datos como respuesta en formato JSON
  res.json(data);
});

//----------------------------------### LISTAR USUARIOS /DE FORMA INTERNA Solo nombres e id ###----------------------------------//

//----------------------------------### VISTA GRID DE USUARIOS ###----------------------------------//

router.get('/usersgrid', async (req, res) => {
  try {
    // Realiza la consulta a la base de datos de forma asincrónica
    //const registros = await pj_manager.users.obtenerRegistros();

    // Renderiza la vista EJS y pasa los datos a la vista
    body = '../views/partials/project_manager/users-grid.html';
    title = 'Administrar Proyectos';
    data = ''; //registros;
    res.render(
      'project-manager',
      { data: data, title: title, body: body, session: req.session },
      (err, html) => {
        if (err) {
          // Manejo de errores al renderizar la vista
          console.error('Error al renderizar la vista:', err);
          res.status(500).send('Error interno del servidor');
        } else {
          // Envía la vista renderizada como respuesta

          res.send(html);
        }
      }
    );
  } catch (error) {
    // Manejo de errores
    console.error('Error al obtener registros:', error);
    res.status(500).send('Error interno del servidor');
  }
});

//----------------------------------### VISTA GRID DE USUARIOS ###----------------------------------//

//----------------------------------### VISTA DETALLE DE USUARIO ###----------------------------------//

//user details
router.get('/user', async (req, res) => {
  try {
    // Realiza la consulta a la base de datos de forma asincrónica
    const registros = await pj_manager.users.obtenerusuario(req.query.id);
    const roles = await pj_manager.system.listarroles();
    const dashboards = await pj_manager.system.listardashboards();

    // Renderiza la vista EJS y pasa los datos a la vista
    body = '../views/partials/project_manager/user-detail.html';
    title = 'Administrar Proyectos';
    data = { user: registros, roles: roles, dashboards: dashboards };
    res.render(
      'project-manager',
      { data: data, title: title, body: body, session: req.session },
      (err, html) => {
        if (err) {
          // Manejo de errores al renderizar la vista
          console.error('Error al renderizar la vista:', err);
          res.status(500).send('Error interno del servidor', err);
        } else {
          // Envía la vista renderizada como respuesta

          res.send(html);
        }
      }
    );
  } catch (error) {
    // Manejo de errores
    console.error('Error al obtener registros:', error);
    res.status(500).send('Error interno del servidor', error);
  }
});
//----------------------------------### VISTA DETALLE DE USUARIO ###----------------------------------//

//------------------------------------------------------------------------------ PROJECT MANAGER -USUARIOS----------------------------------------------------------------------------------------------//

//------------------------------------------------------------------------------ PROJECT MANAGER -PROYECTOS---------------------------------------------------------------------------------------------//

//----------------------------------### CREAR NUEVO PROYECTO ###----------------------------------//
router.post(
  '/newproject',
  Fileman_controller.projectsImageStorage.single('project_image'),
  async (req, res) => {
    try {
      const nuevoProyecto = req.body; // Los nuevos datos para actualizar, incluida la ruta de la imagen

      // Verifica si se seleccionó una imagen
      if (req.file) {
        const imagePath = req.file.path.replace(/\\/g, '/'); // Corrige la ruta para que sea compatible con Windows
        const relativePath = path.relative(
          path.join(__dirname, '../assets'),
          imagePath
        );
        nuevoProyecto.project_pic = relativePath; // Guardar la ruta de la imagen en el objeto del proyecto
        console.log('Se ha ejecutado el create', nuevoProyecto);
      }

      const proyecto = await pj_manager.projects.crearproyecto(nuevoProyecto);
      if (!proyecto) {
        return res.status(404).send('No se pudo guardar el Proyecto');
      }
      const datosProyecto = await pj_manager.projects.obtenerproyecto(proyecto);
      const crearCuentas = await pj_manager.projects.crearCuentasProyecto(
        datosProyecto
      );
      const crearArchivos =
        await Fileman_controller.projectFilemanager.crearEstructuraProyecto(
          datosProyecto.name
        );

      // Si la actualización se realiza con éxito, redirige al usuario a la página de administración de proyectos
      res.redirect('/project-manager');
    } catch (error) {
      console.error(error);
      return res.status(500).send('Error al Crear el registro');
    }
  }
);

//----------------------------------### CREAR NUEVO PROYECTO  ###----------------------------------//

//----------------------------------### ELIMINAR PROYECTO  POR ID ###----------------------------------//
router.get('/deleteproject', async (req, res) => {
  try {
    const project = req.query.id; // Los nuevos datos para actualizar
    console.log('Se ha ejecutado el delete', project);

    const datosProyecto = await pj_manager.projects.obtenerproyecto(project);
    const eliminarCuentas = await pj_manager.projects.eliminarCuentasProyecto(
      datosProyecto
    );
    //const crearArchivos = await Fileman_controller.

    const Registro = await pj_manager.projects.eliminarProyecto(project);

    if (!Registro) {
      return res.status(404).send('No se pudo eliminar el Proyecto');
    }

    // Si la actualización se realiza con éxito, redirige al usuario a la página de administración de proyectos
    res.redirect('/project-manager');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Error al eliminar el registro');
  }
});
//----------------------------------### ELIMINAR PROYECTO  POR ID ###----------------------------------//

//----------------------------------### BUSCAR PROYECTO  POR TERMINO ###----------------------------------//

router.get('/searchProject', async (req, res) => {
  try {
    const { term } = req.query; // Obtiene el término de búsqueda de la consulta

    // Llama a la función para buscar usuarios por términos
    const usuariosEncontrados =
      await pj_manager.users.buscarUsuariosPorTerminos(term);
    console.log(usuariosEncontrados, 'usuario en ruta');

    // Comprueba si se encontraron usuarios
    if (typeof usuariosEncontrados === 'string') {
      console.log('no se encontro usuario');
      return { message: usuariosEncontrados };
    }

    // Si se encontraron usuarios, devuelve la lista de usuarios
    console.log('se encontro usuario y se envia en json');
    res.json(usuariosEncontrados);
  } catch (error) {
    console.error('Error en la ruta /buscarUsuarios:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});
//----------------------------------### BUSCAR PROYECTO  POR TERMINO ###----------------------------------//

//----------------------------------### ACTUALIZAR PROYECTO  POR ID ###----------------------------------//

router.post(
  '/project-update',
  Fileman_controller.projectsImageStorage.single('project_image'),
  async (req, res) => {
    try {
      const registroId = req.body.pid; // Obtén el ID del registro a actualizar
      const datosActualizados = req.body; // Los nuevos datos para actualizar
      console.log('Update Projecto: ', req.body, 'File:', req.file);

      // Verifica si se seleccionó una imagen
      if (req.file) {
        const imagePath = req.file.path.replace(/\\/g, '/'); // Corrige la ruta para que sea compatible con Windows
        const relativePath = path.relative(
          path.join(__dirname, '../assets'),
          imagePath
        );
        datosActualizados.project_pic = relativePath; // Guardar la ruta de la imagen en el objeto del proyecto
      }

      const registroActualizado =
        await pj_manager.projects.actualizardatosproyecto(
          registroId,
          datosActualizados
        );

      if (!registroActualizado) {
        return res.status(404).send('Registro no encontrado');
      }

      // Si la actualización se realiza con éxito, redirige al usuario a la página de administración de proyectos
      res.redirect('/project-manager');
    } catch (error) {
      console.error(error);
      return res.status(500).send('Error al actualizar el registro');
    }
  }
);

//----------------------------------### ACTUALIZAR PROYECTO  POR ID ###----------------------------------//

//----------------------------------### ACTUALIZAR ROL DE PROYECTO  POR ID ###----------------------------------//

router.post('/update-project-role/:id', async (req, res) => {
  try {
    const registroId = req.params.id; // Obtén el ID del registro a actualizar
    const datosActualizados = req.body; // Los nuevos datos para actualizar
    console.log('Se ha ejecutado el update', registroId, datosActualizados);

    const registroActualizado = await pj_manager.users.actualizarrolusuario(
      registroId,
      datosActualizados
    );

    if (!registroActualizado) {
      return res.status(404).send('Registro no encontrado');
    }

    // Si la actualización se realiza con éxito, redirige al usuario a la página de administración de proyectos
    res.redirect('/project-manager/usersgrid');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Error al actualizar el registro');
  }
});

//----------------------------------### ACTUALIZAR ROL DE PROYECTO  POR ID ###----------------------------------//

//----------------------------------### ACTUALIZAR ESTADO DE PROYECTO  POR ID ###----------------------------------//

router.post('/update-project-state/', async (req, res) => {
  try {
    const { userId, newState } = req.query; // Obtén el ID del registro a actualizar

    const registroActualizado = await pj_manager.users.actualizarestadosuario(
      userId,
      newState
    );
    if (!registroActualizado) {
      return res.status(404).send('Registro no encontrado');
    }

    // Si la actualización se realiza con éxito, redirige al usuario a la página de administración de proyectos
    return 'Se ha actualizo el estado correctamente';
  } catch (error) {
    console.error(error);
    return res.status(500).send('Error al actualizar el registro');
  }
});
//----------------------------------### ACTUALIZAR ESTADO DE PROYECTO  POR ID ###----------------------------------//

//----------------------------------### ACTUALIZAR CONTRASEÑA DE PROYECTO  POR ID ###----------------------------------//

// Ruta para recibir los datos en el cliente
router.post('/update-project-password/:id', async (req, res) => {
  try {
    const registroId = req.params.id; // Obtén el ID del registro a actualizar
    const newpassword = req.body; // Los nuevos datos para actualizar
    console.log('Se ha ejecutado el pasword updater', registroId, newpassword);

    const uservalid = await session_db.system.validarUsuario(
      newpassword.username,
      newpassword.currentPassword
    );
    console.log('Resultado de la validación:', uservalid);

    if (uservalid !== null) {
      console.log('Contraseña válida');

      const registroActualizado = await pj_manager.users.actualizarpassusuario(
        registroId,
        newpassword
      );
      console.log('Resultado de la actualización:', registroActualizado);

      if (!registroActualizado) {
        console.log('Registro no encontrado');
        return res.status(404).send('Registro no encontrado');
      }

      // Si la actualización se realiza con éxito, redirige al usuario a la página de administración de proyectos
      console.log('Redirigiendo al usuario');
      res.redirect('/project-manager/usersgrid');
    } else {
      console.log('Contraseña incorrecta');
      return res.status(404).send('Contraseña incorrecta');
    }
  } catch (error) {
    console.error('Error en el servidor:', error);
    return res.status(500).send('Error al actualizar el registro');
  }
});

//----------------------------------### ACTUALIZAR CONTRASEÑA DE PROYECTO  POR ID ###----------------------------------//
//----------------------------------### LISTAR Projectos /DE FORMA INTERNA ###----------------------------------//

router.get('/module-data/:id', async (req, res) => {
  try {
    console.log('update hecho', req.params);
    const id = req.params.id;

    const data = await pj_manager.projects.obtenerModulosPorId(id);

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los datos.' });
  }
});

//----------------------------------### LISTAR Projectos /DE FORMA INTERNA ###----------------------------------//

//----------------------------------### LISTAR Projectos /DE FORMA INTERNA ###----------------------------------//

router.get('/projects-data', async (req, res) => {
  try {
    // Recupera los datos de la consulta en el cliente
    const macroProjects = await pj_manager.macroprojects.obtenerRegistros();
    const projects = await pj_manager.projects.obtenerRegistros();
    const modules = await pj_manager.projects.obtenerModulos();

    console.log(macroProjects);
    console.log(projects);
    console.log(modules);

    // Mapea los datos para combinarlos en una sola estructura
    const combinedData = macroProjects.map((mp) => {
      const mpProjects = projects
        .filter((p) => p.macro_project_id === mp.id)
        .map((project) => {
          const projectModules = Array.isArray(modules)
            ? modules.filter(
                (m) => parseInt(m.project_id) === parseInt(project.id)
              )
            : [];
          return { ...project, modules: projectModules };
        });
      return { ...mp, projects: mpProjects };
    });

    res.json(combinedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los datos.' });
  }
});

//----------------------------------### LISTAR Projectos /DE FORMA INTERNA ###----------------------------------//
//----------------------------------### LISTAR Objetivos /DE FORMA INTERNA ###----------------------------------//

router.get('/Objectives-data', async (req, res) => {
  try {
    // Recupera los datos de la consulta en el cliente
    const data = await pj_manager.macroprojects.obtenerObjetivosSysview1();

    const nestedData = data.reduce((acc, row) => {
      // Verificar si ya existe el macroproyecto en el acumulador
      const existingMacroProject = acc.find(
        (item) => item.Macro_Project_id === row.Macro_Project_id
      );
      if (existingMacroProject) {
        // Verificar si ya existe el proyecto en el macroproyecto
        const existingProject = existingMacroProject.Projects.find(
          (proj) => proj.Project_id === row.Project_id
        );
        if (existingProject) {
          // Si ya existe el proyecto, agregar solo el objetivo
          existingProject.Objectives.push({
            Objective_id: row.id,
            Objective_name: row.name,
            Objective_project_id: row.Project_id,
            Objective_project_name: row.Project_name,
            Objective_description: row.description,
            Objective_target: row.target,
            Objective_target_type: row.target_type,
            Objective_status: row.status,
          });
        } else {
          // Si no existe el proyecto, crearlo con su objetivo
          existingMacroProject.Projects.push({
            Project_id: row.Project_id,
            Project_name: row.Project_name,
            Project_pic: row.Project_pic,
            Project_category: row.Project_category,
            Project_description: row.Project_description,
            Project_start_date: row.Project_start_date,
            Project_end_date: row.Project_end_date,
            Project_created_at: row.Project_created_at,
            Objectives: [
              {
                Objective_id: row.id,
                Objective_name: row.name,
                Objective_project_id: row.Project_id,
                Objective_project_name: row.Project_name,
                Objective_description: row.description,
                Objective_target: row.target,
                Objective_target_type: row.target_type,
                Objective_status: row.status,
              },
            ],
          });
        }
      } else {
        // Si no existe el macroproyecto, crearlo con su proyecto y objetivo
        acc.push({
          Macro_Project_id: row.Macro_Project_id,
          Macro_Project_name: row.Macro_Project_name,
          Macro_Project_description: row.Macro_Project_description,
          Macro_Project_pic: row.Macro_Project_pic,
          Projects: [
            {
              Project_id: row.Project_id,
              Project_name: row.Project_name,
              Project_pic: row.Project_pic,
              Project_category: row.Project_category,
              Project_description: row.Project_description,
              Project_start_date: row.Project_start_date,
              Project_end_date: row.Project_end_date,
              Project_created_at: row.Project_created_at,
              Objectives: [
                {
                  Objective_id: row.id,
                  Objective_project_id: row.Project_id,
                  Objective_project_name: row.Project_name,
                  Objective_name: row.name,
                  Objective_description: row.description,
                  Objective_target: row.target,
                  Objective_target_type: row.target_type,
                  Objective_status: row.status,
                },
              ],
            },
          ],
        });
      }
      return acc;
    }, []);

    res.json(nestedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los datos.' });
  }
});

//----------------------------------### LISTAR Objetivos /DE FORMA INTERNA ###----------------------------------//
//----------------------------------### ACTUALIZAR Objetivo POR ID ###----------------------------------//

router.post('/edit-objective/:id', async (req, res) => {
  try {
    const registroId = req.params.id; // Obtén el ID del registro a actualizar
    const datosActualizados = req.body; // Los nuevos datos para actualizar
    console.log('Se ha ejecutado el update', registroId, datosActualizados);

    console.log(req.body);

    const registroActualizado = await pj_manager.projects.editarObjetivo(
      registroId,
      datosActualizados
    );

    if (!registroActualizado) {
      return res.status(404).send('Registro no encontrado');
    }

    // Si la actualización se realiza con éxito, redirige al usuario a la página de administración de proyectos
    res.redirect('/project-manager');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Error al actualizar el registro');
  }
});

//----------------------------------### ACTUALIZAR Objetivo POR ID ###----------------------------------//
//----------------------------------### CREAR Objetivo POR ID ###----------------------------------//

router.post('/new-objective/', async (req, res) => {
  try {
    const datos = req.body; // Los nuevos datos para actualizar
    console.log('Se ha ejecutado el update', datos);

    console.log(req.body);

    const nuevoRegistro = await pj_manager.projects.crearObjetivo(datos);

    if (!nuevoRegistro) {
      return res.status(404).send('Registro no encontrado');
    }

    // Si la actualización se realiza con éxito, redirige al usuario a la página de administración de proyectos
    res.redirect('/project-manager');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Error al actualizar el registro');
  }
});

//----------------------------------### CREAR Objetivo POR ID ###----------------------------------//
//----------------------------------### ACTUALIZAR Objetivo POR ID ###----------------------------------//

router.post('/delete-objective/:id', async (req, res) => {
  try {
    const registroId = req.params.id; // Obtén el ID del registro a actualizar
    console.log('Se ha ejecutado el delete', registroId);

    const registro = await pj_manager.projects.eliminarObjetivo(registroId);

    if (!registro) {
      return res.status(404).send('Registro no Eliminado');
    }

    // Si la actualización se realiza con éxito, redirige al usuario a la página de administración de proyectos
    res.redirect('/project-manager/');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Error al eliminar el registro');
  }
});

//----------------------------------### ACTUALIZAR Objetivo POR ID ###----------------------------------//
//----------------------------------### ACTUALIZAR Objetivo POR ID ###----------------------------------//

router.post('/Objetive-Ok/:id', async (req, res) => {
  try {
    const registroId = req.params.id; // Obtén el ID del registro a actualizar
    console.log('Se ha ejecutado el update ok ', registroId);

    console.log(req.body);

    const registroActualizado = await pj_manager.projects.marcarObjetivo(
      registroId
    );

    if (!registroActualizado) {
      return res.status(404).send('Registro no encontrado');
    }

    // Si la actualización se realiza con éxito, redirige al usuario a la página de administración de proyectos
    res.redirect('/project-manager');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Error al actualizar el registro');
  }
});

//----------------------------------### ACTUALIZAR Objetivo POR ID ###----------------------------------//
//----------------------------------### LISTAR Projectos /DE FORMA INTERNA ###----------------------------------//

router.get('/get-macro-project', async (req, res) => {
  try {
    const mpid = req.query.mpid;
    // Recupera los datos de la consulta en el cliente
    const macroProjects =
      await pj_manager.macroprojects.obtenerRegistrosPorIdSysview(mpid);

    res.json(macroProjects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los datos.' });
  }
});

//----------------------------------### LISTAR USUARIOS /DE FORMA INTERNA ###----------------------------------//

//----------------------------------### LISTAR Projectos1 /DE FORMA INTERNA ###----------------------------------//

router.get('/get-macro-project-related', async (req, res) => {
  try {
    const mpid = req.query.mpid;
    // Recupera los datos de la consulta en el cliente
    const macroProjects = await pj_manager.macroprojects.obtenerRegistroPorId(
      mpid
    );
    const relatedProjects =
      await pj_manager.macroprojects.obtenerRegistrosPorIdSysview(mpid);
    const data = {
      macroProjects: macroProjects,
      relatedProjects: relatedProjects,
    };

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los datos.' });
  }
});

//----------------------------------### LISTAR Projectos1 /DE FORMA INTERNA ###----------------------------------//
//----------------------------------### LISTAR Projectos1 /DE FORMA INTERNA ###----------------------------------//

router.get('/get-project-related', async (req, res) => {
  try {
    const pid = req.query.pid;
    // Recupera los datos de la consulta en el cliente
    const Projects = await pj_manager.projects.obtenerRegistroPorId(pid);
    const relatedModules = await pj_manager.projects.obtenerModulosProyecto(
      pid
    );
    const data = { projects: Projects, relatedModules: relatedModules };

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los datos.' });
  }
});

//----------------------------------### LISTAR Projectos1 /DE FORMA INTERNA ###----------------------------------//

//----------------------------------### VISTA GRID DE PROJECTOS ###----------------------------------//

router.get('/projectsgrid', async (req, res) => {
  try {
    // Realiza la consulta a la base de datos de forma asincrónica
    //const registros = await pj_manager.users.obtenerRegistros();

    // Renderiza la vista EJS y pasa los datos a la vista
    body = '../views/partials/project_manager/projects-grid.html';
    title = 'Administrar Proyectos';
    data = ''; //registros;
    res.render(
      'project-manager',
      { data: data, title: title, body: body, session: req.session },
      (err, html) => {
        if (err) {
          // Manejo de errores al renderizar la vista
          console.error('Error al renderizar la vista:', err);
          res.status(500).send('Error interno del servidor');
        } else {
          // Envía la vista renderizada como respuesta

          res.send(html);
        }
      }
    );
  } catch (error) {
    // Manejo de errores
    console.error('Error al obtener registros:', error);
    res.status(500).send('Error interno del servidor');
  }
});

//----------------------------------### VISTA GRID DE USUARIOS ###----------------------------------//

//----------------------------------### VISTA DETALLE DE PROYECTO  ###----------------------------------//

//user details
router.get('/project', async (req, res) => {
  try {
    // Realiza la consulta a la base de datos de forma asincrónica
    const registros = await pj_manager.projects.obtenerproyecto(req.query.id);
    const miembros = await pj_manager.projects.obtenerMiembrosProyecto(
      req.query.id
    );
    const cuentasproyecto = await pj_manager.projects.obtenerCuentasProyecto(
      req.query.id
    );
    const activosproyecto = await pj_manager.projects.obtenerActivosProyecto(
      req.query.id
    );
    const tareasproyecto = await pj_manager.projects.obtenerTareasProyecto(
      req.query.id
    );
    const modulosproyecto = await pj_manager.projects.obtenerModulosProyecto(
      req.query.id
    );
    const rolproyecto = await pj_manager.system.listarrolesproyecto();
    const categories = await pj_manager.system.listarcategorias();
    const roles = await pj_manager.system.listarroles();
    const dashboards = await pj_manager.system.listardashboards();

    // Renderiza la vista EJS y pasa los datos a la vista
    body = '../views/partials/project_manager/project-detail.html';
    title = 'Administrar Proyectos';
    data = {
      project: registros,
      tasks: tareasproyecto,
      pmodules: modulosproyecto,
      roles: roles,
      dashboards: dashboards,
      projectassets: activosproyecto,
      members: miembros,
      projectaccounts: cuentasproyecto,
      projectrole: rolproyecto,
      categories: categories,
    };
    res.render(
      'project-manager',
      { data: data, title: title, body: body, session: req.session },
      (err, html) => {
        if (err) {
          // Manejo de errores al renderizar la vista
          console.error('Error al renderizar la vista:', err);
          res.status(500).send('Error interno del servidor', err);
        } else {
          // Envía la vista renderizada como respuesta

          res.send(html);
        }
      }
    );
  } catch (error) {
    // Manejo de errores
    console.error('Error al obtener registros:', error);
    res.status(500).send('Error interno del servidor', error);
  }
});
//----------------------------------### VISTA DETALLE DE PROYECTO  ###----------------------------------//
//------------------------------------------------------------------------------ PROJECT MANAGER -PROYECTOS---------------------------------------------------------------------------------------------//
//------------------------------------------------------------------------------ PROJECT MANAGER -MACRO PROYECTOS---------------------------------------------------------------------------------------------//

//----------------------------------### CREAR NUEVO MACRO PROYECTO ###----------------------------------//
router.post('/newmacroproject', async (req, res) => {
  try {
    const nuevomacroProyecto = req.body; // Los nuevos datos para actualizar
    console.log('Se ha ejecutado el create', nuevomacroProyecto);

    const nuevoRegistro = await pj_manager.macroprojects.crear(
      nuevomacroProyecto
    );

    if (!nuevoRegistro) {
      return res.status(404).send('No se pudo guardar el Macro Proyecto');
    }

    // Si la actualización se realiza con éxito, redirige al usuario a la página de administración de proyectos
    res.redirect('/project-manager');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Error al crear el macro proyecto');
  }
});
//----------------------------------### CREAR NUEVO MACRO PROYECTO  ###----------------------------------//
//----------------------------------### NUEVO MACRO PROYECTO FORMULARIO ###----------------------------------//
router.get('/new-macro-project', async (req, res) => {
  try {
    // Realiza la consulta a la base de datos de forma asincrónica
    const categories = await pj_manager.system.listarcategorias();

    // Renderiza la vista EJS y pasa los datos a la vista
    body = '../views/partials/project_manager/new-macro-project.html';
    title = 'Editar Macro Proyecto';
    data = { categories: categories };
    res.render(
      'project-manager',
      { data: data, title: title, body: body, session: req.session },
      (err, html) => {
        if (err) {
          // Manejo de errores al renderizar la vista
          console.error('Error al renderizar la vista:', err);
          res.status(500).send('Error interno del servidor', err);
        } else {
          // Envía la vista renderizada como respuesta
          console.log(data);
          res.send(html);
        }
      }
    );
  } catch (error) {
    // Manejo de errores
    console.error('Error al obtener registros:', error);
    res.status(500).send('Error interno del servidor', error);
  }
});
//----------------------------------### NUEVO MACRO PROYECTO FORMULARIO ###----------------------------------//
//----------------------------------### ACTUALIZAR MACRO PROYECTO POR ID ###----------------------------------//

router.post('/macro-project-update', async (req, res) => {
  try {
    console.log(req.body.id);
    const registroId = req.body.id; // Obtén el ID del registro a actualizar
    const datosActualizados = req.body; // Los nuevos datos para actualizar
    console.log('Se ha ejecutado el update', registroId, datosActualizados);

    const registroActualizado =
      await pj_manager.macroprojects.actualizarRegistroPorId(
        registroId,
        datosActualizados
      );

    if (!registroActualizado) {
      return res.status(404).send('Registro no encontrado');
    }

    // Si la actualización se realiza con éxito, redirige al usuario a la página de administración de proyectos
    res.redirect('/project-manager');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Error al actualizar el registro');
  }
});

//----------------------------------### ACTUALIZAR MACRO PROYECTO POR ID ###----------------------------------//
//----------------------------------### ACTUALIZAR MACRO PROYECTO FORMULARIO ###----------------------------------//
router.get('/update-macro-project', async (req, res) => {
  try {
    // Realiza la consulta a la base de datos de forma asincrónica
    const registros = await pj_manager.macroprojects.obtenerRegistroPorId(
      req.query.id
    );

    // Renderiza la vista EJS y pasa los datos a la vista
    body = '../views/partials/project_manager/edit-macro-project.html';
    title = 'Editar Macro Proyecto';
    data = { macroproject: registros };
    res.render(
      'project-manager',
      { data: data, title: title, body: body, session: req.session },
      (err, html) => {
        if (err) {
          // Manejo de errores al renderizar la vista
          console.error('Error al renderizar la vista:', err);
          res.status(500).send('Error interno del servidor', err);
        } else {
          // Envía la vista renderizada como respuesta
          console.log(data);
          res.send(html);
        }
      }
    );
  } catch (error) {
    // Manejo de errores
    console.error('Error al obtener registros:', error);
    res.status(500).send('Error interno del servidor', error);
  }
});
//----------------------------------### ACTUALIZAR MACRO PROYECTO FORMULARIO ###----------------------------------//
//----------------------------------### ELIMINAR  MACRO PROYECTO  POR ID ###----------------------------------//
router.get('/deletemacroproject', async (req, res) => {
  try {
    const macroProject = req.query.id;
    console.log('Se ha ejecutado el delete', macroProject);

    const Registro = await pj_manager.macroprojects.eliminarRegistro(
      macroProject
    );

    if (!Registro) {
      return res.status(404).send('No se pudo eliminar el Proyecto');
    }

    // Si la actualización se realiza con éxito, redirige al usuario a la página de administración de proyectos
    res.redirect('/project-manager');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Error al eliminar el registro');
  }
});
//----------------------------------### ELIMINAR MACRO PROYECTO  POR ID ###----------------------------------//

//----------------------------------### OBTENER MACRO PROYECTO ###----------------------------------//
router.get('/macroprojects', async (req, res) => {
  // Recupera los macro proyectos
  const data = await pj_manager.macroprojects.obtenerRegistros();
  console.log(data);
  res.json(data);
});

//----------------------------------### OBTENER MACRO PROYECTO  ###----------------------------------//

//------------------------------------------------------------------------------ PROJECT MANAGER -MACRO PROYECTOS       ---------------------------------------------------------------------------------------------//

//------------------------------------------------------------------------------ PROJECT MANAGER -ADICIONES A PROYECTOS ---------------------------------------------------------------------------------------------//

//----------------------------------### AGREGAR MIEMBRO A PROYECTO FORMULARIO ###----------------------------------//
router.get('/user-to-proj-form', async (req, res) => {
  try {
    // Realiza la consulta a la base de datos de forma asincrónica
    const proyecto = await pj_manager.projects.obtenerRegistroPorId(
      req.query.id
    );
    const usuarios = await pj_manager.users.obtenerRegistros();
    const roles = await pj_manager.projects.obtenerroles();

    // Renderiza la vista EJS y pasa los datos a la vista
    body = '../views/partials/project_manager/add-users.html';
    title = 'Agregar Usuarios a Projecto';
    data = { project: proyecto, users: usuarios, roles: roles };
    res.render(
      'project-manager_2',
      { data: data, title: title, body: body, session: req.session },
      (err, html) => {
        if (err) {
          // Manejo de errores al renderizar la vista
          console.error('Error al renderizar la vista:', err);
          res.status(500).send('Error interno del servidor', err);
        } else {
          // Envía la vista renderizada como respuesta
          console.log(data);
          res.send(html);
        }
      }
    );
  } catch (error) {
    // Manejo de errores
    console.error('Error al obtener registros:', error);
    res.status(500).send('Error interno del servidor', error);
  }
});
//----------------------------------### AGREGAR MIEMBRO A PROYECTO FORMULARIO ###----------------------------------//
//----------------------------------### CAMBIAR ROL DE PROYECTO ###----------------------------------//

// Ruta para actualizar el rol del proyecto
router.post('/update-project-role', async (req, res) => {
  try {
    const userId = req.body.userId;
    const roleId = req.body.roleId;
    const rowId = req.body.rowId;

    const datosActualizados = { idUsuario: userId, idRol: roleId };

    const registroActualizado = await pj_manager.projects.actualizarRolPorId(
      rowId,
      datosActualizados
    );
    console.log(
      `Actualizando rol para el usuario ${userId}, nuevo rol: ${roleId}, fila: ${rowId}`
    );

    if (!registroActualizado) {
      return res.status(404).send('Registro no encontrado');
    }
    // Enviar una respuesta al cliente
    res.json({ success: true, message: 'Rol actualizado exitosamente' });
  } catch (error) {
    // Manejo de errores
    console.error('Error al editar registros:', error);
    res.status(500).send('Error interno del servidor', error);
  }
});
//----------------------------------### CAMBIAR ROL DE PROYECTO ###----------------------------------//
//----------------------------------### CREAR NUEVO MIEMBRO PROYECTO ###----------------------------------//
router.post('/add-user-to-project', async (req, res) => {
  try {
    const member = req.body; // Los nuevos datos para actualizar
    console.log('Se ha ejecutado el create', member);

    const nuevoRegistro = await pj_manager.projects.crearMiembro(member);

    if (!nuevoRegistro) {
      return res.status(404).send('No se pudo guardar el miembro del Proyecto');
    }

    // Si la actualización se realiza con éxito, redirige al usuario a la página de administración de proyectos
    res.redirect('/project-manager/project?id=' + member.pid);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Error al guardar el miembro del Projecto');
  }
});
//----------------------------------### CREAR NUEVO MIEMBRO PROYECTO  ###----------------------------------//
//----------------------------------### ELIMINAR NUEVO MIEMBRO PROYECTO ###----------------------------------//
router.get('/delete-user-from-project', async (req, res) => {
  try {
    const member = req.query; // Los DATOS PARA ELIMINAR
    console.log('Se ha ejecutado el delete', member);

    const nuevoRegistro = await pj_manager.projects.eliminarMiembro(
      member.rwid
    );

    if (!nuevoRegistro) {
      return res
        .status(404)
        .send('No se pudo eliminar el miembro del Proyecto');
    }

    // Si la actualización se realiza con éxito, redirige al usuario a la página de administración de proyectos
    res.redirect('/project-manager/project?id=' + member.pid);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Error al Eliminar el miembro del Projecto');
  }
});
//----------------------------------### ELIMINAR NUEVO MIEMBRO PROYECTO  ###----------------------------------//

//----------------------------------### AGREGAR TAREA A PROYECTO FORMULARIO ###----------------------------------//
router.get('/task-to-proj-form', async (req, res) => {
  try {
    // Realiza la consulta a la base de datos de forma asincrónica
    const proyecto = await pj_manager.projects.obtenerRegistroPorId(
      req.query.id
    );
    const miembrosdeproyecto =
      await pj_manager.projects.obtenerMiembrosProyecto(req.query.id);
    const Tags = await pj_manager.projects.obtenerTags();

    // Renderiza la vista EJS y pasa los datos a la vista
    body = '../views/partials/project_manager/add-task.html';
    title = 'Agregar tarea personalizada a Projecto';
    data = { project: proyecto, tags: Tags, members: miembrosdeproyecto };
    res.render(
      'project-manager_2',
      { data: data, title: title, body: body, session: req.session },
      (err, html) => {
        if (err) {
          // Manejo de errores al renderizar la vista
          console.error('Error al renderizar la vista:', err);
          res.status(500).send('Error interno del servidor', err);
        } else {
          // Envía la vista renderizada como respuesta
          console.log(data);
          res.send(html);
        }
      }
    );
  } catch (error) {
    // Manejo de errores
    console.error('Error al obtener registros:', error);
    res.status(500).send('Error interno del servidor', error);
  }
});
//----------------------------------### AGREGAR TAREA A PROYECTO FORMULARIO ###----------------------------------//
//----------------------------------### EDITAR TAREA PROYECTO FORMULARIO ###----------------------------------//
router.get('/task-edit-proj-form', async (req, res) => {
  try {
    // Realiza la consulta a la base de datos de forma asincrónica
    const tarea = await pj_manager.projects.obtenerTareasPorId(req.query.id);
    const proyecto = await pj_manager.projects.obtenerRegistroPorId(
      req.query.pid
    );
    const miembrosdeproyecto =
      await pj_manager.projects.obtenerMiembrosProyecto(req.query.pid);
    const tags = await pj_manager.projects.obtenerTags();

    // Renderiza la vista EJS y pasa los datos a la vista
    body = '../views/partials/project_manager/edit-task.html';
    title = 'Editar tarea personalizada de Projecto';
    data = {
      project: proyecto,
      tags: tags,
      task: tarea,
      members: miembrosdeproyecto,
    };
    res.render(
      'project-manager_2',
      { data: data, title: title, body: body, session: req.session },
      (err, html) => {
        if (err) {
          // Manejo de errores al renderizar la vista
          console.error('Error al renderizar la vista:', err);
          res.status(500).send('Error interno del servidor', err);
        } else {
          // Envía la vista renderizada como respuesta
          console.log(data);
          res.send(html);
        }
      }
    );
  } catch (error) {
    // Manejo de errores
    console.error('Error al obtener registros:', error);
    res.status(500).send('Error interno del servidor', error);
  }
});
//----------------------------------### EDITAR TAREA PROYECTO FORMULARIO ###----------------------------------//
//----------------------------------### CREAR NUEVA TAREA PARA PROYECTO ###----------------------------------//
router.post('/add-task-to-project', async (req, res) => {
  try {
    const task = req.body; // Los nuevos datos para actualizar
    console.log('Se ha ejecutado el create', task);

    const nuevoRegistro = await pj_manager.projects.crearTarea(task);

    if (!nuevoRegistro) {
      return res
        .status(404)
        .send('No se pudo guardar agregar la tarea al Proyecto');
    }

    // Si la actualización se realiza con éxito, redirige al usuario a la página de administración de proyectos
    res.redirect('/project-manager/project?id=' + task.pid);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send('Ocurrio un error al guardar la tarea al Proyecto');
  }
});
//----------------------------------### CREAR NUEVA TAREA PARA PROYECTO  ###----------------------------------//
//----------------------------------### EDITAR TAREA PARA PROYECTO ###----------------------------------//
router.post('/edit-task-to-project', async (req, res) => {
  try {
    const task = req.body; // Los nuevos datos para actualizar
    const taskid = req.body.taskid;
    console.log('Se ha ejecutado el edit', task);

    const nuevoRegistro = await pj_manager.projects.editarTarea(taskid, task);

    if (!nuevoRegistro) {
      return res
        .status(404)
        .send('No se pudo guardar editar la tarea al Proyecto');
    }

    // Si la actualización se realiza con éxito, redirige al usuario a la página de administración de proyectos
    res.redirect('/project-manager/project?id=' + task.pid);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send('Ocurrio un error al editar la tarea al Proyecto');
  }
});
//----------------------------------### EDITAR TAREA PARA PROYECTO  ###----------------------------------//
//----------------------------------### ELIMINAR TAREA DE PROYECTO ###----------------------------------//
router.get('/delete-task-from-project', async (req, res) => {
  try {
    const task = req.query; // Los DATOS PARA ELIMINAR
    console.log('Se ha ejecutado el delete', task);

    const nuevoRegistro = await pj_manager.projects.eliminarTarea(task.rwid);

    if (!nuevoRegistro) {
      return res.status(404).send('No se pudo eliminar la tarea del Proyecto');
    }

    // Si la actualización se realiza con éxito, redirige al usuario a la página de administración de proyectos
    res.redirect('/project-manager/project?id=' + task.pid);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send('Ocurrio un error al eliminar la tarea del Projecto');
  }
});
//----------------------------------### ELIMINAR TAREA DE PROYECTO  ###----------------------------------//

//----------------------------------### AGREGAR ACTIVO A PROYECTO FORMULARIO ###----------------------------------//
router.get('/asset-to-proj-form', async (req, res) => {
  try {
    // Realiza la consulta a la base de datos de forma asincrónica
    const proyecto = await pj_manager.projects.obtenerRegistroPorId(
      req.query.id
    );
    const miembrosdeproyecto =
      await pj_manager.projects.obtenerMiembrosProyecto(req.query.id);
    const Tags = await pj_manager.projects.obtenerTags();

    // Renderiza la vista EJS y pasa los datos a la vista
    body = '../views/partials/project_manager/add-asset.html';
    title = 'Agregar Activo a Projecto';
    data = { project: proyecto, tags: Tags, members: miembrosdeproyecto };
    res.render(
      'project-manager_2',
      { data: data, title: title, body: body, session: req.session },
      (err, html) => {
        if (err) {
          // Manejo de errores al renderizar la vista
          console.error('Error al renderizar la vista:', err);
          res.status(500).send('Error interno del servidor', err);
        } else {
          // Envía la vista renderizada como respuesta
          console.log(data);
          res.send(html);
        }
      }
    );
  } catch (error) {
    // Manejo de errores
    console.error('Error al obtener registros:', error);
    res.status(500).send('Error interno del servidor', error);
  }
});
//----------------------------------### AGREGAR ACTIVO A PROYECTO FORMULARIO ###----------------------------------//
//----------------------------------### EDITAR ACTIVO  PROYECTO FORMULARIO ###----------------------------------//
router.get('/asset-edit-proj-form', async (req, res) => {
  try {
    // Realiza la consulta a la base de datos de forma asincrónica
    const activo = await pj_manager.projects.obtenerActivosPorId(req.query.id);
    const proyecto = await pj_manager.projects.obtenerRegistroPorId(
      req.query.pid
    );
    const miembrosdeproyecto =
      await pj_manager.projects.obtenerMiembrosProyecto(req.query.pid);
    const Tags = await pj_manager.projects.obtenerTags();

    // Renderiza la vista EJS y pasa los datos a la vista
    body = '../views/partials/project_manager/edit-asset.html';
    title = 'Editar Activo de Projecto';
    data = {
      project: proyecto,
      tags: Tags,
      asset: activo,
      members: miembrosdeproyecto,
    };
    res.render(
      'project-manager_2',
      { data: data, title: title, body: body, session: req.session },
      (err, html) => {
        if (err) {
          // Manejo de errores al renderizar la vista
          console.error('Error al renderizar la vista:', err);
          res.status(500).send('Error interno del servidor', err);
        } else {
          // Envía la vista renderizada como respuesta
          console.log(data);
          res.send(html);
        }
      }
    );
  } catch (error) {
    // Manejo de errores
    console.error('Error al obtener registros:', error);
    res.status(500).send('Error interno del servidor', error);
  }
});
//----------------------------------### EDITAR ACTIVO PROYECTO FORMULARIO ###----------------------------------//
//----------------------------------### CREAR NUEVO ACTIVO PARA PROYECTO ###----------------------------------//
router.post('/add-asset-to-project', async (req, res) => {
  try {
    const asset = req.body; // Los nuevos datos para actualizar
    console.log('Se ha ejecutado el create', asset);

    const nuevoRegistro = await pj_manager.projects.crearActivo(asset);

    if (!nuevoRegistro) {
      return res
        .status(404)
        .send('No se pudo guardar agregar el activo al Proyecto');
    }

    // Si la actualización se realiza con éxito, redirige al usuario a la página de administración de proyectos
    res.redirect('/project-manager/project?id=' + asset.pid);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send('Ocurrio un error al guardar agregar El activo en el Proyecto');
  }
});
//----------------------------------### CREAR NUEVO ACTIVO PARA PROYECTO  ###----------------------------------//
//----------------------------------### EDITAR ACTIVO PARA PROYECTO ###----------------------------------//
router.post('/edit-asset-to-project', async (req, res) => {
  try {
    const assetid = req.body.assetrwid; // Los nuevos datos para actualizar
    const asset = req.body; // Los nuevos datos para actualizar
    console.log('Se ha ejecutado el edit', asset);

    const nuevoRegistro = await pj_manager.projects.editarActivo(
      assetid,
      asset
    );

    if (!nuevoRegistro) {
      return res.status(404).send('No se pudo editar el activo al Proyecto');
    }

    // Si la actualización se realiza con éxito, redirige al usuario a la página de administración de proyectos
    res.redirect('/project-manager/project?id=' + asset.pid);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send('Ocurrio un error al editar el activo en el Proyecto');
  }
});
//----------------------------------### EDITAR ACTIVO PARA PROYECTO  ###----------------------------------//
//----------------------------------### ELIMINAR ACTIVO DE PROYECTO ###----------------------------------//
router.get('/delete-asset-from-project', async (req, res) => {
  try {
    const asset = req.query; // Los DATOS PARA ELIMINAR
    console.log('Se ha ejecutado el delete', asset);

    const nuevoRegistro = await pj_manager.projects.eliminarActivo(asset.rwid);

    if (!nuevoRegistro) {
      return res.status(404).send('No se pudo eliminar El activo del Proyecto');
    }

    // Si la actualización se realiza con éxito, redirige al usuario a la página de administración de proyectos
    res.redirect('/project-manager/project?id=' + asset.pid);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send('Ocurrio un error al eliminar El activo del Projecto');
  }
});
//----------------------------------### ELIMINAR NUEVO ACTIVO DE PROYECTO  ###----------------------------------//

//----------------------------------### AGREGAR MODULO A PROYECTO FORMULARIO ###----------------------------------//
router.get('/module-to-proj-form', async (req, res) => {
  try {
    // Realiza la consulta a la base de datos de forma asincrónica
    const proyecto = await pj_manager.projects.obtenerRegistroPorId(
      req.query.id
    );
    const generos = await pj_manager.projects.obtenerGeneros();

    // Renderiza la vista EJS y pasa los datos a la vista
    body = '../views/partials/project_manager/add-module.html';
    title = 'Agregar Modulo a Projecto';
    data = { project: proyecto, genres: generos };
    res.render(
      'project-manager_2',
      { data: data, title: title, body: body, session: req.session },
      (err, html) => {
        if (err) {
          // Manejo de errores al renderizar la vista
          console.error('Error al renderizar la vista:', err);
          res.status(500).send('Error interno del servidor', err);
        } else {
          // Envía la vista renderizada como respuesta
          console.log(data);
          res.send(html);
        }
      }
    );
  } catch (error) {
    // Manejo de errores
    console.error('Error al obtener registros:', error);
    res.status(500).send('Error interno del servidor', error);
  }
});
//----------------------------------### AGREGAR MODULO A PROYECTO FORMULARIO ###----------------------------------//
//----------------------------------### EDITAR MODULO  PROYECTO FORMULARIO ###----------------------------------//
router.get('/module-edit-proj-form', async (req, res) => {
  try {
    // Realiza la consulta a la base de datos de forma asincrónica
    const modulo = await pj_manager.projects.obtenerModulosPorId(req.query.id);
    const proyecto = await pj_manager.projects.obtenerRegistroPorId(
      req.query.pid
    );
    const generos = await pj_manager.projects.obtenerGeneros();

    // Renderiza la vista EJS y pasa los datos a la vista
    body = '../views/partials/project_manager/edit-module.html';
    title = 'Editar Activo de Projecto';
    data = { project: proyecto, module: modulo, genres: generos };
    res.render(
      'project-manager',
      { data: data, title: title, body: body, session: req.session },
      (err, html) => {
        if (err) {
          // Manejo de errores al renderizar la vista
          console.error('Error al renderizar la vista:', err);
          res.status(500).send('Error interno del servidor', err);
        } else {
          // Envía la vista renderizada como respuesta
          console.log(data);
          res.send(html);
        }
      }
    );
  } catch (error) {
    // Manejo de errores
    console.error('Error al obtener registros:', error);
    res.status(500).send('Error interno del servidor', error);
  }
});
//----------------------------------### EDITAR MODULO PROYECTO FORMULARIO ###----------------------------------//
//----------------------------------### CREAR NUEVO MODULO PARA PROYECTO ###----------------------------------//
router.post('/add-module-to-project', async (req, res) => {
  try {
    const pmodule = req.body; // Los nuevos datos para actualizar
    console.log('Se ha ejecutado el create', pmodule);

    const nuevoRegistro = await pj_manager.projects.crearModulo(pmodule);

    if (!nuevoRegistro) {
      return res
        .status(404)
        .send('No se pudo guardar agregar el Modulo al Proyecto');
    }

    // Si la actualización se realiza con éxito, redirige al usuario a la página de administración de proyectos
    res.redirect('/project-manager/');
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send('Ocurrio un error al guardar agregar El Modulo en el Proyecto');
  }
});
//----------------------------------### CREAR NUEVO MODULO PARA PROYECTO  ###----------------------------------//
//----------------------------------### EDITAR MODULO PARA PROYECTO ###----------------------------------//
router.post('/edit-module-to-project', async (req, res) => {
  try {
    const moduleid = req.body.id; // Los nuevos datos para actualizar
    const pmodule = req.body; // Los nuevos datos para actualizar
    console.log('Se ha ejecutado el edit', pmodule);

    const nuevoRegistro = await pj_manager.projects.editarModulo(
      moduleid,
      pmodule
    );

    if (!nuevoRegistro) {
      return res.status(404).send('No se pudo editar el modulo al Proyecto');
    }

    // Si la actualización se realiza con éxito, redirige al usuario a la página de administración de proyectos
    res.redirect('/project-manager');
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send('Ocurrio un error al editar el modulo en el Proyecto');
  }
});
//----------------------------------### EDITAR MODULO PARA PROYECTO  ###----------------------------------//
//----------------------------------### ELIMINAR MODULO DE PROYECTO ###----------------------------------//
router.get('/delete-module-from-project/', async (req, res) => {
  try {
    const pmodule = req.query; // Los DATOS PARA ELIMINAR
    console.log('Se ha ejecutado el delete', pmodule);

    const nuevoRegistro = await pj_manager.projects.eliminarModulo(
      pmodule.rwid
    );

    if (!nuevoRegistro) {
      return res.status(404).send('No se pudo eliminar El Modulo del Proyecto');
    }

    // Si la actualización se realiza con éxito, redirige al usuario a la página de administración de proyectos
    res.redirect('/project-manager');
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send('Ocurrio un error al eliminar El Modulo del Projecto');
  }
});
//----------------------------------### ELIMINAR NUEVO MODULO DE PROYECTO  ###----------------------------------//

//------------------------------------------------------------------------------ PROJECT MANAGER -ADICIONES A PROYECTOS ---------------------------------------------------------------------------------------------//

module.exports = router;
