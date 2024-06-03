const { DataTypes } = require('sequelize');
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
//const { sequelize, connectdb, disconnectdb } = require('../../config/db_mysql'); // Asegúrate de que la ruta sea correcta

const Log = sequelize.define('Log', {
  msg: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  level: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
});

const Sys_role = sequelize.define('Sys_roles', {
  role_logo: DataTypes.STRING(45),
  access_level: DataTypes.INTEGER,
  role_name: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
});
const Dashboards = sequelize.define('Dashboards', {
  name: DataTypes.STRING(45),
  path: DataTypes.STRING(45),
  screenshot: DataTypes.STRING(255),
});

const Accounts = sequelize.define('Accounts', {
  account_number: DataTypes.STRING(45),
  account_name: DataTypes.STRING(45),
  account_description: DataTypes.STRING(255),
  account_type: DataTypes.INTEGER,
});
const ProjectAccounts = sequelize.define('ProjectAccounts', {
  project_id: DataTypes.INTEGER,
  account: DataTypes.STRING(45),
});

const Users = sequelize.define('Users', {
  username: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  profilePic: DataTypes.STRING(45),
  userBgPic: DataTypes.STRING(45),
  name: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  lastname: DataTypes.STRING(45),
  state: DataTypes.BOOLEAN,
  sys_role_id: DataTypes.INTEGER,
  def_dashboard_id: DataTypes.INTEGER,
  email: {
    type: DataTypes.STRING(45),
    allownull: false,
  },
  password: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
});

const Files = sequelize.define('Files', {
  path: DataTypes.STRING(45),
  fileName: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
});

const Projects_modules = sequelize.define('Projects_modules', {
  path: DataTypes.STRING(45),
  fileName: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
});

const FileTypes = sequelize.define('FileTypes', {
  extension: DataTypes.STRING(45),
  extensionName: DataTypes.STRING(45),
  category: DataTypes.INTEGER,
  // Define otros campos para FileTypes
});

const FileCategory = sequelize.define('FileCategory', {
  categoryPic: DataTypes.BLOB,
  categoryName: DataTypes.STRING(45),
  // Define otros campos para FileCategory
});

const Projects = sequelize.define('Projects', {
  name: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  macro_project_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  project_pic: DataTypes.TEXT,
  project_bg_pic: DataTypes.TEXT,
  category: DataTypes.STRING(45),
  description: DataTypes.TEXT,
  start_date: DataTypes.DATE,
  end_date: DataTypes.DATE,
  undefined_time: DataTypes.BOOLEAN,
  created_by: DataTypes.INTEGER,
});
const Macro_Projects = sequelize.define('Macro_Projects', {
  name: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  description: DataTypes.STRING(255),
  macro_p_pic: DataTypes.STRING(125),
  macro_p_bg: DataTypes.STRING(125),
  // Define otros campos para Projects
});
const Projects_Modules = sequelize.define('Project_Modules', {
  name: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  project_id: DataTypes.INTEGER,
  description: DataTypes.STRING(255),
  module_pic: DataTypes.STRING(125),
  module_status: DataTypes.STRING(125),
  title: DataTypes.STRING(125),
  long_description: DataTypes.STRING(125),
  short_description: DataTypes.STRING(125),
  genre: DataTypes.STRING(125),
  performer: DataTypes.STRING(125),
  author: DataTypes.STRING(125),
  creation_date: DataTypes.DATE,
  launch_date: DataTypes.DATE,
});
const Analysis = sequelize.define('Analysis', {
  name: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  pid: DataTypes.INTEGER,
  mid: DataTypes.INTEGER,
  value: DataTypes.DECIMAL(10, 2),
  description: DataTypes.STRING(255),
  file: DataTypes.STRING(255),
  // Define otros campos para Projects
});
const Arragements = sequelize.define('Arragements', {
  name: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  pid: DataTypes.INTEGER,
  mid: DataTypes.INTEGER,
  type: DataTypes.STRING(45),
  script: DataTypes.STRING(255),
  file: DataTypes.STRING(255),
  // Define otros campos para Projects
});
const Designs = sequelize.define('Designs', {
  name: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  pid: DataTypes.INTEGER,
  mid: DataTypes.INTEGER,
  type: DataTypes.STRING(45),
  script: DataTypes.STRING(255),
  file: DataTypes.STRING(255),
  // Define otros campos para Projects
});
const Documentations = sequelize.define('Documentations', {
  name: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  pid: DataTypes.INTEGER,
  mid: DataTypes.INTEGER,
  type: DataTypes.STRING(45),
  entity: DataTypes.STRING(45),
  file: DataTypes.STRING(100),
  // Define otros campos para Projects
});
const Promotions = sequelize.define('Promotions', {
  name: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  pid: DataTypes.INTEGER,
  mid: DataTypes.INTEGER,
  type: DataTypes.STRING(45),
  description: DataTypes.STRING(255),
  date: DataTypes.DATE,
  // Define otros campos para Projects
});
const Recordings = sequelize.define('Recordings', {
  name: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  pid: DataTypes.INTEGER,
  mid: DataTypes.INTEGER,
  type: DataTypes.STRING(45),
  file: DataTypes.STRING(255),
  // Define otros campos para Projects
});
const ProjectsRole = sequelize.define('Projects_role', {
  role: DataTypes.STRING(45),
});

const Tasks = sequelize.define('Tasks', {
  project_id: DataTypes.INTEGER,
  name: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  task_pic: DataTypes.STRING(255),
  description: DataTypes.STRING(255),
  assignee_id: DataTypes.INTEGER,
  start_date: DataTypes.DATE,
  due_date: DataTypes.DATE,
  status: DataTypes.STRING(45),
});

const Tags = sequelize.define('Tags', {
  name: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
});
const Genres = sequelize.define('Genres', {
  name: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  ambito: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
});
const TaskTags = sequelize.define('TaskTags', {
  tag_id: DataTypes.INTEGER,
  task_id: DataTypes.INTEGER,
});

const Assets = sequelize.define('Assets', {
  name: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  description: DataTypes.STRING(255),
  value: DataTypes.DECIMAL(10, 2),
  purchase_date: DataTypes.DATE,
  asset_pic: DataTypes.STRING(100),
  project_id: DataTypes.INTEGER,
  asset_id: DataTypes.INTEGER,
  brand: DataTypes.STRING(45),
  state: DataTypes.STRING(45),
});

const Objectives = sequelize.define('Objectives', {
  name: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  description: DataTypes.STRING(255),
  project_id: DataTypes.INTEGER,
  target: DataTypes.STRING(255),
  target_type: DataTypes.STRING(255),
  status: DataTypes.ENUM('pending', 'in_progress', 'completed'),
  assignee_id: DataTypes.INTEGER,
});

const Categories = sequelize.define('Categories', {
  category_name: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  color: DataTypes.STRING(45),
});

// Función para crear la vista
const userView = async () => {
  await sequelize.query(`
    CREATE VIEW IF NOT EXISTS UserRoles AS SELECT Users.username, Users.email, Sys_roles.role_name FROM Users JOIN Sys_roles ON Users.sys_role_id = Sys_roles.id;
  `);

  await sequelize.query(`
    CREATE VIEW IF NOT EXISTS MacroProjects_sysview1 AS SELECT Users.username, Users.email, Sys_roles.role_name FROM Users JOIN Sys_roles ON Users.sys_role_id = Sys_roles.id;
  `);
  await sequelize.query(`
  CREATE VIEW IF NOT EXISTS Projects_sysview1 AS SELECT Users.username, Users.email, Sys_roles.role_name FROM Users JOIN Sys_roles ON Users.sys_role_id = Sys_roles.id;
`);
  await sequelize.query(`
  CREATE VIEW IF NOT EXISTS MacroProjects_objectives_sysview1 AS SELECT Users.username, Users.email, Sys_roles.role_name FROM Users JOIN Sys_roles ON Users.sys_role_id = Sys_roles.id;
`);
};

// Define relaciones entre las tablas aquí

module.exports = {
  Log,
  Users,
  Sys_role,
  Files,
  FileTypes,
  FileCategory,
  Accounts,
  Dashboards,
  Projects,
  Tasks,
  Assets,
  Tags,
  Objectives,
  TaskTags,
  Categories,
  Analysis,
  Arragements,
  Designs,
  Documentations,
  Promotions,
  Recordings,
  Macro_Projects,
  ProjectsRole,
  Projects_Modules,
  ProjectAccounts,
  Genres,
  userView,
};
