// config.js
const Fileman_controller = require('../src/controllers/filemanager.js');
const serverConfig = Fileman_controller.configure.getConfigServer();
module.exports = {
  //ssh config
  ssh: {
    host: 'powerserver.local',
    port: 22,
    username: 'sad4k',
    password: '12345s3561a',
  },
  serverConfig
};
