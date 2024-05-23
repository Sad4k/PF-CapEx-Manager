 // Objeto de configuración
 const systemConfig = {
    zone: 'República Dominicana',
    language: 'Español(us)',
    update: 'Actualizaciones Disponibles',
    systemVersion: 'PF365 Ver.Pre-Alpha by Sad4k',
    licence: 'NO REGISTRADO (Funciones Limitadas)'
};

// Función para generar el HTML dinámicamente
function generateSystemConfigHTML(config) {
    return `
        <div class="page" name="System-config">
            <div class="modal-inside-title">Información del Sistema</div>
            <table class="report-control" class="overflow-horizontal" id="relatedProjectsFromMacroProjectsTable">
                <tbody>
                    <tr>
                        <td>Zona</td>
                        <td>${config.zone}</td>
                    </tr>
                    <tr>
                        <td>Idioma</td>
                        <td>${config.language}</td>
                    </tr>
                    <tr>
                        <td>Actualización</td>
                        <td>${config.update}</td>
                    </tr>
                    <tr>
                        <td>Sistema</td>
                        <td>${config.systemVersion}</td>
                    </tr>
                    <tr>
                        <td>Licencia</td>
                        <td>${config.licence}</td>
                    </tr>
                </tbody>
            </table>
        </div>`;
}

function changePage(pageName) {
    const pagePanel = document.getElementById("configTabPanel");

    if (pageName === 'System-config') {
        pagePanel.innerHTML = generateSystemConfigHTML(systemConfig);
    } else {
        alert("No existe esa configuración");
    }
}