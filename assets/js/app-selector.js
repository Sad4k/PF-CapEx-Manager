const body = document.body;
function slideIn(element) {
    element.style.animation = 'slideIn 1s forwards';
}

function fade(element) {
    element.style.animation = 'fade 0.5s forwards';
    element.addEventListener('animationend', function() {
    });
}

// Función para aplicar el tema seleccionado cambiando la clase del body
function applyTheme(themeName) {
    // Eliminar clases de tema anteriores
    body.classList.remove(
      'light-theme',
      'dark-theme',
      'light-theme-blue',
      'light-theme-pink',
      'dark-theme-ocean',
      'hight-contrast-theme',
      'tech-theme',
      'full-colored-theme',
      'animated-theme'
    );
    // Aplicar clase del tema seleccionado
    slideIn(body);
    body.classList.add(themeName);
    
  }
  
  
  document.addEventListener('DOMContentLoaded', () => {
      fetch('/getConfig')
          .then(response => response.json())
          .then(config => {
              systemConfig = config;
              newSystemConfig = systemConfig;
  
              //aplicando el tema guardado
              applyTheme(systemConfig.theme);
              console.log(systemConfig.theme);
          })
          .catch(error => console.error('Error al obtener la configuración:', error));
  });
  
  
  