document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  // Aquí puedes agregar la lógica para validar las credenciales y redirigir al usuario si es válido
});

function showNotification(message) {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.classList.add('show');
  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000); // Desaparece después de 3 segundos
}

// Ejemplo de uso
showNotification('Este es un mensaje de notificación');
