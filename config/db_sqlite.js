const { Sequelize } = require('sequelize');

// Ruta al archivo de la base de datos SQLite
const database = './database/projectFlow_db.sqlite'; // Asegúrate de que la ruta sea correcta

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: database,
  define: {
    timestamps: false, // Si no deseas usar los campos "createdAt" y "updatedAt"
  },
});

// Verificar la conexión a la base de datos
sequelize
  .authenticate()
  .then(() => {
    console.log('Conexión a la base de datos establecida correctamente.');
  })
  .catch((error) => {
    console.error('Error al conectar a la base de datos:', error);
  });

// Función para conectar a la base de datos
async function connectdb() {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
  }
}

// Función para desconectar la base de datos
async function disconnectdb() {
  try {
    await sequelize.close();
    console.log('Conexión a la base de datos cerrada.');
  } catch (error) {
    console.error('Error al cerrar la conexión a la base de datos:', error);
  }
}

module.exports = { sequelize, connectdb, disconnectdb };
