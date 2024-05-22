const { exec } = require('child_process');
const ssh2 = require('ssh2');
const config = require('../../config/config.js');

// Función para ejecutar un script de Python
const executePythonScript = (scriptPath, args) => {
  return new Promise((resolve, reject) => {
    exec(
      `cd /media/sad4k/PROJECT-AUTOMATE/InputFolders/ForTopVideos && ls`,
      (error, stdout, stderr) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(stdout);
      }
    );
  });
};
const TopVideo = {
  // Función para ejecutar un script de Python por ssh
  listInputVideosssh: async () => {
    return new Promise((resolve, reject) => {
      const sshConfig = config.ssh;

      const conn = new ssh2.Client();

      conn
        .on('ready', () => {
          conn.exec(
            'cd /media/sad4k/PROJECT-AUTOMATE/InputFolders/ForTopVideos && ls',
            (err, stream) => {
              if (err) {
                conn.end();
                reject(err);
                return;
              }

              let result = '';

              stream
                .on('close', (code, signal) => {
                  conn.end();
                  resolve(result.trim());
                })
                .on('data', (data) => {
                  result += data.toString();
                })
                .stderr.on('data', (data) => {
                  conn.end();
                  reject(data.toString());
                });
            }
          );
        })
        .connect(sshConfig);
    });
  },
  createscriptssh: async (data) => {
    return new Promise((resolve, reject) => {
      data = data.formData;
      const sshConfig = config.ssh;

      const conn = new ssh2.Client();

      const ramdom = data.Ramdom ? '--aleatorio' : '';
      const resolution =
        data.Resolution == 'default' ? '' : `-res "${data.Resolution}"`;
      const videolist = data.Videopathlist.join(', ');

      conn
        .on('ready', () => {
          conn.exec(
            ` cd /media/sad4k/PROJECT-AUTOMATE/Scriptfiles/TopVideos && python3 TopVideo-ScriptGenerator.py "${data.TituloVideo}" -st "${data.Style}" -p "${data.Project}" -t "${data.Task}" ${resolution} -vf "${videolist}" ${ramdom}`,
            (err, stream) => {
              if (err) {
                conn.end();
                reject(err);
                return;
              }

              let result = '';

              stream
                .on('close', (code, signal) => {
                  conn.end();
                  resolve(result.trim());
                })
                .on('data', (data) => {
                  result += data.toString();
                })
                .stderr.on('data', (data) => {
                  conn.end();
                  reject(data.toString());
                });
            }
          );
        })
        .connect(sshConfig);
    });
  },

  // Función para ejecutar un script de Python (no funcionan para los scripts)
  listinputvideos: () => {
    return new Promise((resolve, reject) => {
      exec(
        `cd /media/sad4k/PROJECT-AUTOMATE/InputFolders/ForTopVideos && ls`,
        (error, stdout, stderr) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(stdout);
        }
      );
    });
  },
  listoutputvideos: () => {
    return new Promise((resolve, reject) => {
      exec(
        `cd /media/sad4k/PROJECT-AUTOMATE/InputFolders/FromTopVideos && ls`,
        (error, stdout, stderr) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(stdout);
        }
      );
    });
  },

  runtopvideoscript: () => {
    return new Promise((resolve, reject) => {
      exec(
        `cd /media/sad4k/PROJECT-AUTOMATE/Scriptfiles/TopVideos && python3 TopVideo-ScriptGenerator.py  `,
        (error, stdout, stderr) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(stdout);
        }
      );
    });
  },
};

// Ejemplo de uso
//(async () => {
//  try {
//    const scriptArgs = 'arg1 arg2 arg3'; // Argumentos para el script de Python
//    const result = await executePythonScript(pythonScriptPath, scriptArgs);
//    console.log('Respuesta del script:', result);
//  } catch (err) {
//    console.error('Error al ejecutar el script:', err);
//  }
//})();
//
module.exports = {
  executePythonScript,
  TopVideo,
};
