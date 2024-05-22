/* Cargar configuracion de usuario*/




/* Cargar configuracion de usuario*/
/* Sistema Funcionalidades */
const system = {
getFormData: function(formId) {
    const form = document.getElementById(formId);
    const formData = new FormData(form);
    const formDataObject = {};

    for (const [key, value] of formData.entries()) {
        formDataObject[key] = value;
    }

    return formDataObject;
}
};

const convert = {
getFormData: function(formId) {
    const form = document.getElementById(formId);
    const formData = new FormData(form);
    const formDataObject = {};

    for (const [key, value] of formData.entries()) {
        formDataObject[key] = value;
    }

    return formDataObject;
}
};
/* Sistema Funcionalidades */


