const modal = document.getElementById('myModal');
const steps = document.querySelectorAll('.step');
const closeButtons = document.querySelectorAll(".close");
const stepIndicators = document.querySelectorAll(".step-indicator");
const finishButton = document.getElementById("finishButton"); // Agrega el ID al botón Finalizar
const selectAllButton = document.getElementById('selectAll');
const deselectButton1 = document.getElementById('deselect');
let ArchivosSeleccionados;
//project automate vars
const prebutton = document.getElementById('prebutton');

prebutton.addEventListener('click', () => {
  // Recopilar los datos del formulario
  const TituloVideo = document.getElementById('titulo').value;
  const Project = document.getElementById('proyecto').value;
  const Task = document.getElementById('tarea').value;
  const Style = document.getElementById('estilo').value;
  const Resolution = document.getElementById('resolucion').value;
  const Ramdom = document.getElementById('aleatorio').checked ? true : false;


  // Crear un listado de nombres de archivos seleccionados
  const selectedFilesList = [...ArchivosSeleccionados].map(name => name[0]).join('\n');

  // Cambiar el contenido de los labels
  document.getElementById('titulo-prelabel').textContent = TituloVideo;
  document.getElementById('proyecto-prelabel').textContent = Project;
  document.getElementById('tarea-prelabel').textContent = Task.toUpperCase();
  document.getElementById('estilo-prelabel').textContent = Style.toUpperCase();
  document.getElementById('videos-prelabel').textContent = selectedFilesList;
  document.getElementById('resolucion-prelabel').textContent = Resolution;
  document.getElementById('aleatorio-prelabel').textContent = Ramdom ? 'Habilitado' : 'Deshabilitado';

  console.log(TituloVideo, Project);
});



finishButton.addEventListener('click', () => {
  // Recopilar los datos del formulario
const TituloVideo = document.getElementById('titulo').value;
const Project = document.getElementById('proyecto').value;
const Task = document.getElementById('tarea').value;
const Videolist = ArchivosSeleccionados;
const VideoPathlist = [];
const Style = document.getElementById('estilo').value;
const Resolution = document.getElementById('resolucion').value;
const Ramdom = document.getElementById('aleatorio').checked ? true : false;


[...ArchivosSeleccionados].map(file => {
  const ruta = `${file[1]}/${file[0]}`;
  VideoPathlist.push(ruta);
});

  // Crear el objeto con los datos del formulario
  const formData = {
  TituloVideo: TituloVideo,
  Project: Project,
  Task: Task,
  Videopathlist:  VideoPathlist,
  //Videolist:  Videolist,
  Style: Style,
  Resolution: Resolution,
  Ramdom: Ramdom
  };
  // Enviar el formulario al servidor
  fetch('/topvideosubmit', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    formData,
  }),
})

    .then(response => response.json())
    .then(responseData => {
      console.log('Respuesta del servidor:', responseData);
      // Realizar acciones adicionales después de enviar el formulario
      
    })
    .catch(error => {
      console.error('Error al enviar el formulario:', error);
    });
});


//project automate vars



let currentStep = 0;


function showStep(stepIndex) {
  steps.forEach((step, index) => {
    if (index === stepIndex) {
      step.style.display = 'block';
    } else {
      step.style.display = 'none';
    }
  });
}

function updateProgressBar(percentage) {
  progressBar.style.width = `${percentage}%`;
}

//
 const outputDiv = document.getElementById('output');
    const runScriptBtn = document.getElementById('runScriptBtn');
    
  //  runScriptBtn.addEventListener('click', async () => {
  //    try {
  //      const scriptArgs = 'arg1 arg2 arg3'; // Argumentos para el script de Python
  //      showsuccess('top','center','Se ha solicitado el escript');
  //      const response = await fetch('/getlocalfiles', {
  //        method: 'POST',
  //       headers: {
  //          'Content-Type': 'application/json'
  //        },
  //        body: JSON.stringify({ args: scriptArgs })
  //      });
  //      
  //      const result = await response.text();
  //      outputDiv.textContent = result;
  //      showdanger('top','center','error no se pudo ejecutar');
  //    } catch (err) {
  //      console.error('Error al ejecutar el script:', err);
  //      outputDiv.textContent = 'Error al ejecutar el script';
  //    }
  //  });
document.addEventListener('DOMContentLoaded', () => {
  const navigationBar = document.querySelector('.navigation-bar');
  const contentPanel = document.querySelector('.content-panel');
  const selectButton = document.querySelector('.select-button');
  const cancelButton = document.querySelector('.cancel-button');
  const input = document.querySelector('.input');
  const syncButton = document.querySelector('.sync-button');


  const selectedFiles = new Map(); 
  let currentFolderPath = ''; // Ruta actual relativa
  let selectedItems = [];

  
  // Obtener los archivos y carpetas del servidor
  fetch('/getlocalfiles', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}), // Puedes pasar argumentos si es necesario
  })
    .then(response => response.json())
    .then(data => {
      const folders = data.filter(item => item.directory); // Filtrar las carpetas
      const files = data.filter(item => !item.directory); // Filtrar los archivos

      // Agregar las carpetas a la barra de navegación
      folders.forEach(folder => {
        const folderIcon = document.createElement('i');
        folderIcon.classList.add('folder-icon', 'fas', 'fa-folder');
        const folderItem = document.createElement('li');
        folderItem.textContent = folder.name;
        folderItem.classList.add('navigation-item');
        folderItem.appendChild(folderIcon);
        folderItem.addEventListener('click', () => {
          // Al hacer clic en una carpeta, mostrar su contenido en el panel de contenido
          showFolderContents(folder);
          applySelectedStyleToItems();
          updateSelectedCountLabel();
        });
        navigationBar.appendChild(folderItem);
      });

      // Función para mostrar el contenido de una carpeta en el panel de contenido
      function showFolderContents(folder) {
        contentPanel.innerHTML = ''; // Limpiar el contenido actual
        currentFolderPath = folder.name; // Ruta actual relativa
        console.log(currentFolderPath);

        // Agregar los archivos de la carpeta al panel de contenido
        folder.children.forEach(child => {
          const item = document.createElement('div');
          item.classList.add('item');
          item.setAttribute('name',child.name);
          item.innerHTML = `
            <i class="item-icon fas fa-file"></i>
            <span>${child.name}</span>
          `;

           // Agregar la miniatura si está disponible
          if (item.thumbnail) {
            const thumbnail = document.createElement('img');
            thumbnail.src = file.thumbnail;
            thumbnail.alt = file.name;
            thumbnail.classList.add('thumbnail');
            item.insertBefore(thumbnail, item.firstChild);
          }



          item.addEventListener('click', () => {
            // Al hacer clic en un archivo, seleccionar/deseleccionar y actualizar el input
            toggleSelection(child.name,item,currentFolderPath);


          });
          contentPanel.appendChild(item);
        });
      }


// Función para seleccionar/deseleccionar archivos
function toggleSelection(fileName, itemElement, folderPath) {
  if (selectedFiles.has(fileName)) {
    selectedFiles.delete(fileName);
    itemElement.classList.remove('selected');
  } else {
    selectedFiles.set(fileName, folderPath); // Almacenamos nombre y ruta relativa en el Map
    itemElement.classList.add('selected');
  }
  updateInput();
  applySelectedStyleToItems();
  updateSelectedCountLabel();
}
function updateSelectedCountLabel() {
  const selectedCount = selectedFiles.size;
  const label = document.getElementById('selectedCountLabel');
  label.textContent = `${selectedCount} elementos seleccionados`;
}

// Función para actualizar el contenido del input con los nombres y rutas seleccionados
function updateInput() {
  const selectedNames = [...selectedFiles.keys()].map(name => `"${name}"`).join('\t');
  input.value = selectedNames;
}

function applySelectedStyleToItems() {
  const items = document.querySelectorAll('.content-panel .item');

  items.forEach(itemElement => {
    const itemName = itemElement.getAttribute('name');
    
    if (selectedFiles.has(itemName)) {
      itemElement.classList.add('selected');
    } else {
      itemElement.classList.remove('selected');
    }
  });
}


      
      // Función para limpiar la selección y el input
      function clearSelection() {
        selectedFiles.clear();
        updateInput();
      }
       // Event listener para el botón de seleccionar
  selectButton.addEventListener('click', () => {
    ArchivosSeleccionados = selectedFiles;
    console.log('Archivos seleccionados:', Array.from(selectedFiles));
  });

  // Event listener para el botón de cancelar
  cancelButton.addEventListener('click', () => {
    selectedFiles.clear();
    updateInput();
    updateSelectedCountLabel();
    contentPanel.querySelectorAll('.item.selected').forEach(item => {
      item.classList.remove('selected');
    });
  });

      syncButton.addEventListener('click', () => {
  // Obtener los archivos y carpetas actualizados del servidor
  fetch('/getlocalfiles', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}), // Puedes pasar argumentos si es necesario
  })
    .then(response => response.json())
    .then(data => {
      // Filtrar las carpetas y archivos
      const folders = data.filter(item => item.directory);
      const files = data.filter(item => !item.directory);

      // Limpiar la barra de navegación y el panel de contenido
      navigationBar.innerHTML = '';
      contentPanel.innerHTML = '';

      // Agregar las carpetas a la barra de navegación
      folders.forEach(folder => {
        const folderIcon = document.createElement('i');
        folderIcon.classList.add('folder-icon', 'fas', 'fa-folder');
        const folderItem = document.createElement('li');
        folderItem.textContent = folder.name;
        folderItem.classList.add('navigation-item');
        folderItem.appendChild(folderIcon);
        folderItem.addEventListener('click', () => {
          // Al hacer clic en una carpeta, mostrar su contenido en el panel de contenido
          showFolderContents(folder);
          applySelectedStyleToItems();
          updateSelectedCountLabel();
        });
        navigationBar.appendChild(folderItem);
      });

      // Mostrar archivos de la última carpeta seleccionada (si hay una carpeta seleccionada)
      const lastSelectedFolder = [...selectedFiles][0];
      if (lastSelectedFolder) {
        const folderToDisplay = folders.find(folder => folder.name === lastSelectedFolder);
        if (folderToDisplay) {
          showFolderContents(folderToDisplay);
        }
      }
    })
    .catch(error => {
      console.error('Error al obtener los archivos:', error);
    });
});
    })
    .catch(error => {
      console.error('Error al obtener los archivos:', error);
    });
});



function resetModal() {
    modal.style.display = "none";
    currentStep = 0;
    showStep(currentStep);
  }

function nextStep() {
  if (currentStep < steps.length - 1) {
    currentStep++;
    showStep(currentStep);
  }
}

function prevStep() {
  if (currentStep > 0) {
    currentStep--;
    showStep(currentStep);
  }
}

function finish() {
  resetModal();
  showwarning('top','center','No se especifico el tipo de video portrait');
  showsuccess('top','center','Se ha creado el nuevo guion para Top Video Generator');
}

document.querySelectorAll('.next').forEach(btn => {
  btn.addEventListener('click', nextStep);
});

document.querySelectorAll('.prev').forEach(btn => {
  btn.addEventListener('click', prevStep);
});

document.querySelectorAll('.finish').forEach(btn => {
  btn.addEventListener('click', finish);
});
    

function performProcess() {
    
          progressBar.classList.remove('progress-bar');
          progressBar.classList.add('indeterminate-progress');
          progressBar.style.width = '100%';

}
