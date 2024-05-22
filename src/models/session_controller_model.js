const { sequelize, connectdb, disconnectdb } = require('../../config/database'); // Asegúrate de que la ruta sea correcta
const entities = require('../entity/data-entity.js'); // Importa el modelo de usuario
// Importa la biblioteca 'util' para poder convertir una función de callback en una promesa
const util = require('util');
// Convierte la función de callback en una promesa
const queryAsync = util.promisify(sequelize.query).bind(sequelize);

const system = {
  validarUsuario: async function (username, password) {
    try {
      const query = `SELECT id, username, name, lastname, def_dashboard_id, email, state, profilePic FROM Users WHERE username = "${username}" AND BINARY password = "${password}"`;
      const resultados = await sequelize.query(query, {
        replacements: [username, password],
        type: sequelize.QueryTypes.SELECT,
      });

      if (resultados.length === 1) {
        const usuarioValidado = resultados[0];
        console.log('Usuario válido:', usuarioValidado.username);
        return usuarioValidado;
      } else {
        console.log('Usuario no válido.');
        return null;
      }
    } catch (error) {
      console.error('Error al realizar la consulta:', error);
      return null;
    }
  },
};

// Exportar las funciones agrupadas en un objeto
module.exports = {
  system: system,
};
