// src/controllers/fileController.js
const fs = require('fs');
//const fs = require('fs').promises;
const path = require('path');
const multer = require('multer');
const configFilePath = path.join(__dirname, '../config/Config.json');

  //ssh config
 const ssh = {
    host: 'powerserver.local',
    port: 22,
    username: 'sad4k',
    password: '12345s3561a'
  };
// ###################################### Gestion de Configuracion ################################################//
const configure = {
  saveConfig: async (config, callback) => {
    try {
      let configs = {};

      // Leer el archivo existente, si existe
      if (fs.existsSync(configFilePath)) {
        const rawData = await fs.promises.readFile(configFilePath, 'utf8');
        configs = JSON.parse(rawData);
        console.log("el archivo existe");
      }

      // Actualizar la configuración
      Object.assign(configs, config);
      // Crear el directorio si no existe
      await fs.promises.mkdir(path.dirname(configFilePath), { recursive: true });

      // Escribir las configuraciones actualizadas en el archivo
      await fs.promises.writeFile(configFilePath, JSON.stringify(configs, null, 2), 'utf8');
      console.log("configuracion actualizada", configs);

      callback(null, 'Configuración guardada correctamente.');
    } catch (err) {
      callback(err);
    }
  },

  readConfig: (callback) => {
    if (!fs.existsSync(configFilePath)) {
      return callback(new Error('El archivo de configuración no existe.'));
    }
    
    const rawData = fs.readFileSync(configFilePath);
    const configs = JSON.parse(rawData);
    console.log("Configuracion Cargada");
    callback(null, configs);
  },
  getConfigServer: () => {
    if (!fs.existsSync(configFilePath)) {
      throw new Error('El archivo de configuración no existe.');
    }

    const rawData = fs.readFileSync(configFilePath, 'utf8');
    const configs = JSON.parse(rawData);

    return configs;
  }

};
module.exports = {
  //ssh config
  ssh,
  configure
};
