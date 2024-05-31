const config = require('../../config/config.js');
let db_controller_path;
const serverConfig = config.configure.getConfigServer();

if (!serverConfig) {
  console.error('serverConfig no está definido');
  process.exit(1);
} else {
  if (serverConfig.sysMode === "master-local-sqlite") {
    db_controller_path = '../../config/db_sqlite.js';
    console.log('Modo: master-local-sqlite');
  } else if (serverConfig.sysMode === "online-Mysql") {
    db_controller_path = '../../config/db_mysql.js';
  }
}

const { sequelize, connectdb, disconnectdb } = require(db_controller_path);
const { Log, Users, Sys_role, Files, FileTypes, FileCategory, Accounts, Dashboards, Projects, Tasks, Assets, Tags, Objectives, TaskTags, Categories, Analysis, Arragements, Designs, Documentations, Promotions, Recordings, Macro_Projects, ProjectsRole, Projects_Modules, ProjectAccounts, Genres, userView } = require('../../src/entity/data-entity.js'); // Asegúrate de ajustar la ruta

const syncModels = async () => {
  try {
    await connectdb();
    await sequelize.sync({ force: true }); // Esto eliminará y recreará todas las tablas, úsalas con cuidado en producción
    console.log('Todas las tablas fueron creadas.');

    // Insertar datos iniciales
      await Users.create({
        username: 'sad4k',
        profilePic: '',
        userBgPic: '',
        name: 'Samuel',
        lastname: 'Duran',
        state: 1,
        sys_role_id: 1,
        def_dashboard_id: 1,
        email: 'john.doe@example.com',
        password: '12345',
        createdAt: new Date(),
      });
      await Dashboards.create({
        name: 'app-selector',
        path: './views/app-selector',
      });
      
      await userView();

  

  } catch (error) {
    console.error('Error al sincronizar las tablas:', error);
  } finally {
    await disconnectdb();
  }
};

module.exports = {
    syncModels,
  };
  
