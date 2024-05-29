
// Variables para almacenar las páginas creadas
let systemConfigPage = null;
let hostConfigPage = null;
let dbConfigPage = null;
let dbConfigOutdated = false;
let systemConfig;

document.addEventListener('DOMContentLoaded', () => {
    fetch('/getConfig')
        .then(response => response.json())
        .then(config => {
            systemConfig = config;

            console.log(systemConfig);
            // Aquí puedes usar el objeto systemConfig como desees
        })
        .catch(error => console.error('Error al obtener la configuración:', error));
});


const newSystemConfig = systemConfig;

//page sistema act
function updateSystemPartial() {
    newSystemConfig.zone = document.getElementById("zone").value;
    newSystemConfig.language = document.getElementById("language").value;
    newSystemConfig.autoCalc = document.getElementById("autocalc").value;
    newSystemConfig.sysMode = document.getElementById("sysMode").value;
    newSystemConfig.projectPath = document.getElementById("projectPath").value;
    console.log("updated", newSystemConfig );
}

//page Mysql act
function updateMySqlPartial() {
    newSystemConfig.db_mysql_server = document.getElementById("server").value;
    newSystemConfig.db_mysql_port = document.getElementById("port").value;
    newSystemConfig.db_mysql_backup = document.getElementById("mysqlbackup").value;
    newSystemConfig.db_backup_frec = document.getElementById("mysqlbackupfrec").value;
    newSystemConfig.db_mysql_script = document.getElementById("mysqlscript").value;
    console.log("updated", newSystemConfig );

}
//page sistema act
function updateSqlitePartial() {
    newSystemConfig.db_local_path = document.getElementById("dblocalpath").value;
    newSystemConfig.db_local_backup_path = document.getElementById("dbsqlitebackuppath").value;
    newSystemConfig.db_backup_frec = document.getElementById("sqlitebackupfrec").value;
    newSystemConfig.db_local_script = document.getElementById("sqlitescript").value;
    console.log("updated", newSystemConfig );

}
// Función para generar el HTML dinámicamente
function generateSystemConfigHTML(config) {
    return `
        <div class="page" name="System-config">
            <div class="modal-inside-title">Información del Sistema</div>
            <table class="report-control" class="overflow-horizontal" id="relatedProjectsFromMacroProjectsTable">
                <tbody>
                    <tr>
                        <td>Zona</td>
                        <td><select class="form-control" id="zone" name="zone" onchange="updateSystemPartial()" value="${config.zone}">
                        <option value="República Dominicana">República Dominicana</option>
                        </select></td>
                    </tr>
                    <tr>
                        <td>Idioma</td>
                        <td><select class="form-control" id="language" name="language" onchange="updateSystemPartial()" value="${config.language}">
                        <option value="ES-US">Español US</option>
                        </select>
                    </tr>
                </tbody>
            </table>
            <div class="modal-inside-title">Configuracion de Funcionamiento</div>
            <table class="report-control" class="overflow-horizontal" id="relatedProjectsFromMacroProjectsTable">
                <tbody>
                <tr>
                        <td>AutoCalc <span class="fa fa-info"></span></td>
                        <td><select class="form-control" id="autocalc" name="autocalc" onchange="updateSystemPartial()" value="${config.autoCalc}">
                        <option value="1">Enabled</option>
                        <option value="0">Disabled</option>
                        </select></td>
                    </tr>
                    <tr>
                        <td>Funcionamiento</td>
                        <td><select class="form-control" id="sysMode" name="sysMode" onchange="databaseMode()" value="${config.sysMode}">
                        <option value="demo-local">Demostrativo (Local)</option>
                        <option value="demo-online">Demostrativo (With Server)</option>
                        <option value="master-local-sqlite">Master Local</option>
                        <option value="slave-local-sqlite">Slave Local</option>
                        <option value="online-Mysql">Online MySql Server</option>
                        </select></td>
                    </tr>
                </tbody>
            </table>
            <div class="modal-inside-title">Configuracion del Sistema</div>
            <table class="report-control" class="overflow-horizontal" id="relatedProjectsFromMacroProjectsTable">
                <tbody>
                    <tr>
                        <td>Ruta de Proyectos</td>
                        <td><input type="text" class="form-control" id="projectPath" onkeyup="updateSystemPartial()" name="proyectPath" value="${config.projectPath}"></td>
                    </tr>
                    <tr>
                        <td>Restablecer Configuracion</td>
                        <td><input type="file" class="form-control" accept=".pfconfig"></td>
                    </tr>
                    <tr>
                        <td>Guardar Configuracion</td>
                        <td><a class="form-control">Download .pfconfig <span class="fa fa-download"></span></a></td>
                    </tr>
                </tbody>
            </table>
        </div>`;
};
function generateHostConfigHTML(hostConfig) {
    return `
        <div class="page" name="System-config">
            <div class="modal-inside-title">Información del Host</div>
            <table class="report-control" class="overflow-horizontal" id="relatedProjectsFromMacroProjectsTable">
                <tbody>
                    <tr>
                        <td>Nombre Dispositivo</td>
                        <td><input type="text" class="form-control" readonly value="${hostConfig.hostName}"></td>
                    </tr>
                    <tr>
                        <td>Id Dispositivo</td>
                        <td>${hostConfig.hostId}</td>
                    </tr>
                    <tr>
                        <td>Mac</td>
                        <td>${hostConfig.hostMac}</td>
                    </tr>
                    <tr>
                        <td>Direccion ip</td>
                        <td>${hostConfig.ipAddress}</td>
                    </tr>
                    <tr>
                        <td>Gateway</td>
                        <td>${hostConfig.ipGateway}</td>
                    </tr>
                    <tr>
                        <td>Ram</td>
                        <td>${hostConfig.ram}</td>
                    </tr>
                    <tr>
                        <td>OS</td>
                        <td>${hostConfig.os}</td>
                    </tr>
                </tbody>
            </table>
        </div>`;
};

function generateDbConfigHTML(systemConfig) {
    switch (systemConfig.sysMode) {
        case 'demo-local':

            break;
        case 'demo-online':
            handleDemoOnline();
            break;
        case 'master-local-sqlite':
            return `
        <div class="page" name="System-config">
            <div class="card-inside-title">Base de Datos local</div>
            <table class="report-control" class="overflow-horizontal" id="">
                <tbody>
                    <tr>
                        <td >Ruta</td>
                        <td colspan="2"><input type="text" onkeyup="updateSqlitePartial()" id="dblocalpath" name="dblocalpath" class="form-control" value="${systemConfig.db_local_path}"></td>
                    </tr>
                    <tr>
                        <td colspan="2"><a onclick="conectSqlite()" class="btn success">Conectar</a><span></span></td>
                        <td colspan="2"><a class="btn danger">Borrar</a><span></span></td>
                    </tr>
                    </tbody>
            </table>
            <div class="card-inside-title">Respaldo Base de Datos</div>
            <table class="report-control" class="overflow-horizontal" id="relatedProjectsFromMacroProjectsTable">
                <tbody>
                    <tr>
                        <td>Ruta guardado</td>
                        <td colspan="2" ><input type="text" class="form-control" onkeyup="updateSqlitePartial()" id="dbsqlitebackuppath" name="dbsqlitebackuppath" value="${systemConfig.db_local_backup_path}"></td>
                    </tr>
                    <tr>
                        <td>Frecuencia</td>
                        <td colspan="2" ><select class="form-control" id="sqlitebackupfrec" name="sysMode" onchange="updateSqlitePartial()" name="sqlitebackupfrec" value="${systemConfig.db_backup_frec}">
                        <option selected value="no_backup">No respaldar</option>
                        <option value="at_close">Al cerrar</option>
                        <option value="daily">Cada Dia</option>
                        <option value="weekely">Cada Semana</option>
                        <option value="monthly">Cada Mes</option>
                        </select></td>
                    </tr>
                    <tr>
                        <td colspan="2"><button type="" class="success">Respladar</button></td>
                        <td colspan="2"><button type="" class="danger">Restablecer</button></td>
                    </tr>
                    </tbody>
            </table>
            <div class="card-inside-title">Crear Nueva Base de Datos</div>
            <table class="report-control" class="overflow-horizontal" id="relatedProjectsFromMacroProjectsTable">
                <tbody>
                    <tr>
                        <td>Ruta de guardado</td>
                        <td><input type="text" class="form-control" value="${systemConfig.db_local_path}"></td>
                    </tr>
                    <tr>
                        <td>SQL Script</td>
                        <td><textarea class="form-control" style="resize: none; height: 200px;" onkeyup="updateSqlitePartial()" id="sqlitescript" name="sqlitescript">${systemConfig.db_local_script}</textarea></td>
                    </tr>
                    <tr>
                        <td colspan="2"><button class="login-btn">Crear</button></td>
                    </tr>
                    </tbody>
            </table>
        </div>`;
            break;
        case 'slave-local-sqlite':
            handleSlaveLocal();
            break;
        case 'online-Mysql':
            return `
        <div class="page" name="System-config">
            <div class="card-inside-title">Base de Datos Mysql</div>
            <table class="report-control" class="overflow-horizontal" id="">
                <tbody>
                    <tr>
                        <td>Servidor</td>
                        <td colspan="2"><input type="text" class="form-control" onkeyup="updateMySqlPartial()" id="server" name="server" value="${systemConfig.db_mysql_server}"></td>
                    </tr>
                    <tr>
                        <td>Puerto</td>
                        <td colspan="2"><input type="text" class="form-control" onkeyup="updateMySqlPartial()" id="port" name="port" value="${systemConfig.db_mysql_port}"></td>
                    </tr>
                    <tr>
                        <td colspan="2"><button class="btn success">Conectar</button><span>Conexion exitosa</span></td>
                        <td colspan="2"><button class="btn danger">Borrar</button><span>Conexion exitosa</span></td>
                    </tr>
                    </tbody>
            </table>
            <div class="card-inside-title">Respaldo Base de Datos</div>
            <table class="report-control" class="overflow-horizontal" id="relatedProjectsFromMacroProjectsTable">
                <tbody>
                    <tr>
                        <td>Ruta guardado</td>
                        <td colspan="2" ><input type="text" class="form-control" value="${systemConfig.db_mysql_backup}" onkeyup="updateMySqlPartial()" id="mysqlbackup" name="mysqlbackup"></td>
                    </tr>
                    <tr>
                        <td>Frecuencia</td>
                        <td colspan="2" ><select class="form-control" id="sqlitebackupfrec" onchange="updateMySqlPartial()"  id="mysqlbackupfrec" name="mysqlbackupfrec">
                        <option selected value="no_backup">No respaldar</option>
                        <option value="at_close">Al cerrar</option>
                        <option value="daily">Cada Dia</option>
                        <option value="weekely">Cada Semana</option>
                        <option value="monthly">Cada Mes</option>
                        </select></td>
                    </tr>
                    <tr>
                        <td colspan="2"><button type="" class="success">Respladar</button></td>
                        <td colspan="2"><button type="" class="danger">Restablecer</button></td>
                    </tr>
                    </tbody>
            </table>
            <div class="card-inside-title">Crear Nueva Base de Datos</div>
            <table class="report-control" class="overflow-horizontal" id="relatedProjectsFromMacroProjectsTable">
                <tbody>
                    <tr>
                        <td>SQL Script</td>
                        <td><textarea class="form-control" style="resize: none; height: 200px; " onkeyup="updateMySqlPartial()" id="mysqlscript" name="mysqlscript">${systemConfig.db_mysql_script}</textarea></td>
                    </tr>
                    <tr>
                        <td colspan="2"><button class="login-btn">Crear</button></td>
                    </tr>
                    </tbody>
            </table>
        </div>`;
            break;
        default:
            console.warn('Modo no reconocido:', sysMode);
    }

};

// Función para manejar el cambio del select de funcionamiento
function handleSelectChange() {
    dbConfigOutdated = true; // Marcar db-config como desactualizada
}

function changePage(pageName) {
    const pagePanel = document.getElementById("configTabPanel");

    // Ocultar todas las páginas primero
    if (systemConfigPage) systemConfigPage.style.display = 'none';
    if (hostConfigPage) hostConfigPage.style.display = 'none';
    if (dbConfigPage) dbConfigPage.style.display = 'none';

    // Mostrar la página solicitada
    if (pageName === 'System-config') {
        if (!systemConfigPage) {
            systemConfigPage = document.createElement('div');
            systemConfigPage.innerHTML = generateSystemConfigHTML(systemConfig);
            pagePanel.appendChild(systemConfigPage);
        }
        systemConfigPage.style.display = 'block';
    } else if (pageName === 'Host-config') {
        if (!hostConfigPage) {
            hostConfigPage = document.createElement('div');
            hostConfigPage.innerHTML = generateHostConfigHTML(systemConfig);
            pagePanel.appendChild(hostConfigPage);
        }
        hostConfigPage.style.display = 'block';
    } else if (pageName === 'db-config') {
        if (!dbConfigPage || dbConfigOutdated) {
            if (dbConfigPage) {
                pagePanel.removeChild(dbConfigPage); // Eliminar la página actual si existe
            }
            dbConfigPage = document.createElement('div');
            dbConfigPage.innerHTML = generateDbConfigHTML(systemConfig);
            pagePanel.appendChild(dbConfigPage);
            dbConfigOutdated = false; // Resetear el estado de desactualizado
        }
        dbConfigPage.style.display = 'block';
    } else {
        alert("No existe esa configuración");
    }
}

function databaseMode() {
    updateSystemPartial();
    handleSelectChange();
    const sysMode = document.getElementById('sysMode').value;
    systemConfig.sysMode = sysMode;

    switch (sysMode) {
        case 'demo-local':
            handleDemoLocal();
            break;
        case 'demo-online':
            handleDemoOnline();
            break;
        case 'master-local-sqlite':
            handleMasterLocal();
            break;
        case 'slave-local-sqlite':
            handleSlaveLocal();
            break;
        case 'online-Mysql':
            handleOnlineMysql();
            break;
        default:
            console.warn('Modo no reconocido:', sysMode);
    }
};

function handleDemoLocal() {
    document.getElementById('db-config-pannel').style.display = 'none';
    console.log('Modo Demostrativo (Local) seleccionado');
    // Agrega aquí la lógica específica para el modo demostrativo local
};

function handleDemoOnline() {
    document.getElementById('db-config-pannel').style.display = 'none';
    console.log('Modo Demostrativo (With Server) seleccionado');
    // Agrega aquí la lógica específica para el modo demostrativo con servidor
};

function handleMasterLocal() {
    document.getElementById('db-config-pannel').style.display = 'block';
    console.log('Modo Master Local seleccionado');

};

function handleSlaveLocal() {
    document.getElementById('sysMode').value = "master-local-sqlite";
    alert('Actualmente No disponible');
}

function handleOnlineMysql() {
    document.getElementById('db-config-pannel').style.display = 'block';
    console.log('Modo Mysql seleccionado');

};

function conectSqlite() {
    alert("conectando");
};

async function sendConfig() {
    try {
        const response = await fetch('/saveConfig', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ newSystemConfig })
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Error al guardar la configuración: ${errorMessage}`);
        }

        const message = await response.text();
        console.log('Configuración guardada con éxito:', message);
    } catch (error) {
        console.error('Error al enviar la configuración:', error);
        alert('Hubo un error al guardar la configuración. Por favor, inténtalo de nuevo.');
    }
}