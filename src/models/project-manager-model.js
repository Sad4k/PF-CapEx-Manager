const config = require('../../config/config.js');
let db_controller_path;
const serverConfig = config.configure.getConfigServer();

if (!serverConfig) {
  console.error('serverConfig no está definido');
} else {
  if (serverConfig.sysMode === "master-local-sqlite") {
    db_controller_path = '../../config/db_sqlite.js'; // Asegúrate de que la ruta sea correcta
    
    console.log('Modo: master-local-sqlite');
  } else if (serverConfig.sysMode === "online-Mysql") {
    db_controller_path = '../../config/db_mysql.js'; // Asegúrate de que la ruta sea correcta

  }
}
const { sequelize, connectdb, disconnectdb } = require(db_controller_path);

//const { sequelize, connectdb, disconnectdb } = require('../../config/db_sqlite.js'); // Asegúrate de que la ruta sea correcta
const { Op } = require('sequelize');
const entities = require('../entity/data-entity.js'); // Importa el modelo de usuario
// Importa la biblioteca 'util' para poder convertir una función de callback en una promesa
const util = require('util');
// Convierte la función de callback en una promesa
const queryAsync = util.promisify(sequelize.query).bind(sequelize);


/*################################################################################################           SISTEM #########################################################*/
const system = {
  //Funcion para listar los roles del sistema
  listarroles: async function () {
    try {
      const roles = await entities.Sys_role.findAll();
      return roles;
    } catch (error) {
      console.error('error al obtener los roles', error);
      throw error;
    }
  },
  //Funcion para listar las categorias del sistema
  listarcategorias: async function () {
    try {
      const categorias = await entities.Categories.findAll();
      return categorias;
    } catch (error) {
      console.error('error al obtener las categorias', error);
      throw error;
    }
  },
  //Funcion para listar los roles del proyecto
  listarrolesproyecto: async function () {
    try {
      const rolesproyecto = await entities.ProjectsRole.findAll();
      return rolesproyecto;
    } catch (error) {
      console.error('error al obtener los roles', error);
      throw error;
    }
  },
  //Funcion para obtener el dasboard sistema
  obtenerdashboard: async function (id) {
    try {
      const dashboard = await entities.Dashboards.findByPk(id);
      console.log(dashboard);
      return dashboard;
    } catch (error) {
      console.error('error al obtener el dashboard', error);
      throw error;
    }
  },
  //Funcion para listar los roles del sistema  ======[[[[{{{{ojo}}}}]]]]========
  listardashboards: async function () {
    try {
      const roles = await entities.Dashboards.findAll();
      return roles;
    } catch (error) {
      console.error('error al obtener los roles', error);
      throw error;
    }
  },
  //Funcion para evaluar el usuario
  valusuario: async function (username, password) {
    try {
      const query =
        'SELECT id, username FROM Users WHERE username = ? AND password = ?';
      sequelize.query(query, [username, password], (error, resultados) => {
        if (resultados.length === 1) {
          const usuarioValidado = resultados[0];
          return usuarioValidado;
          console.log('Usuario válido:', usuarioValidado.nombre);
        } else {
          console.log('Usuario no válido.');
        }
      });
    } catch (error) {
      console.error('error al obtener los roles', error);
      throw error;
    }
  },
};
/*################################################################################################           SISTEM #########################################################*/
/*################################################################################################           USERS  #########################################################*/

//biblioteca de funciones para manipular usuarios
const users = {
  //Funcion personalizada para obtener usuario desde vista
  obtenerusuario: async function (id) {
    try {
      const query =
        'SELECT * FROM  Users_sysview1 WHERE id = ' + id + '';
      const result = await sequelize.query(query, {
        type: sequelize.QueryTypes.SELECT,
      });
      if (result && result.length > 0) {
        return result[0];
      }

      return 'No hay usuarios para mostrar';
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      throw error;
    }
  },
  // Función para actualizar un usuario por ID
  actualizardatosusuario: async function (id, datosActualizados) {
    try {
      console.log(datosActualizados.dashboard_def);
      const [updatedRowsCount] = await entities.Users.update(
        {
          username: datosActualizados.username,
          name: datosActualizados.name,
          lastname: datosActualizados.lastname,
          def_dashboard_id: datosActualizados.dashboard_def,
          email: datosActualizados.email,
        },
        {
          where: { id: id },
        }
      );

      return updatedRowsCount > 0;
    } catch (error) {
      console.error('Error al actualizar el usuario por ID:', error);
      throw error;
    }
  },
  //buscar usuarios
  buscarUsuariosPorTerminos: async function (termino) {
    try {
      const query = `
      SELECT * FROM  Users_sysview1
      WHERE 
        id = :termino
        OR username LIKE :termino
        OR name LIKE :termino
        OR lastname LIKE :termino
    `;

      const usuariosEncontrados = await sequelize.query(query, {
        type: sequelize.QueryTypes.SELECT,
        replacements: { termino: `%${termino}%` }, // Usamos % para buscar coincidencias parciales
      });

      if (!usuariosEncontrados || usuariosEncontrados.length === 0) {
        return 'No se encontraron usuarios para el término proporcionado.';
        console.log('no encontro');
      }
      return usuariosEncontrados;
    } catch (error) {
      console.error('Error al buscar usuarios por término:', error);
      throw error;
    }
  },
  // Función para eliminar un registro por ID
  eliminarUsuario: async function (id) {
    try {
      const deletedRowCount = await entities.Users.destroy({
        where: { id: id },
      });

      return deletedRowCount > 0;
    } catch (error) {
      console.error('Error al eliminar el usuario por ID:', error);
      throw error;
    }
  },
  // Función para actualizar un usuario por ID
  actualizarpassusuario: async function (id, datosActualizados) {
    try {
      console.log(datosActualizados.newPassword);
      const [updatedRowsCount] = await entities.Users.update(
        {
          password: datosActualizados.newPassword,
        },
        {
          where: { id: id },
        }
      );

      return updatedRowsCount > 0;
    } catch (error) {
      console.error('Error al actualizar el usuario por ID:', error);
      throw error;
    }
  },
  // Función para actualizar un usuario por ID
  actualizarrolusuario: async function (id, datosActualizados) {
    try {
      console.log(datosActualizados.newPassword);
      const [updatedRowsCount] = await entities.Users.update(
        {
          sys_role_id: datosActualizados.newrole,
        },
        {
          where: { id: id },
        }
      );

      return updatedRowsCount > 0;
    } catch (error) {
      console.error('Error al actualizar el usuario por ID:', error);
      throw error;
    }
  },
  // Función para actualizar un usuario por ID
  actualizarestadosuario: async function (id, datosActualizados) {
    try {
      console.log(datosActualizados);
      const [updatedRowsCount] = await entities.Users.update(
        {
          state: datosActualizados,
        },
        {
          where: { id: id },
        }
      );

      return updatedRowsCount > 0;
    } catch (error) {
      console.error('Error al actualizar el usuario por ID:', error);
      throw error;
    }
  },
  // Función para crear un nuevo registro
  crearusuario: async function (nuevoRegistro) {
    try {
      //connectdb();
      console.log(nuevoRegistro);
      const usuarioCreado = await entities.Users.create({
        username: nuevoRegistro.username,
        name: nuevoRegistro.name,
        lastname: nuevoRegistro.lastname,
        email: nuevoRegistro.email,
        password: nuevoRegistro.password,
      });
      return usuarioCreado.id;
      //disconnectdb();
    } catch (error) {
      console.error('Error al crear el usuario:', error);
      throw error;
    }
  },

  // Función para obtener todos los registros
  obtenerRegistros: async function () {
    try {
      //connectdb();
      const usuarios = await entities.Users.findAll();
      console.log(usuarios);
      return usuarios;
      //disconnectdb();
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
      throw error;
    }
  },
  // Función para obtener solo el id y el campo username de todos los registros
  obtenerNombresId: async function () {
    try {
      const usuarios = await entities.Users.findAll({
        attributes: ['id', 'username'],
      });

      console.log(usuarios);
      return usuarios;
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
      throw error;
    }
  },

  // Función para obtener un registro por ID
  obtenerRegistroPorId: async function (id) {
    try {
      const usuario = await entities.Users.findByPk(id);
      return usuario;
    } catch (error) {
      console.error('Error al obtener el usuario por ID:', error);
      throw error;
    }
  },

  // Función para actualizar un registro por ID
  actualizarRegistroPorId: async function (id, datosActualizados) {
    try {
      const [updatedRowsCount] = await entities.Users.update(
        {
          username: datosActualizados.username,
          profilePic: datosActualizados.profilePic,
          userBgPic: datosActualizados.userBgPic,
          email: datosActualizados.email,
          password: datosActualizados.password,
          createdAt: datosActualizados.createdAt,
        },
        {
          where: { id: id },
        }
      );

      return updatedRowsCount > 0;
    } catch (error) {
      console.error('Error al actualizar el usuario por ID:', error);
      throw error;
    }
  },

  // Función para eliminar un registro por ID
  eliminarRegistroPorId: async function (id) {
    try {
      const deletedRowCount = await entities.Users.destroy({
        where: { id: id },
      });

      return deletedRowCount > 0;
    } catch (error) {
      console.error('Error al eliminar el usuario por ID:', error);
      throw error;
    }
  },
};
/*################################################################################################           USERS  #########################################################*/
/*################################################################################################           Macro Projects  #########################################################*/

//dfdfdfdfdfdfdfdfdfdfdfdfdfdf  ===== Macro Proyectos ===== dfdfdfddfdfdfdfdfdfdfdfdfdfdfdf//
const macroprojects = {
  // Función para crear un nuevo registro
  crear: async function (nuevoRegistro) {
    try {
      console.log("Creando El MP", nuevoRegistro);
      // Guarda el nuevo registro en la base de datos
      const macroproyectoCreado = await entities.Macro_Projects.create({
        name: nuevoRegistro.name,
        description: nuevoRegistro.description,
        macro_p_pic: nuevoRegistro.macro_p_pic,
        macro_p_bg: nuevoRegistro.macro_p_bg,
      });
      console.log("Creado El MP id:", macroproyectoCreado.id);
      return macroproyectoCreado.id;
    } catch (error) {
      console.error('Error al crear el Macro Proyecto:', error);
      throw error;
    }
  },
  //Funcion personalizada para obtener usuario desde vista
  obtenerRegistros: async function () {
    try {
      const query = 'SELECT `id`, `name`, `description` FROM MacroProjects_sysview1';
      const result = await sequelize.query(query, {
        type: sequelize.QueryTypes.SELECT,
      });
      const test = await entities.Macro_Projects.findAll();
      console.log("Prueba Projectos:" , test);

      return result;
    } catch (error) {
      console.error('Error al obtener MacroProyecto:', error);
      throw error;
    }
  },
  //Funcion personalizada para obtener usuario desde vista
  obtenerRegistroPorId: async function (id) {
    try {
      const macroproyecto = await entities.Macro_Projects.findByPk(id);
      return macroproyecto;
    } catch (error) {
      console.error('Error al obtener el macroproyecto por ID:', error);
      throw error;
    }
  },
  // Función para actualizar un registro por ID
  obtenerRegistrosPorIdSysview: async function (id) {
    try {
      const query =
        'SELECT * FROM MacroProjects_sysview2 WHERE Macro_project_id = ' +
        id +
        '';
      const result = await sequelize.query(query, {
        type: sequelize.QueryTypes.SELECT,
      });
      if (result && result.length > 0) {
        return result;
      }

      return null;
    } catch (error) {
      console.error('Error al obtener Miembros:', error);
      throw error;
    }
  },

  // Función para actualizar un registro por ID
  actualizarRegistroPorId: async function (id, nuevoRegistro) {
    try {
      const [updatedRowsCount] = await entities.Macro_Projects.update(
        {
          name: nuevoRegistro.name,
          description: nuevoRegistro.description,
          macro_p_pic: nuevoRegistro.macro_p_pic,
          macro_p_bg: nuevoRegistro.macro_p_bg,
        },
        {
          where: { id: id },
        }
      );

      return updatedRowsCount > 0;
    } catch (error) {
      console.error('Error al actualizar el usuario por ID:', error);
      throw error;
    }
  },
  // Función para eliminar un registro por ID
  eliminarRegistro: async function (id) {
    try {
      const deletedRowCount = await entities.Macro_Projects.destroy({
        where: { id: id },
      });

      return deletedRowCount > 0;
    } catch (error) {
      console.error('Error al eliminar el Macro Proyecto por ID:', error);
      throw error;
    }
  },

  // Función para actualizar un registro por ID
  obtenerObjetivosSysview1: async function (id) {
    try {
      const query =
        'SELECT * FROM  MacroProjects_objectives_sysview1';
      const result = await sequelize.query(query, {
        type: sequelize.QueryTypes.SELECT,
      });
      if (result && result.length > 0) {
        return result;
      }

      return 'No hay Objetivos para mostrar';
    } catch (error) {
      console.error('Error al obtener Objetivos:', error);
      throw error;
    }
  },
  //dfdfdfdfdfdfdfdfdfdfdfdfdfdf  ===== Macro Proyectos ===== dfdfdfddfdfdfdfdfdfdfdfdfdfdfdf//
};

/*################################################################################################           Macro projects  #########################################################*/
/*################################################################################################           proyects  #########################################################*/

const projects = {
  //Funcion personalizada para obtener usuario desde vista
  obtenerproyecto: async function (id) {
    try {
      const query =
        'SELECT * FROM  Projects_sysview1 WHERE id = ' + id + '';
      const result = await sequelize.query(query, {
        type: sequelize.QueryTypes.SELECT,
      });
      if (result && result.length > 0) {
        return result[0];
      }

      return 'No hay usuarios para mostrar';
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      throw error;
    }
  },
  //funcion para obtener los roles de proyectos
  obtenerroles: async function () {
    try {
      const roles = await entities.ProjectsRole.findAll();

      return roles;
    } catch (error) {
      console.error('Error al obtener los roles', error);
      throw error;
    }
  },
  //funcion para obtener los tags de tareas de proyectos
  obtenerTags: async function () {
    try {
      const Tags = await entities.Tags.findAll();

      return Tags;
    } catch (error) {
      console.error('Error al obtener los Tags', error);
      throw error;
    }
  },
  //funcion para obtener los generos para modulos
  obtenerGeneros: async function () {
    try {
      const Genres = await entities.Genres.findAll();

      return Genres;
    } catch (error) {
      console.error('Error al obtener los Generos', error);
      throw error;
    }
  },
  //Funcion personalizada para obtener miembros de proyecto
  obtenerMiembrosProyecto: async function (id) {
    try {
      const query =
        'SELECT * FROM Project_members WHERE project_id = ' + id + '';
      const result = await sequelize.query(query, {
        type: sequelize.QueryTypes.SELECT,
      });
      if (result && result.length > 0) {
        return result;
      }

      return 'No hay Miembros para mostrar';
    } catch (error) {
      console.error('Error al obtener Miembros:', error);
      throw error;
    }
  },
  //Funcion personalizada para obtener miembros de proyecto
  obtenerTareasProyecto: async function (id) {
    try {
      const query =
        'SELECT * FROM Projects_tasks WHERE project_id = ' + id + '';
      const result = await sequelize.query(query, {
        type: sequelize.QueryTypes.SELECT,
      });
      if (result && result.length > 0) {
        return result;
      }

      return 'No hay Tareas para mostrar';
    } catch (error) {
      console.error('Error al obtener las tareas:', error);
      throw error;
    }
  },
  //Funcion personalizada para obtener miembros de proyecto
  obtenerTareasPorId: async function (id) {
    try {
      const query = 'SELECT * FROM Projects_tasks WHERE id = ' + id + '';
      const result = await sequelize.query(query, {
        type: sequelize.QueryTypes.SELECT,
      });
      if (result && result.length > 0) {
        return result[0];
      }

      return 'No hay Tareas para mostrar';
    } catch (error) {
      console.error('Error al obtener las tareas:', error);
      throw error;
    }
  },

  //Funcion personalizada para obtener Cuentas del proyecto
  obtenerCuentasProyecto: async function (id) {
    try {
      // Realiza una consulta a la base de datos para obtener la categoría según la extensión
      const query =
        'SELECT * FROM Projects_accounts WHERE project_id = ' + id + '';
      const result = await sequelize.query(query, {
        type: sequelize.QueryTypes.SELECT,
      });
      // Si se encontró una categoría correspondiente, devuélvela
      if (result && result.length > 0) {
        return result;
      }

      // Si no se encontró ninguna categoría, devuelve un valor por defecto o maneja el caso según tus necesidades
      return 'No hay cuentas para mostrar';
    } catch (error) {
      console.error('Error al obtener Miembros:', error);
      throw error;
    }
  },

  //Funcion personalizada para obtener Activos del proyecto
  obtenerActivosProyecto: async function (id) {
    try {
      // Realiza una consulta a la base de datos para obtener la categoría según la extensión
      const query =
        'SELECT * FROM  Projects_assets WHERE project_id = ' +
        id +
        '';
      const result = await sequelize.query(query, {
        type: sequelize.QueryTypes.SELECT,
      });
      // Si se encontró una categoría correspondiente, devuélvela
      if (result && result.length > 0) {
        return result;
      }

      // Si no se encontró ninguna categoría, devuelve un valor por defecto o maneja el caso según tus necesidades
      return 'No hay activos para mostrar';
    } catch (error) {
      console.error('Error al obtener los activos:', error);
      throw error;
    }
  },

  //Funcion personalizada para obtener Activos del proyecto
  obtenerActivosPorId: async function (id) {
    try {
      // Realiza una consulta a la base de datos para obtener la categoría según la extensión
      const query =
        'SELECT * FROM  Projects_assets WHERE id = ' + id + '';
      const result = await sequelize.query(query, {
        type: sequelize.QueryTypes.SELECT,
      });
      // Si se encontró una categoría correspondiente, devuélvela
      if (result && result.length > 0) {
        return result[0];
      }

      // Si no se encontró ninguna categoría, devuelve un valor por defecto o maneja el caso según tus necesidades
      return 'No hay activos para mostrar';
    } catch (error) {
      console.error('Error al obtener los activos:', error);
      throw error;
    }
  },
  //Funcion para obtener modulos de un proyecto
  obtenerModulosProyecto: async function (id) {
    try {
      // Realiza una consulta a la base de datos para obtener la categoría según la extensión
      const query =
        'SELECT * FROM  Project_Modules WHERE project_id = ' +
        id +
        '';
      const result = await sequelize.query(query, {
        type: sequelize.QueryTypes.SELECT,
      });
      // Si se encontró una categoría correspondiente, devuélvela
      if (result && result.length > 0) {
        return result;
      }

      // Si no se encontró ninguna categoría, devuelve un valor por defecto o maneja el caso según tus necesidades
      return null;
    } catch (error) {
      console.error('Error al obtener los modulos:', error);
      throw error;
    }
  },
  //Funcion para obtener modulos por id
  obtenerModulosPorId: async function (id) {
    try {
      // Realiza una consulta a la base de datos para obtener la categoría según la extensión
      const query =
        'SELECT * FROM  Project_Modules WHERE id = ' + id + '';
      const result = await sequelize.query(query, {
        type: sequelize.QueryTypes.SELECT,
      });
      // Si se encontró una categoría correspondiente, devuélvela
      if (result && result.length > 0) {
        return result[0];
      }

      // Si no se encontró ninguna categoría, devuelve un valor por defecto o maneja el caso según tus necesidades
      return 'No hay Modulos para mostrar';
    } catch (error) {
      console.error('Error al obtener los activos:', error);
      throw error;
    }
  },

  //Funcion para obtener modulos por id
  obtenerModulos: async function () {
    try {
      // Realiza una consulta a la base de datos para obtener la categoría según la extensión
      const query = 'SELECT * FROM  Project_Modules';
      const result = await sequelize.query(query, {
        type: sequelize.QueryTypes.SELECT,
      });
      // Si se encontró una categoría correspondiente, devuélvela

      return result;

      // Si no se encontró ninguna categoría, devuelve un valor por defecto o maneja el caso según tus necesidades
      return 'No hay Modulos para mostrar';
    } catch (error) {
      console.error('Error al obtener los modulos:', error);
      throw error;
    }
  },
  // Función para actualizar un usuario por ID
  actualizardatosproyecto: async function (id, datosActualizados) {
    try {
      console.log(datosActualizados);

      // Combina la fecha y la hora
      const startDateTime = `${datosActualizados.start_date} ${datosActualizados.start_time}:00`;
      const endDateTime = `${datosActualizados.end_date} ${datosActualizados.end_time}:00`;

      const [updatedRowsCount] = await entities.Projects.update(
        {
          name: datosActualizados.name,
          category: datosActualizados.category,
          description: datosActualizados.description,
          start_date: startDateTime,
          end_date: endDateTime,
          project_pic: datosActualizados.project_pic,
          type: datosActualizados.undefined_time,
        },
        {
          where: { id: id },
        }
      );

      return updatedRowsCount > 0;
    } catch (error) {
      console.error('Error al actualizar el usuario por ID:', error);
      throw error;
    }
  },
  //buscar usuarios
  buscarProyectoPorTerminos: async function (termino) {
    try {
      const query = `
      SELECT * FROM  Users_sysview1
      WHERE 
        id = :termino
        OR username LIKE :termino
        OR name LIKE :termino
        OR lastname LIKE :termino
    `;

      const usuariosEncontrados = await sequelize.query(query, {
        type: sequelize.QueryTypes.SELECT,
        replacements: { termino: `%${termino}%` }, // Usamos % para buscar coincidencias parciales
      });

      if (!usuariosEncontrados || usuariosEncontrados.length === 0) {
        return 'No se encontraron usuarios para el término proporcionado.';
        console.log('no encontro');
      }
      return usuariosEncontrados;
    } catch (error) {
      console.error('Error al buscar usuarios por término:', error);
      throw error;
    }
  },
  // Función para eliminar un registro por ID
  eliminarProyecto: async function (id) {
    try {
      const deletedRowCount = await entities.Projects.destroy({
        where: { id: id },
      });

      return deletedRowCount > 0;
    } catch (error) {
      console.error('Error al eliminar el Proyecto por ID:', error);
      throw error;
    }
  },
  // Función para actualizar un usuario por ID
  actualizarpassproyecto: async function (id, datosActualizados) {
    try {
      console.log(datosActualizados.newPassword);
      const [updatedRowsCount] = await entities.Users.update(
        {
          password: datosActualizados.newPassword,
        },
        {
          where: { id: id },
        }
      );

      return updatedRowsCount > 0;
    } catch (error) {
      console.error('Error al actualizar el usuario por ID:', error);
      throw error;
    }
  },
  // Función para actualizar un rol por ID
  actualizarRolPorId: async function (id, datosActualizados) {
    try {
      console.log(datosActualizados.idUsuario);
      const query = `UPDATE ProjectMembers SET projects_role = ${datosActualizados.idRol} WHERE id = ${id}`;

      // Ejecutar la consulta
      const [result, metadata] = await sequelize.query(query);

      // Loguear el resultado y la metadata
      console.log('Resultado de la consulta:', result);
      return result;
    } catch (error) {
      console.error('Error al actualizar el usuario por ID:', error);
      throw error;
    }
  },
  // Función para crear un miembro con un rol
  crearMiembro: async function (nuevoRegistro) {
    try {
      console.log(nuevoRegistro);
      const query = `INSERT INTO ProjectMembers (project_id, user_id, projects_role) VALUES (${nuevoRegistro.pid}, ${nuevoRegistro.uid}, ${nuevoRegistro.projectrole});`;

      // Ejecutar la consulta
      const [result, metadata] = await sequelize.query(query);

      // Loguear el resultado y la metadata
      console.log('Resultado de la consulta:', result);
      return result;
    } catch (error) {
      console.error('Error al agregar el miembro:', error);
      throw error;
    }
  },
  // Función para eliminar un miembro con un rol
  eliminarMiembro: async function (id) {
    try {
      console.log(id);
      const query = `DELETE FROM ProjectMembers WHERE id = (SELECT id FROM ProjectMembers WHERE id = ${id} LIMIT 1);`;

      // Ejecutar la consulta
      const [result, metadata] = await sequelize.query(query);

      // Loguear el resultado y la metadata
      console.log('Resultado de la consulta:', result);
      return result;
    } catch (error) {
      console.error('Error al eliminar el miembro:', error);
      throw error;
    }
  },

  // Función para crear Tarea con su tag
  crearTarea: async function (nuevoRegistro) {
    try {
      console.log(nuevoRegistro);
      const nuevaTarea = await entities.Tasks.create({
        name: nuevoRegistro.taskname,
        description: nuevoRegistro.taskdescription,
        start_date: nuevoRegistro.start_date,
        due_date: nuevoRegistro.due_date,
        project_id: nuevoRegistro.pid,
        assignee_id: nuevoRegistro.assigned,
      });

      const tasktag = await entities.TaskTags.create({
        tag_id: nuevoRegistro.tag,
        task_id: nuevaTarea.id,
      });

      // Loguear el resultado y la metadata
      console.log('Resultado de la consulta:', nuevaTarea);
      return nuevaTarea;
    } catch (error) {
      console.error('Error al agregar la tarea:', error);
      throw error;
    }
  },
  editarTarea: async function (idTarea, nuevosDatos) {
    try {
      // Buscar la tarea a editar
      const tarea = await entities.Tasks.findByPk(idTarea);

      if (!tarea) {
        throw new Error('Tarea no encontrada');
      }

      // Actualizar los datos de la tarea
      await tarea.update({
        name: nuevosDatos.taskname || tarea.name,
        description: nuevosDatos.taskdescription || tarea.description,
        start_date: nuevosDatos.start_date || tarea.start_date,
        due_date: nuevosDatos.due_date || tarea.due_date,
        project_id: nuevosDatos.pid || tarea.project_id,
        assignee_id: nuevosDatos.assigned || tarea.assignee_id,
      });

      // Actualizar el tag de la tarea si se proporciona un nuevo tag
      if (nuevosDatos.tag) {
        const taskTag = await entities.TaskTags.findOne({
          where: {
            task_id: tarea.id,
          },
        });

        if (taskTag) {
          await taskTag.update({
            tag_id: nuevosDatos.tag,
          });
        } else {
          await entities.TaskTags.create({
            tag_id: nuevosDatos.tag,
            task_id: tarea.id,
          });
        }
      }

      // Loguear el resultado y la metadata
      console.log('Tarea actualizada:', tarea);
      return tarea;
    } catch (error) {
      console.error('Error al editar la tarea:', error);
      throw error;
    }
  },

  // Función para eliminar una tarea
  eliminarTarea: async function (id) {
    try {
      console.log(id);
      const deletedRowCount = await entities.Tasks.destroy({
        where: { id: id },
      });

      const deleteTasktag = await entities.TaskTags.destroy({
        where: { task_id: id },
      });

      return deletedRowCount > 0;
    } catch (error) {
      console.error('Error al eliminar la tarea:', error);
      throw error;
    }
  },

  // Función crear un activo
  crearActivo: async function (nuevoRegistro) {
    try {
      console.log(nuevoRegistro);
      const nuevoActivo = await entities.Assets.create({
        name: nuevoRegistro.assetname,
        description: nuevoRegistro.assetdescription,
        value: nuevoRegistro.assetvalue,
        purchase_date: nuevoRegistro.purchase_date,
        asset_pic: nuevoRegistro.asset_pic,
        project_id: nuevoRegistro.pid,
        asset_id: nuevoRegistro.assetcodeid,
        brand: nuevoRegistro.brand,
        state: nuevoRegistro.assetstate,
      });

      // Loguear el resultado y la metadata
      console.log('Resultado de la consulta:', nuevoActivo);
      return nuevoActivo;
    } catch (error) {
      console.error('Error al agregar el Activo:', error);
      throw error;
    }
  },

  editarActivo: async function (idActivo, nuevosDatos) {
    try {
      // Buscar el activo a editar
      const activo = await entities.Assets.findByPk(idActivo);

      if (!activo) {
        throw new Error('Activo no encontrado');
      }

      // Actualizar los datos del activo
      await activo.update({
        name: nuevosDatos.assetname || activo.name,
        description: nuevosDatos.assetdescription || activo.description,
        value: nuevosDatos.assetvalue || activo.value,
        purchase_date: nuevosDatos.purchase_date || activo.purchase_date,
        asset_pic: nuevosDatos.asset_pic || activo.asset_pic,
        project_id: nuevosDatos.pid || activo.project_id,
        asset_id: nuevosDatos.assetcodeid || activo.asset_id,
        brand: nuevosDatos.brand || activo.brand,
        state: nuevosDatos.assetstate || activo.asset,
      });

      // Loguear el resultado y la metadata
      console.log('Activo actualizado:', activo);
      return activo;
    } catch (error) {
      console.error('Error al editar el activo:', error);
      throw error;
    }
  },

  // Función para eliminar un activo
  eliminarActivo: async function (id) {
    try {
      console.log(id);
      const deletedRowCount = await entities.Assets.destroy({
        where: { id: id },
      });

      return deletedRowCount > 0;
    } catch (error) {
      console.error('Error al eliminar el activo:', error);
      throw error;
    }
  },

  // Función crear un activo
  crearModulo: async function (nuevoRegistro) {
    try {
      console.log(nuevoRegistro);
      const nuevoModulo = await entities.Project_Modules.create({
        name: nuevoRegistro.modulename,
        project_id: nuevoRegistro.pid,
        description: nuevoRegistro.moduledescription,
        module_status: nuevoRegistro.status,
        title: nuevoRegistro.title,
        long_description: nuevoRegistro.long_description,
        short_description: nuevoRegistro.short_description,
        genre: nuevoRegistro.modulegenre,
        performer: nuevoRegistro.performer,
        author: nuevoRegistro.author,
        launch_date: nuevoRegistro.launch_date,
      });

      // Loguear el resultado y la metadata
      console.log('Resultado de la consulta:', nuevoModulo);
      return nuevoModulo;
    } catch (error) {
      console.error('Error al agregar el nuevo Modulo:', error);
      throw error;
    }
  },

  editarModulo: async function (idModulo, nuevoRegistro) {
    try {
      // Buscar el activo a editar
      const pModule = await entities.Project_Modules.findByPk(idModulo);

      if (!pModule) {
        throw new Error('Modulo no encontrado');
      }

      // Actualizar los datos del activo
      await pModule.update({
        name: nuevoRegistro.modulename || pModule.name,
        project_id: nuevoRegistro.pid || pModule.project_id,
        description: nuevoRegistro.moduledescription || pModule.description,
        title: nuevoRegistro.title || pModule.title,
        long_description:
          nuevoRegistro.long_description || pModule.long_description,
        short_description:
          nuevoRegistro.short_description || pModule.short_description,
        genre: nuevoRegistro.modulegenre || pModule.genre,
        performer: nuevoRegistro.performer || pModule.performer,
        author: nuevoRegistro.author || pModule.author,
        launch_date: nuevoRegistro.launch_date || pModule.launch_date,
      });

      // Loguear el resultado y la metadata
      console.log('Activo actualizado:', pModule);
      return pModule;
    } catch (error) {
      console.error('Error al editar el Modulo:', error);
      throw error;
    }
  },

  // Función para eliminar un activo################################################################## Observacion
  eliminarModulo: async function (id) {
    try {
      console.log(id);
      const deletedRowCount = await entities.Project_Modules.destroy({
        where: { id: id },
      });

      return deletedRowCount > 0;
    } catch (error) {
      console.error('Error al eliminar el Modulo:', error);
      throw error;
    }
  },

  // Función crear un Objetivo
  crearObjetivo: async function (nuevoRegistro) {
    try {
      console.log(nuevoRegistro);
      const nuevoObjetivo = await entities.Objectives.create({
        name: nuevoRegistro.name,
        project_id: nuevoRegistro.pid,
        description: nuevoRegistro.description,
        status: nuevoRegistro.status,
        target: nuevoRegistro.target,
        target_type: nuevoRegistro.target_type,
        assignee_id: nuevoRegistro.assignee_id,
      });

      // Loguear el resultado y la metadata
      console.log('Resultado de la consulta:', nuevoObjetivo);
      return nuevoObjetivo;
    } catch (error) {
      console.error('Error al agregar el nuevo Objetivo:', error);
      throw error;
    }
  },

  editarObjetivo: async function (idObjetivo, nuevoRegistro) {
    try {
      // Buscar el activo a editar
      const nowObjective = await entities.Objectives.findByPk(idObjetivo);

      if (!nowObjective) {
        throw new Error('Objetivo no encontrado');
      }

      // Actualizar los datos del activo
      await nowObjective.update({
        name: nuevoRegistro.name || nowObjective.name,
        project_id: nuevoRegistro.pid || nowObjective.project_id,
        description: nuevoRegistro.description || nowObjective.description,
        status: nuevoRegistro.status || nowObjective.module_status,
        target: nuevoRegistro.target || nowObjective.target,
        target_type: nuevoRegistro.target_type || nowObjective.target_type,
        assignee_id: nuevoRegistro.assignee_id || nowObjective.assignee_id,
      });

      // Loguear el resultado y la metadata
      console.log('Activo actualizado:', nowObjective);
      return nowObjective;
    } catch (error) {
      console.error('Error al editar el Objetivo:', error);
      throw error;
    }
  },
  // Función para eliminar un activo
  marcarObjetivo: async function (idObjetivo) {
    try {
      // Buscar el activo a editar
      const nowObjective = await entities.Objectives.findByPk(idObjetivo);

      if (!nowObjective) {
        throw new Error('Objetivo no encontrado');
      }

      // Actualizar los datos del activo
      await nowObjective.update({
        status: 'completed',
      });

      // Loguear el resultado y la metadata
      console.log('Activo actualizado:', nowObjective);
      return nowObjective;
    } catch (error) {
      console.error('Error al editar el Objetivo:', error);
      throw error;
    }
  },
  // Función para eliminar un activo################################################################## Observacion
  eliminarObjetivo: async function (id) {
    try {
      console.log(id);
      const deletedRowCount = await entities.Objectives.destroy({
        where: { id: id },
      });

      return deletedRowCount > 0;
    } catch (error) {
      console.error('Error al eliminar el Objetivo:', error);
      throw error;
    }
  },

  // Función para actualizar un usuario por ID
  actualizarestadosproyecto: async function (id, datosActualizados) {
    try {
      console.log(datosActualizados);
      const [updatedRowsCount] = await entities.Users.update(
        {
          state: datosActualizados,
        },
        {
          where: { id: id },
        }
      );

      return updatedRowsCount > 0;
    } catch (error) {
      console.error('Error al actualizar el usuario por ID:', error);
      throw error;
    }
  },
  // Función para crear un nuevo registro
  crearproyecto: async function (nuevoRegistro) {
    try {
      // Combina la fecha y la hora
      const startDateTime = `${nuevoRegistro.start_date} ${nuevoRegistro.start_time}:00`;
      const endDateTime = `${nuevoRegistro.end_date} ${nuevoRegistro.end_time}:00`;

      // Guarda el nuevo registro en la base de datos
      const proyectoCreado = await entities.Projects.create({
        name: nuevoRegistro.name,
        macro_project_id: nuevoRegistro.mpid,
        category: nuevoRegistro.category,
        description: nuevoRegistro.description,
        start_date: startDateTime,
        end_date: endDateTime,
        project_pic: nuevoRegistro.project_pic,
        project_bg_pic: nuevoRegistro.project_bg_pic,
        type: nuevoRegistro.type,
        created_by: nuevoRegistro.created_by,
      });

      return proyectoCreado.id;
    } catch (error) {
      console.error('Error al crear el Proyecto:', error);
      throw error;
    }
  },

  // Función para obtener todos los registros
  obtenerRegistros: async function () {
    try {
      //connectdb();
      const query = 'SELECT * FROM  Projects_sysview1';
      const proyectos = await sequelize.query(query, {
        type: sequelize.QueryTypes.SELECT,
      });
      return proyectos;
      //disconnectdb();
    } catch (error) {
      console.error('Error al obtener los proyectos:', error);
      throw error;
    }
  },

  // Función para obtener un registro por ID
  obtenerRegistroPorId: async function (id) {
    try {
      const project = await entities.Projects.findByPk(id);
      return project;
    } catch (error) {
      console.error('Error al obtener el proyecto por ID:', error);
      throw error;
    }
  },

  // Función para actualizar un registro por ID
  actualizarRegistroPorId: async function (id, datosActualizados) {
    try {
      const [updatedRowsCount] = await entities.Users.update(
        {
          username: datosActualizados.username,
          profilePic: datosActualizados.profilePic,
          userBgPic: datosActualizados.userBgPic,
          email: datosActualizados.email,
          password: datosActualizados.password,
          createdAt: datosActualizados.createdAt,
        },
        {
          where: { id: id },
        }
      );

      return updatedRowsCount > 0;
    } catch (error) {
      console.error('Error al actualizar el usuario por ID:', error);
      throw error;
    }
  },

  // Función para eliminar un registro por ID
  eliminarRegistroPorId: async function (id) {
    try {
      const deletedRowCount = await entities.Users.destroy({
        where: { id: id },
      });

      return deletedRowCount > 0;
    } catch (error) {
      console.error('Error al eliminar el usuario por ID:', error);
      throw error;
    }
  },
  // ############ FUNCIONES DE NUEVA CREACION DE PROYECTO ########################################//
  crearCuentasProyecto: async function (datosProyecto) {
    try {
      console.log(datosProyecto);
      idp_formato = datosProyecto.id.toString().padStart(6, '0');
      nombre_proyecto = datosProyecto.name;
      console.log(idp_formato);

      const cuentas = [
        {
          number: '01',
          name: 'Capital',
          type: '1',
          description: 'Cuenta Principal Del Proyecto',
        },
        {
          number: '02',
          name: 'Por Pagar',
          type: '3',
          description: 'Facturas pendientes de pago',
        },
        {
          number: '03',
          name: 'Por Cobrar',
          type: '4',
          description: 'Servicios prestados pendientes de cobro',
        },
        {
          number: '04',
          name: 'Imprevistos',
          type: '7',
          description: 'Cuenta de Reservas para Imprevistos',
        },
        {
          number: '05',
          name: 'Utilidades',
          type: '1',
          description: 'Cuenta de Utilidades',
        },
        {
          number: '06',
          name: 'Gastos',
          type: '1',
          description: 'Cuenta de Gastos del Proyecto',
        },
        {
          number: '07',
          name: 'Empleados',
          type: '2',
          description: 'Cuenta de Pagos a Empleados',
        },
        {
          number: '08',
          name: 'Inventario',
          type: '6',
          description: 'Cuenta de recuento de Inventario',
        },
      ];

      for (let i = 0; i < cuentas.length; i++) {
        const cuenta = cuentas[i];
        await entities.Accounts.create({
          account_number: `02${idp_formato}${cuenta.number}`,
          account_name: `${cuenta.name} ${nombre_proyecto}`,
          account_description: `${cuenta.description}`,
          account_type: cuenta.type,
        });
      }
      console.log('Cuentas creadas exitosamente');

      for (let i = 0; i < cuentas.length; i++) {
        const cuenta = cuentas[i];
        await entities.ProjectAccounts.create({
          project_id: datosProyecto.id,
          account: `02${idp_formato}${cuenta.number}`,
        });
      }
      console.log('Cuentas asociadas exitosamente');
    } catch (error) {
      console.error('Error al agregar al crear las cuentas:', error);
      throw error;
    }
  },
  // Función para eliminar un miembro con un rol
  eliminarCuentasProyecto: async function (datosProyecto) {
    try {
      // Obtener el ID del proyecto y formatearlo
      const idp_formato = datosProyecto.id.toString().padStart(6, '0');

      // Eliminar cuentas asociadas al proyecto
      await entities.ProjectAccounts.destroy({
        where: {
          project_id: datosProyecto.id,
        },
      });
      console.log('Cuentas asociadas al proyecto eliminadas exitosamente');

      // Eliminar cuentas del proyecto
      await entities.Accounts.destroy({
        where: {
          account_number: {
            [Op.between]: [`02${idp_formato}00`, `02${idp_formato}99`],
          },
        },
      });
      console.log('Cuentas del proyecto eliminadas exitosamente');
    } catch (error) {
      console.error('Error al eliminar las cuentas:', error);
      throw error;
    }
  },

  // ############ FUNCIONES DE NUEVA CREACION DE PROYECTO ########################################//
};
/*################################################################################################           Projects  #########################################################*/

// Exporta las funciones agrupadas en un objeto
module.exports = {
  users: users,
  system: system,
  projects: projects,
  macroprojects: macroprojects,
};
