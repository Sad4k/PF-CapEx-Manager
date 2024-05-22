 function slideIn(element) {
    element.style.animation = 'slideIn 1s forwards';
}

function fade(element) {
    element.style.animation = 'fade 0.5s forwards';
    element.addEventListener('animationend', function() {
    });
}

function formatearFecha(fechaISO8601) {
    const fecha = new Date(fechaISO8601);
    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    return `${año}-${mes}-${dia}`;
}

function formatearHora(fechaISO8601) {
    const fecha = new Date(fechaISO8601);
    const horas = String(fecha.getHours()).padStart(2, '0');
    const minutos = String(fecha.getMinutes()).padStart(2, '0');
    return `${horas}:${minutos}`;
}


function modalUp() {
    var selectedMacroProject = document.querySelector('.macro-project-item.selected');
    if (selectedMacroProject) {
        var macroprojectId = selectedMacroProject.getAttribute('data-macroproject-id');
        document.getElementById("macroprojectId").value = macroprojectId;
    }
    var selectedProject = document.querySelector('.project-item.selected');
    if (selectedProject) {
        var projectId = selectedProject.getAttribute('data-project-id');
        document.getElementById("moduleprojectId").value = projectId;
    }

}

function openEditProjectModuleModal(ProjectModuleId) {

    // Hacer una solicitud al servidor para obtener los datos
    console.log(ProjectModuleId);
    fetch('/project-manager/module-data/' + ProjectModuleId)
        .then(response => response.json())
        .then(data => {
            console.log(data);

                const launchDate = data.launch_date.split(' ');



                $("#editModuleModalTitle").text(`Project-Module - #${data.name}`);
                $("#editprojectmoduleform #editModuleprojectId").val(data.project_id);
                $("#editprojectmoduleform #editMModalId").val(data.id);
                $("#editprojectmoduleform #editMModalname").val(data.name);
                $("#editprojectmoduleform #editMModalPerformer").val(data.performer);
                $("#editprojectmoduleform #editMModalAuthor").val(data.author);
                $("#editprojectmoduleform #editmoduleGenre").val(data.genre);
                $("#editprojectmoduleform #editmoduledescription").text(data.description);
                $("#editprojectmoduleform #editmodulelaunchDate").val(formatearFecha(launchDate[0]));

                /*$("#editprojectform #image").attr("src", data.projects.project_pic);*/
            

            // Mostrar el modal después de haber agregado los datos a la tabla
            var modalId = 'editProjectModuleModal';
            var modal = document.getElementById(modalId);
            if (modal) {
                fade(modal);
                modal.style.display = "block";
                // Cerrar modal al hacer clic en el botón de cierre
                modal.querySelector(".close").addEventListener("click", function() {
                    modal.style.display = "none";
                });

                // Cerrar modal al hacer clic fuera del contenido del modal
                window.addEventListener("click", function(event) {
                    if (event.target === modal) {
                        modal.style.display = "none";
                    }
                });
            }
        })
        .catch(error => {
            console.error('Error al obtener los datos:', error);
        });
}
 

function openEditProjectModal(ProjectId) {
    // Hacer una solicitud al servidor para obtener los datos
    console.log(ProjectId);
    fetch('/project-manager/get-project-related?pid=' + ProjectId)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // Crear una nueva fila con el mensaje de no se encontraron proyectos relacionados
            var noDataMessage = "<tr><td colspan='5'>No se encontraron proyectos relacionados.</td></tr>";

            // Verificar si hay datos para mostrar
            if (!data.relatedModules) {
                // Limpiar la tabla
                $("#relatedProjectsFromMacroProjectsTable tbody").empty();
                // Agregar el mensaje de no se encontraron proyectos
                $("#relatedProjectsFromMacroProjectsTable tbody").append(noDataMessage);

                const startDate = data.projects.start_date.split(' ');
                const endDate = data.projects.end_date.split(' ');

                console.log(endDate , formatearFecha(endDate[0]));


                $("#editPModalTitle").text(`Project - #${data.projects.name}`);
                $("#editprojectform #editpModalprojectId").val(data.projects.id);
                $("#editprojectform #editpModalmacroprojectId").val(data.projects.macro_project_id);
                $("#editprojectform #projectName").val(data.projects.name);
                $("#editprojectform #name").val(data.projects.name);
                $("#editprojectform #projectCategory").val(data.projects.category);
                $("#editprojectform #description").text(data.projects.description);
                $("#editprojectform #indefinidoCheck").val(data.projects.undefined_time);

                $("#editprojectform #start_date").val(formatearFecha(startDate[0]));
                $("#editprojectform #start_time").val(formatearHora(data.projects.start_date));
                $("#editprojectform #end_date").val(formatearFecha(endDate[0]));
                $("#editprojectform #end_time").val(formatearHora(data.projects.end_date));
                $("#editprojectform #editProjectImage").attr("src", data.projects.project_pic);

            } else {

                const startDate = data.projects.start_date.split(' ');
                const endDate = data.projects.end_date.split(' ');

                console.log(endDate , formatearFecha(endDate[0]));


                $("#editPModalTitle").text(`Project - #${data.projects.name}`);
                $("#editprojectform #editpModalprojectId").val(data.projects.id);
                $("#editprojectform #editpModalmacroprojectId").val(data.projects.macro_project_id);
                $("#editprojectform #projectName").val(data.projects.name);
                $("#editprojectform #name").val(data.projects.name);
                $("#editprojectform #projectCategory").val(data.projects.category);
                $("#editprojectform #description").text(data.projects.description);
                $("#editprojectform #indefinidoCheck").val(data.projects.undefined_time);

                $("#editprojectform #start_date").val(formatearFecha(startDate[0]));
                $("#editprojectform #start_time").val(formatearHora(data.projects.start_date));
                $("#editprojectform #end_date").val(formatearFecha(endDate[0]));
                $("#editprojectform #end_time").val(formatearHora(data.projects.end_date));
                $("#editprojectform #editProjectImage").attr("src", data.projects.project_pic);

                // Si hay datos, limpiar la tabla antes de agregar nuevas filas
                $("#relatedProjectsFromMacroProjectsTable tbody").empty();
                // Agregar cada fila como lo estabas haciendo
                data.relatedModules.forEach(function(item) {
                    var newRow = $("<tr>");
                    newRow.append(`<td> <img class="table-icon-sm" src="${item.project_pic}">  <span class="table-title"> ${item.title}</span></td>`);
                    newRow.append(`<td> ${item.name}</td>`);
                    newRow.append(`<td> ${item.title}</td>`);
                    newRow.append(`<td> ${item.Genero}</td>`);
                    newRow.append(`<td> ${item.launch_date}</td>`);
                    newRow.append(`<td> ${item.performer}</td>`);
                    newRow.append(`<td> <a class="fa fa-trash mp-view" href="#"></a> <a class="fa fa-trash mp-view" href="#"></a> <a class="fa fa-trash mp-view" href="#"></a> </td>`);
                    $("#relatedProjectsFromMacroProjectsTable tbody").append(newRow);
                });
            }

            // Mostrar el modal después de haber agregado los datos a la tabla
            var modalId = 'editProjectModal';
            var modal = document.getElementById(modalId);
            if (modal) {
                fade(modal);
                modal.style.display = "block";
                // Cerrar modal al hacer clic en el botón de cierre
                modal.querySelector(".close").addEventListener("click", function() {
                    modal.style.display = "none";
                });

                // Cerrar modal al hacer clic fuera del contenido del modal
                window.addEventListener("click", function(event) {
                    if (event.target === modal) {
                        modal.style.display = "none";
                    }
                });
            }
        })
        .catch(error => {
            console.error('Error al obtener los datos:', error);
        });
}



function openEditMacroProjectModal(macroProjectId) {
    // Hacer una solicitud al servidor para obtener los datos
    fetch('/project-manager/get-macro-project-related?mpid=' + macroProjectId)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // Crear una nueva fila con el mensaje de no se encontraron proyectos relacionados
            var noDataMessage = "<tr><td colspan='5'>No se encontraron proyectos relacionados.</td></tr>";

            // Verificar si hay datos para mostrar
            if (!data.relatedProjects) {
                // Limpiar la tabla
                $("#relatedProjectsFromMacroProjectsTable tbody").empty();
                // Agregar el mensaje de no se encontraron proyectos
                $("#relatedProjectsFromMacroProjectsTable tbody").append(noDataMessage);

                $("#editMPModalTitle").text(`MacroProject - #${data.macroProjects.name}`);
                $("#editmacroprojectform #id").val(data.macroProjects.id);
                $("#editmacroprojectform #name").val(data.macroProjects.name);
                $("#editmacroprojectform #description").text(data.macroProjects.description);
                $("#editmacroprojectform #image").attr("src", data.macroProjects.macro_p_pic);

            } else {
                $("#editMPModalTitle").text(`MacroProject - #${data.macroProjects.name}`);
                $("#editmacroprojectform #id").val(data.macroProjects.id);
                $("#editmacroprojectform #name").val(data.macroProjects.name);
                $("#editmacroprojectform #description").text(data.macroProjects.description);
                $("#editmacroprojectform #image").attr("src", data.macroProjects.macro_p_pic);

                // Si hay datos, limpiar la tabla antes de agregar nuevas filas
                $("#relatedProjectsFromMacroProjectsTable tbody").empty();
                // Agregar cada fila como lo estabas haciendo
                data.relatedProjects.forEach(function(item) {
                    var newRow = $("<tr>");
                    newRow.append(`<td> <img class="table-icon-sm" src="${item.project_pic}">  <span class="table-title"> ${item.project_name}</span></td>`);
                    newRow.append(`<td> ${item.project_category}</td>`);
                    newRow.append(`<td> ${item.project_progress}</td>`);
                    newRow.append(`<td> ${item.project_members}</td>`);
                    newRow.append(`<td> <a class="fa fa-trash mp-view" href="#"></a> <a class="fa fa-trash mp-view" href="#"></a> <a class="fa fa-trash mp-view" href="#"></a> </td>`);
                    $("#relatedProjectsFromMacroProjectsTable tbody").append(newRow);
                });
            }

            // Mostrar el modal después de haber agregado los datos a la tabla
            var modalId = 'editMacroProjectModal';
            var modal = document.getElementById(modalId);
            if (modal) {
                fade(modal);
                modal.style.display = "block";
                // Cerrar modal al hacer clic en el botón de cierre
                modal.querySelector(".close").addEventListener("click", function() {
                    modal.style.display = "none";
                });

                // Cerrar modal al hacer clic fuera del contenido del modal
                window.addEventListener("click", function(event) {
                    if (event.target === modal) {
                        modal.style.display = "none";
                    }
                });
            }
        })
        .catch(error => {
            console.error('Error al obtener los datos:', error);
        });
}





function newObjectiveForm(data){
    const objetivesDetailContainer = document.getElementsByClassName("objectives");
  /* -------   */
const newObjetiveForm = document.getElementById("objetivesContent2");
const editObjetiveForm = document.getElementById("objetivesContent1");
const detailProject = document.getElementById("objetivesContent3");
const detailMacroProject = document.getElementById("objetivesContent4");
const initialObjetiveScreen = document.getElementById("objetivesContent5");
const objetiveScreen = document.getElementById("objetivesContent6");


    objetivesDetailContainer[0].innerHTML = newObjetiveForm.innerHTML;
    objetivesDetailContainer[0].style.display = "block";

     document.getElementById("content2ProjectName").value = data.Project_name;
     document.getElementById("content2ProjectId").value = data.Project_id;



};

function editObjectiveForm(data){
    const objetivesDetailContainer = document.getElementsByClassName("objectives");
  /* -------   */
const newObjetiveForm = document.getElementById("objetivesContent2");
const editObjetiveForm = document.getElementById("objetivesContent1");
const detailProject = document.getElementById("objetivesContent3");
const detailMacroProject = document.getElementById("objetivesContent4");
const initialObjetiveScreen = document.getElementById("objetivesContent5");
const objetiveScreen = document.getElementById("objetivesContent6");


    objetivesDetailContainer[0].innerHTML = editObjetiveForm.innerHTML;
    objetivesDetailContainer[0].style.display = "block";

        // Utiliza los atributos dataset del elemento clickeado
        document.getElementById("content1Id").value = data.id;
        document.getElementById("content1ProjectId").value = data.projectId;
        document.getElementById("content1ProjectName").value = data.projectName;
        document.getElementById("content1Name").value = data.name;
        document.getElementById("content1Status").option = data.status; 
        document.getElementById("content1Objective").value = data.target;
        document.getElementById("content1ObjectiveType").option = data.targetType; 
        document.getElementById("content1Description").value = data.description;



};
 function sendNewObjectiveForm() {
       const responseDiv = document.getElementById('response');

            const data = system.getFormData('newObjective');


            fetch(`/project-manager/new-objective/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                responseDiv.innerHTML = 'Valor actualizado: ' + data.id; // Actualizar el contenido con la respuesta del servidor
            })
            .catch(error => {
                responseDiv.innerHTML = ('Error:', error)
                console.error('Error:', error);
            });


openObjetivesModal();
          };


 function sendEditObjectiveForm() {
       const responseDiv = document.getElementById('response');

            id = document.getElementById("content1Id").value;

            const data = system.getFormData('editObjective');

            fetch(`/project-manager/edit-objective/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                responseDiv.innerHTML = 'Valor actualizado: ' + data.id; // Actualizar el contenido con la respuesta del servidor
            })
            .catch(error => {
                responseDiv.innerHTML = ('Error:', error)
                console.error('Error:', error);
            });


openObjetivesModal();

          };
          function deleteObjective(data) {
       const responseDiv = document.getElementById('response');
       console.log(data , parseInt(data.id));

            fetch(`/project-manager/delete-objective/${parseInt(data.id)}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                responseDiv.innerHTML = 'Valor actualizado: ' + parseInt(data.id); // Actualizar el contenido con la respuesta del servidor
            })
            .catch(error => {
                responseDiv.innerHTML = ('Error:', error)
                console.error('Error:', error);
            });

            
openObjetivesModal();

          };

           function setObjectiveOk(data) {
       const responseDiv = document.getElementById('response');
       console.log(data , parseInt(data.id));

            fetch(`/project-manager/Objetive-Ok/${parseInt(data.id)}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                responseDiv.innerHTML = 'Valor actualizado: ' + parseInt(data.id); // Actualizar el contenido con la respuesta del servidor
            })
            .catch(error => {
                responseDiv.innerHTML = ('Error:', error)
                console.error('Error:', error);
            });

            
openObjetivesModal();

          };

function openObjetivesModal() {
    const contenedorProyectos = document.getElementById('contenedor-proyectos');
    contenedorProyectos.innerHTML = '';

const objetivesDetailContainer = document.getElementsByClassName("objectives");
  /* -------   */
const newObjetiveForm = document.getElementById("objetivesContent2");
const editObjetiveForm = document.getElementById("objetivesContent1");
const detailProject = document.getElementById("objetivesContent3");
const detailMacroProject = document.getElementById("objetivesContent4");
const initialObjetiveScreen = document.getElementById("objetivesContent5");
const objetiveScreen = document.getElementById("objetivesContent6");



    // Hacer una solicitud al servidor para obtener los datos
    fetch('/project-manager/Objectives-data')
        .then(response => response.json())
        .then(data => {
            console.log(data);

            const objetivesDetailContainer = document.getElementsByClassName("objectives");

            objetivesDetailContainer[0].innerHTML = initialObjetiveScreen.innerHTML;
            objetivesDetailContainer[0].style.display = "block";

         data.forEach(macroporjecto => {
    const divMacroporjecto = document.createElement('div');
    divMacroporjecto.classList.add('macroporjecto');
    divMacroporjecto.textContent = macroporjecto.Macro_Project_name;

    const divProyectos = document.createElement('div');
    divProyectos.style.display = 'none';


    macroporjecto.Projects.forEach(proyecto => {
        const divProyecto = document.createElement('div');
        divProyecto.classList.add('proyecto');
        divProyecto.textContent = `Proyecto: ${proyecto.Project_name}`;


        const divObjetivos = document.createElement('div');
        divObjetivos.style.display = 'none';

        if (proyecto.Objectives[0].Objective_id) {
            proyecto.Objectives.forEach(objetivo => {
                const divObjetivo = document.createElement('div');
                divObjetivo.classList.add('objetivo');
                divObjetivo.dataset.id = objetivo.Objective_id;
                divObjetivo.dataset.projectId = objetivo.Objective_project_id;
                divObjetivo.dataset.projectName = objetivo.Objective_project_name;
                divObjetivo.dataset.name = objetivo.Objective_name;
                divObjetivo.dataset.status  = objetivo.Objective_status;
                divObjetivo.dataset.target = objetivo.Objective_target;
                divObjetivo.dataset.targetType  = objetivo.Objective_target_type;
                divObjetivo.dataset.description = objetivo.Objective_description;
                divObjetivo.textContent = `Objetivo: ${objetivo.Objective_name}`;
                divObjetivos.appendChild(divObjetivo);


           divObjetivos.addEventListener('click', (event) => {
    // Obtiene el elemento que disparó el evento
    const clickedElement = event.target;

    // Verifica que el elemento sea un div con la clase 'objetivo'
    if (clickedElement.classList.contains('objetivo')) {
        objetivesDetailContainer[0].innerHTML = objetiveScreen.innerHTML; /*editObjetiveForm.innerHTML;*/
        objetivesDetailContainer[0].style.display = "block";

        // Utiliza los atributos dataset del elemento clickeado
        document.getElementById("content6Project").textContent = clickedElement.dataset.projectName;
        document.getElementById("content6Name").textContent = clickedElement.dataset.name;
        document.getElementById("content6Status").textContent = clickedElement.dataset.status;
        document.getElementById("content6ObjectiveType").textContent = clickedElement.dataset.status; 
        document.getElementById("content6Objective").textContent = clickedElement.dataset.target;
        document.getElementById("content6ObjectiveType").textContent = clickedElement.dataset.targetType; 
        document.getElementById("content6Description").textContent = clickedElement.dataset.description;        
        document.getElementById("content6DeleteObjectiveBtn").onclick = () => deleteObjective({id: clickedElement.dataset.id});
        document.getElementById("content6SetObjectiveOkBtn").onclick = () => setObjectiveOk({id: clickedElement.dataset.id});
        document.getElementById("editObjectiveBtn").onclick = () => editObjectiveForm({
        id: clickedElement.dataset.id,
        projectName: clickedElement.dataset.projectName,
        projectid: clickedElement.dataset.projectId,
        name: clickedElement.dataset.name,
        status: clickedElement.dataset.status,
        target: clickedElement.dataset.target,
        targetType: clickedElement.dataset.targetType,
        description: clickedElement.dataset.description
    });


    }
});

            });

        } else {
            const divObjetivo = document.createElement('div');
            divObjetivo.classList.add('sin-objetivo');
            divObjetivo.textContent = 'Sin objetivos';
            divObjetivos.appendChild(divObjetivo);
        }

        divProyecto.addEventListener('dblclick', () => {
            if (divObjetivos.style.display === 'none') {
                divObjetivos.style.display = 'block';
                slideIn(divObjetivos);
            } else {
                divObjetivos.style.display = 'none';
            }
        });

        divProyecto.addEventListener('click', () => {
            objetivesDetailContainer[0].innerHTML = detailProject.innerHTML;
            objetivesDetailContainer[0].style.display = "block";


            document.getElementById("content3ProjectImage").src = proyecto.Project_pic;
            document.getElementById("content3ProjectName").textContent = proyecto.Project_name;
            document.getElementById("content3ProjectCategory").textContent = proyecto.Project_category;
            document.getElementById("content3ProjectStart").textContent = proyecto.Project_start_date;
            document.getElementById("content3ProjectEnd").textContent = proyecto.Project_end_date;
            document.getElementById("content3ProjectDescription").textContent = proyecto.Project_description;
            document.getElementById("newObjectiveBtn").onclick = () => newObjectiveForm(proyecto);


        });

        divProyectos.appendChild(divProyecto);
        divProyectos.appendChild(divObjetivos);
    });

    divMacroporjecto.addEventListener('dblclick', () => {
        if (divProyectos.style.display === 'none') {
            divProyectos.style.display = 'block';
            slideIn(divProyectos);
        } else {
            divProyectos.style.display = 'none';
        }
    });

    divMacroporjecto.addEventListener('click', () => {
        objetivesDetailContainer[0].innerHTML = detailMacroProject.innerHTML;
        objetivesDetailContainer[0].style.display = "block";

            document.getElementById("content4Image").src = macroporjecto.Macro_Project_pic;
            document.getElementById("content4Name").textContent = macroporjecto.Macro_Project_name;
            document.getElementById("content4Description").textContent = macroporjecto.Macro_Project_description;


    });

    contenedorProyectos.appendChild(divMacroporjecto);
    contenedorProyectos.appendChild(divProyectos);
});




            // Mostrar el modal después de haber agregado los datos a la tabla
            var modalId = 'objetivesModal';
            var modal = document.getElementById(modalId);
            if (modal) {
                modal.style.display = "block";
                // Cerrar modal al hacer clic en el botón de cierre
                modal.querySelector(".close").addEventListener("click", function() {
                    modal.style.display = "none";
                });

                // Cerrar modal al hacer clic fuera del contenido del modal
                window.addEventListener("click", function(event) {
                    if (event.target === modal) {
                        modal.style.display = "none";
                    }
                });
            }
        })
        .catch(error => {
            console.error('Error al obtener los datos:', error);
        });
}



document.addEventListener("DOMContentLoaded", function() {
//variables funcionales para formularios
  var macroProjectNowSelected = document.querySelector('.macro-project-item.selected');
  var projectNowSelected = document.querySelector('.project-item.selected');
  var moduleNowSelected = document.querySelector('.project-module-item.selected');
//variables funcionales para formularios


  var checkbox = document.getElementById("indefinidoCheck");
  var inputs = document.querySelectorAll(".date-input input");

  // Función para habilitar o deshabilitar los inputs
  function toggleInputs() {
    inputs.forEach(function(input) {
      input.disabled = checkbox.checked;
    });
  }

  // Evento change del checkbox
  checkbox.addEventListener("change", function() {
    toggleInputs();
  });

  // Llamada inicial a la función para que refleje el estado inicial del checkbox
  toggleInputs();
});

           



/* scroll asistant    -------++--+-+-+-+-+-+-+--+-++-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-*/
function scrollToElement(element) {
    var elementRect = element.getBoundingClientRect();
    var absoluteElementTop = elementRect.top + window.pageYOffset;
    var absoluteElementLeft = elementRect.left + window.pageXOffset;
    var middleVertical = absoluteElementTop - (window.innerHeight / 2);
    var middleHorizontal = absoluteElementLeft - (window.innerWidth / 2);

    // Guardar el valor original de boxShadow
    var origShadow = element.style.border;

    // Agregar una sombra coloreada
   // Restaurar el valor original de boxShadow después de 100ms (0.1s)
    setTimeout(function() {
    element.style.boxShadow = "0 0 100px 2px rgba(255, 0, 0, 0.2)";
    element.style.transition = "boxShadow ease in 0.5s";
      

    // Restaurar el valor original de boxShadow después de 100ms (0.1s)
    setTimeout(function() {
        
        element.style.transition = "boxShadow ease 0.2s";
        element.style.boxShadow = origShadow;
      
    }, 500); // 100ms = 0.1s
      
      
    }, 1000); // 100ms = 0.1s
      

    window.scrollTo({
        top: middleVertical,
        left: middleHorizontal,
        behavior: 'smooth'
    });
}



/* scroll asistant    -------++--+-+-+-+-+-+-+--+-++-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-*/

document.addEventListener('DOMContentLoaded', function() {
  const wizard = document.querySelector('.wizard');
  const steps = wizard.querySelectorAll('.step');
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
    // Implement finish logic
  }

  wizard.querySelector('.next').addEventListener('click', nextStep);
  wizard.querySelector('.prev').addEventListener('click', prevStep);
  wizard.querySelector('.finish').addEventListener('click', finish);

  showStep(currentStep);
});



// Obtener el elemento select y el body
const themeSelector = document.getElementById('theme-selector');
const body = document.body;

// Evento para cambiar el tema al seleccionar una opción del cuadro de lista
themeSelector.addEventListener('change', function() {
  const selectedTheme = themeSelector.value;
  if (selectedTheme === 'dark') {
    applyTheme('dark-theme');
  } else if (selectedTheme === 'light') {
    applyTheme('light-theme');
  } else if (selectedTheme === 'light-blue') {
    applyTheme('light-theme-blue');
  } else if (selectedTheme === 'light-pink') {
    applyTheme('light-theme-pink');
  } else if (selectedTheme === 'dark-ocean') {
    applyTheme('dark-theme-ocean');
  } else if (selectedTheme === 'hight-contrast') {
    applyTheme('hight-contrast-theme');
  } else if (selectedTheme === 'tech-theme') {
    applyTheme('tech-theme');
  } else if (selectedTheme === 'full-colored-theme') {
    applyTheme('full-colored-theme');
  } else if (selectedTheme === 'Animated') {
    applyTheme('animated-theme');
  }
});

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
  fade(body);
  body.classList.add(themeName);
  
}




function openTab(tabName) {
  var tabs = document.getElementsByClassName("tab-content");
  for (var i = 0; i < tabs.length; i++) {
    tabs[i].style.display = "none";
  }
  document.getElementById(tabName).style.display = "block";
}

document.getElementById('grid-view').addEventListener('click', function() {
    var moduleDetailContent = document.querySelector('.module-detail-content');
    moduleDetailContent.classList.remove('list-view');
    moduleDetailContent.classList.add('grid-view');
});

document.getElementById('list-view').addEventListener('click', function() {
    var moduleDetailContent = document.querySelector('.module-detail-content');
    moduleDetailContent.classList.remove('grid-view');
    moduleDetailContent.classList.add('list-view');
});

const sidebarTrigger = document.getElementById('sidebar-trigger');
  const sidebar = document.querySelector('.sidebar');
  const sidebarContainer = document.querySelector('.sidebar-container');

  sidebarTrigger.addEventListener('click', () => {
    if (sidebar.classList.contains('closed')) {
      sidebar.classList.remove('closed');
      sidebar.classList.add('opened');
      sidebarContainer.classList.remove('closed');
      sidebarContainer.classList.add('opened');
    } else {
      sidebar.classList.remove('opened');
      sidebar.classList.add('closed');
      sidebarContainer.classList.remove('opened');
      sidebarContainer.classList.add('closed');
    }
  });




// Aplicar tema inicialmente seleccionado
document.addEventListener('DOMContentLoaded', function() {
  const initialTheme = themeSelector.value;
  applyTheme(initialTheme);
  
  var sections = document.querySelectorAll('.inline-empty');

        sections.forEach(function(section) {
            section.classList.add('inline-loading');
        });


    var macroProjects = [];
    var macroProjectList = document.getElementById('macroProjectList');
    var macroProjectSelected = document.getElementById('macroProjectSelected');
    var projectList = document.getElementById('projectList');
    var projectSelected = document.getElementById('projectSelected');
    var projectModuleList = document.getElementById('projectModuleList');
    var projectModuleSelected = document.getElementById('projectModuleSelected');

    fetch('/project-manager/projects-data')
  .then(response => {
    if (!response.ok) {
      throw new Error('Error al obtener los datos.');
    }
    return response.json();
  })
  .then(data => {
    console.log(data);
    macroProjects = data; // Aquí puedes procesar los datos como lo necesites
  


    function renderMacroProjects(macroProjects, container) {
    container.innerHTML = '';
    macroProjects.forEach(macroProject => {
        var macroProjectItem = document.createElement('div');
        macroProjectItem.classList.add('macro-project-item');
        macroProjectItem.dataset.macroprojectId = macroProject.id;
        macroProjectItem.innerHTML = `
            <a class="fa fa-hammer mp-logo"></a>
            <span class="name">${macroProject.name}</span>
            <span class="actions">
                <button class="fa fa-edit mp-view" id="editMacroProjectModalBtn"  onclick="openEditMacroProjectModal(${macroProject.id});"></button>
                <a class="fa fa-trash mp-delete" href="project-manager/deletemacroproject?id=${macroProject.id}"></a>
            </span>
        `;


        macroProjectItem.addEventListener('dblclick', function() {          
            slideIn(macroProjectItem);
            var selectedMacroProject = document.querySelector('.macro-project-item.selected');
            var selectedProject = document.querySelector('.project-item.selected');
            var selectedModule = document.querySelector('.project-module-item.selected');   

           

            if (selectedMacroProject) {selectedMacroProject.classList.remove('selected');
              
                macroProjectList.appendChild(selectedMacroProject);
                renderProjects([], projectList);
                renderProjectModules([], projectModuleList);
            }

            if (selectedProject) {
                selectedProject.classList.remove('selected');
                projectList.appendChild(selectedProject);
                renderProjectModules([], projectModuleList);
            }

            if (selectedModule) {
                selectedModule.classList.remove('selected');
                projectModuleList.appendChild(selectedModule);
            }

            if (selectedMacroProject !== macroProjectItem) {
                macroProjectItem.classList.add('selected');
                macroProjectList.removeChild(macroProjectItem);
                macroProjectSelected.appendChild(macroProjectItem);
                renderProjects(macroProject.projects, projectList);
                renderProjectModules([], projectModuleList);
            } else {
                renderProjects([], projectList);
                renderProjectModules([], projectModuleList);
            }



        });
        container.appendChild(macroProjectItem);




    });

    if (!document.querySelector('.macro-project-item.selected')) {
        renderProjects([], projectList);
        renderProjectModules([], projectModuleList);
    }
}


    function renderProjects(projects, container) {
        container.innerHTML = '';
        projects.forEach(project => {
            var projectItem = document.createElement('div');
            projectItem.classList.add('project-item');
            projectItem.dataset.projectId = project.id;
            projectItem.innerHTML = `
                <a class="mp-logo"><img src="${project.project_pic}" alt="${project.name} image"></a>
                <span class="name">${project.name}</span>
                <span class="genre-label">${project.name_category}</span>
                <span class="short-description">${project.description}</span>
                <div class="project-progress-bar">
                    <span class="project-progress-bar-percent">${project.progress}%</span>
                    <span class="project-progress-bar-label">progress</span>
                    <div class="progress-bar-inner" style="width: ${project.progress}%;"></div>
                </div>
                <span class="days-left">${project.daysLefts}</span>
                <span class="actions">
                    <button class="fa fa-edit mp-view" id="editProjectModalBtn"  onclick="openEditProjectModal(${project.id});"></button>
                    <a class="fa fa-trash mp-delete" href="project-manager/deleteproject?id=${project.id}"></a>
                </span>
            `;

            var modulesContainer = document.createElement('div');
            modulesContainer.classList.add('project-modules');
            project.modules.forEach(pmodule => {
                var moduleItem = document.createElement('div');
                moduleItem.classList.add('project-module-item');
                moduleItem.innerHTML = `
                    <a class="fa fa-cogs mp-logo"></a>
                    <span class="name">${pmodule.name}</span>
                    <span class="actions">
                        <a class="fa fa-edit mp-view"></a>
                        <a class="fa fa-trash mp-delete"></a>
                    </span>
                `;
                modulesContainer.appendChild(moduleItem);
            });

            projectModuleList.appendChild(modulesContainer);

            projectItem.addEventListener('dblclick', function() {
                slideIn(projectItem);
                var selectedProject = document.querySelector('.project-item.selected');
                          var selectedModule = document.querySelector('.project-module-item.selected');
                if (selectedProject) {
                    selectedProject.classList.remove('selected');
                    projectList.appendChild(selectedProject);
                }
                if (selectedModule) {
                selectedModule.classList.remove('selected');
                projectModuleList.appendChild(selectedModule);
                }

                if (selectedProject !== projectItem) {
                    projectItem.classList.add('selected');
                    projectList.removeChild(projectItem);
                    projectSelected.appendChild(projectItem);
                    renderProjectModules(project.modules, projectModuleList);
                } else {
                    renderProjectModules([], projectModuleList);
                }
            });
            container.appendChild(projectItem);
        });

        if (projects.length === 0) {
            var selectedProject = document.querySelector('.project-item.selected');
            if (selectedProject) {
                selectedProject.classList.remove('selected');
                projectList.appendChild(selectedProject);
            }
        }
    }

    function renderProjectModules(modules, container) {
    container.innerHTML = '';
    modules.forEach(pmodule => {
        var moduleItem = document.createElement('div');
        moduleItem.classList.add('project-module-item');
        moduleItem.innerHTML = `
            <a class="fa fa-cogs mp-logo"></a>
            <span class="name">${pmodule.name}</span>
            <span class="actions">
                <button class="fa fa-edit mp-view" id="openeditProjectModuleModalBtn"  onclick="openEditProjectModuleModal(${pmodule.id});"></button>
                <a class="fa fa-trash mp-delete" href="project-manager/delete-module-from-project/?rwid=${pmodule.id}"></a>
            </span>
        `;
        moduleItem.addEventListener('dblclick', function() {
            slideIn(moduleItem);
            showModuleDetail(pmodule, moduleItem);
        });
        container.appendChild(moduleItem);
    });
}

function showModuleDetail(pmodule, moduleItem) {
    // Aquí puedes mostrar la vista detalle del módulo seleccionado
    var pmdname = document.getElementById('projectModuleDetailName');
    var pmddescription = document.getElementById('projectModuleDetailDescription');
    var pmdgenre = document.getElementById('projectModuleDetailGenre');
  
    pmdname.innerText = pmodule.name;
    pmddescription.innerText = pmodule.description;
    pmdgenre.innerText = pmodule.genre;
    // Puedes mostrarla en un div o en cualquier otro elemento de la página

    var selectedProjectModule = document.querySelector('.project-module-item.selected');
    if (selectedProjectModule) {
        selectedProjectModule.classList.remove('selected');
        projectModuleList.appendChild(selectedProjectModule);
    }

    moduleItem.classList.add('selected');
    projectModuleList.removeChild(moduleItem);
    projectModuleSelected.appendChild(moduleItem);

    console.log('Mostrar vista detalle del módulo:', pmodule);
}


    renderMacroProjects(macroProjects, macroProjectList);

   

    var sections = document.querySelectorAll('.inline-loading');
sections.forEach(function(section) {
    section.classList.remove('inline-loading');
    slideIn(section);
});


})
  .catch(error => {
    console.error(error);
  });
      
});




/* modals    -------++--+-+-+-+-+-+-+--+-++-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-*/
$(document).ready(function() {
  // Abrir modal al hacer clic en el botón
  $(".openModal").click(function() {
    var modalId = $(this).data("modal");
    $(modalId).fadeIn();
  });

  // Cerrar modal al hacer clic en el botón de cierre
  $(".modal .close").click(function() {
    $(this).closest(".modal").fadeOut();
  });

  // Cerrar modal al hacer clic fuera del contenido del modal
  $(window).click(function(event) {
    if ($(event.target).hasClass("modal")) {
      $(event.target).fadeOut();
    }
  });
});


/* modals    -------++--+-+-+-+-+-+-+--+-++-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-*/

$(document).ready(function() {
  $('.dropdown').hover(function() {
    $(this).find('.dropdown-content').stop(true, true).slideDown(200);
  }, function() {
    $(this).find('.dropdown-content').stop(true, true).slideUp(200);
  });
});


// Obtener el div por su ID
const modulecontainer = document.getElementById('moduleContainer');

// Agregar un listener de clic al div
modulecontainer.addEventListener('click', function() {
    // Redirigir al usuario a la URL
    window.location.href = "/app-selector";
});

// buscar dropdown activo cuando pasas el mouse sobre el botón
 document.getElementById('dropdownBtn').addEventListener('mouseenter', function() {
        var dropdowns = document.querySelectorAll('.dropdown-content');

        dropdowns.forEach(function(dropdown) {
            if (window.getComputedStyle(dropdown).display === 'block') {
                scrollToElement(dropdown);
            }
        });
    });

