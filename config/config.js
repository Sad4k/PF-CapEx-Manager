// config.js
const serverConfig = {
getConfigServer: () => {
  if (!fs.existsSync(configFilePath)) {
    throw new Error('El archivo de configuración no existe.');
  }

  const rawData = fs.readFileSync(configFilePath, 'utf8');
  const configs = JSON.parse(rawData);

  return configs;
}
}
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
