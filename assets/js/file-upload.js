document.addEventListener('DOMContentLoaded', function() {
  const modal = document.getElementById('myModal');
  const dropArea = modal.querySelector('.drop-area');
  const videoInput = modal.querySelector('#video');
  const uploadButton = modal.querySelector('#uploadButton');
  const fileInput = document.getElementById('video');

  // Evita el comportamiento predeterminado para el evento dragover
  dropArea.addEventListener('dragover', function(e) {
    e.preventDefault();
    dropArea.classList.add('active');
  });

  // Restaura el estilo cuando el elemento se suelte fuera de él
  dropArea.addEventListener('dragleave', function() {
    dropArea.classList.remove('active');
  });

  // Maneja la acción de soltar archivos
  dropArea.addEventListener('drop', function(e) {
    e.preventDefault();
    dropArea.classList.remove('active');
    const files = e.dataTransfer.files;
    handleFiles(files);
  });

  // Maneja la selección de archivos a través del input[type="file"]
  videoInput.addEventListener('change', function() {
    const files = videoInput.files;
    handleFiles(files);
  });

  function handleFiles(files) {
    
    progressBar.classList.remove('progress-bar');
    progressBar.classList.add('indeterminate-progress');
    progressBar.style.width = '100%';
    
    if (files.length > 0) {
      console.log(`Archivos seleccionados: ${files.length}`);
      for (const file of files) {
        console.log(`Archivo: ${file.name}`);
      }
      
      // Crea un objeto FormData para enviar los archivos al servidor
      const formData = new FormData();
      for (const file of files) {
        formData.append('archivos', file);
      }

      // Envia los archivos al servidor utilizando fetch
      fetch('/uploadfiles', {
        method: 'POST',
        body: formData,
      })
      .then(response => response.text())
      .then(result => {
        console.log(result); // Mensaje del servidor
        progressBar.classList.remove('indeterminate-progress');
        progressBar.classList.add('progress-bar');
        progressBar.style.width = '0%';
        showsuccess('top','center', 'Los archivos se ha subido correctamente');
      })
      .catch(error => {
        console.error('Error al subir los archivos:', error);
      });
    }
  }
});
