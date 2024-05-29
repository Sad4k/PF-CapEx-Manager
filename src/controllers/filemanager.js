// src/controllers/fileController.js
const fs = require('fs');
//const fs = require('fs').promises;
const path = require('path');
const multer = require('multer');
const configFilePath = path.join(__dirname, '../../config/Config.json');
//const config = require('../../config/config.js');
//const db = require('../../config/database'); // Ajusta la ruta según la ubicación de tu archivo de configuración de la base de datos

// ###################################### Gestion de Configuracion ################################################//
const configure = {
  saveConfig: async (config, callback) => {
    try {
      let configs = {};

      // Leer el archivo existente, si existe
      if (fs.existsSync(configFilePath)) {
        const rawData = await fs.promises.readFile(configFilePath, 'utf8');
        configs = JSON.parse(rawData);
        console.log("el archivo existe");
      }

      // Actualizar la configuración
      Object.assign(configs, config);
      // Crear el directorio si no existe
      await fs.promises.mkdir(path.dirname(configFilePath), { recursive: true });

      // Escribir las configuraciones actualizadas en el archivo
      await fs.promises.writeFile(configFilePath, JSON.stringify(configs, null, 2), 'utf8');
      console.log("configuracion actualizada", configs);

      callback(null, 'Configuración guardada correctamente.');
    } catch (err) {
      callback(err);
    }
  },

  readConfig: (callback) => {
    if (!fs.existsSync(configFilePath)) {
      return callback(new Error('El archivo de configuración no existe.'));
    }

    const rawData = fs.readFileSync(configFilePath);
    const configs = JSON.parse(rawData);

    callback(null, configs);
  }
};
// ###################################### Gestion de Configuracion ################################################//

const rootProjectsPath = '/media/sad4k/PROYECTOS';
// ###################################### Subida de Archivos Con Multer ################################################//

// Configura la ubicación y el nombre del archivo
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/media/sad4k/PROJECT-AUTOMATE/InputFolders/Uploaded'); // Cambia la ruta a tu carpeta de destino
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// Crea el middleware de carga utilizando multer
const upload = multer({ storage: storage });

// -------------------------------------------------------------------------------------- Almacenamiento de imagenes de los proyectos ----------------------------------------------------------------------
// Configurar almacenamiento para el primer tipo de archivo
const storage1 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/var/www/projectflow_nodejs/assets/images/projects');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// Crear middleware de carga para el primer tipo de archivo
const projectsImageStorage = multer({ storage: storage1 });

// -------------------------------------------------------------------------------------- Almacenamiento de imagenes de los proyectos ----------------------------------------------------------------------

// Configurar almacenamiento para el segundo tipo de archivo
const storage2 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/ruta/a/ubicacion/2');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// Crear middleware de carga para el segundo tipo de archivo
const upload2 = multer({ storage: storage2 });

// ###################################### Subida de Archivos Con Multer ################################################//

// ###################################### funciones recursivas ################################################//

// Obtener el tipo de archivo según la extensión
async function getFileType(filename) {
  //try {
  //  const extension = filename.split('.').pop().toLowerCase();
  //  const query = 'SELECT type FROM document_types WHERE extension = :extension';
  //  const result = await db.query(query, { replacements: { extension }, type: db.QueryTypes.SELECT });
  //  return result[0] ? type || 'Unknown' : '';
  //  } catch (error) {
  //  console.error(error);
  //  throw new Error('Error al obtener el tipo de archivo');
  //}
  result = 'Unknown';
  return result;
}
// Función para obtener la categoría de un archivo basado en su extensión desde la base de datos
async function getCategoriaByExtension(extension) {
  try {
    // Realiza una consulta a la base de datos para obtener la categoría según la extensión
    const query =
      'SELECT category FROM document_types WHERE extension = ' +
      "'" +
      extension +
      "' ";
    const result = await db.query(query, { type: db.QueryTypes.SELECT });

    // Si se encontró una categoría correspondiente, devuélvela
    if (result && result.length > 0) {
      return result[0].categoria;
    }

    // Si no se encontró ninguna categoría, devuelve un valor por defecto o maneja el caso según tus necesidades
    return 'Otra categoría';
  } catch (error) {
    console.error('Error al obtener la categoría del archivo:', error);
    throw new Error('Error al obtener la categoría del archivo');
  }
}
//file formater
function formatFileSize(sizeInBytes) {
  const kiloByte = 1024;
  const megaByte = kiloByte * 1024;
  const gigaByte = megaByte * 1024;

  if (sizeInBytes < kiloByte) {
    return `${sizeInBytes} B`;
  } else if (sizeInBytes < megaByte) {
    const sizeInKB = (sizeInBytes / kiloByte).toFixed(2);
    return `${sizeInKB.replace('.', ',')} KB`;
  } else if (sizeInBytes < gigaByte) {
    const sizeInMB = (sizeInBytes / megaByte).toFixed(2);
    return `${sizeInMB.replace('.', ',')} MB`;
  } else {
    const sizeInGB = (sizeInBytes / gigaByte).toFixed(2);
    return `${sizeInGB.replace('.', ',')} GB`;
  }
}

// Función recursiva para obtener los children de un directorio
const getChildren = (directoryPath) => {
  const elements = fs.readdirSync(directoryPath);
  const children = [];

  elements.forEach((element) => {
    const elementPath = path.join(directoryPath, element);
    const stats = fs.statSync(elementPath);
    const fileType = getFileType(element);

    const child = {
      name: element,
      path: elementPath,
      directory: stats.isDirectory(),
      size: formatFileSize(stats.size),
      type: fileType,
      children: [],
    };

    if (stats.isDirectory()) {
      // Obtener los children del directorio
      child.children = getChildren(elementPath);
    }

    children.push(child);
  });

  return children;
};

// ###################################### funciones recursivas ################################################//

// ###################################### Gestion de Archivos y Carpetas de Proyectos ################################################//

/* Diagrama de creacion
mi-proyecto/
│
├── audio/                   // Archivos de audio generados por el proyecto
│
├── video/                   // Archivos de video generados por el proyecto
│
├── imagenes/                // Imágenes generadas por el proyecto
│
├── documentos/              // Documentos generados por el proyecto, como guiones, informes, etc.
│
├── diseños/                 // Archivos de diseño generados por el proyecto, como bocetos, mockups, etc.
│
├── promocion/               // Archivos relacionados con la promoción y marketing del proyecto
│   ├── material_promocional/    // Material promocional generado por el proyecto
│   └── contenido_social_media/  // Contenido para redes sociales generado por el proyecto
│
├── produccion/              // Archivos relacionados con la producción del proyecto
│   ├── grabaciones/         // Grabaciones generadas por el proyecto
│   ├── sesiones/            // Sesiones generadas por el proyecto
│   └── otros/               // Otros archivos generados por el proyecto durante la producción
│
├── distribucion/            // Archivos relacionados con la distribución del proyecto
│   ├── versiones/           // Versiones finales del proyecto para distribución
│   └── materiales_promocionales/  // Materiales promocionales para distribución generados por el proyecto
│
└── producciones_terminadas/  // Producciones pulidas y terminadas
*/
const projectFilemanager = {
  // Función para crear la estructura de carpetas del proyecto
  crearEstructuraProyecto: async function (nombreProyecto) {
    const rutaProyecto = path.join(rootProjectsPath, nombreProyecto);

    console.log(`DatosEnFuncion: ${rutaProyecto}  -- ${nombreProyecto}`);

    try {
      await fs.promises.mkdir(rutaProyecto);

      const estructuraCarpetas = [
        'Audio',
        'Video',
        'Imagenes',
        'Documentos',
        'Diseños',
        'Promocion/material_promocional',
        'Promocion/contenido_social_media',
        'Produccion/grabaciones',
        'Produccion/sesiones',
        'Produccion/otros',
        'Distribucion/versiones',
        'Distribucion/materiales_promocionales',
        'Producciones_terminadas',
      ];

      await Promise.all(
        estructuraCarpetas.map(async (carpeta) => {
          const carpetaCompleta = path.join(rutaProyecto, carpeta);
          await fs.promises.mkdir(carpetaCompleta, { recursive: true });
          console.log(`Carpeta creada: ${carpetaCompleta}`);
        })
      );

      return 'Estructura de carpetas del proyecto creada con éxito';
    } catch (error) {
      // Si la carpeta ya existe, retornamos un mensaje indicándolo
      if (error.code === 'EEXIST') {
        return 'La estructura de carpetas del proyecto ya existe';
      }

      console.error(
        'Error al crear la estructura de carpetas del proyecto:',
        error
      );
      throw new Error('Error al crear la estructura de carpetas del proyecto');
    }
  },
};

// ###################################### Gestion de Archivos y Carpetas de Proyectos ################################################//

const localfiles = {
  // Obtener la lista de archivos del directorio
  getInputFolders: async (req, res) => {
    const directoryPath = '/media/sad4k/PROJECT-AUTOMATE/InputFolders'; // Reemplaza con la ruta de tu directorio

    try {
      const elements = fs.readdirSync(directoryPath);
      const fileDetails = [];

      for (const element of elements) {
        const elementPath = path.join(directoryPath, element);
        const stats = fs.statSync(elementPath);
        let fileType = 'Unknown';
        let categ = 'Unknown';

        if (stats.isDirectory()) {
          fileType = 'Directory';
        } else {
          //fileType = await getFileType(element);
        }
        //categ = await getCategoriaByExtension(fileType);

        const fileDetail = {
          name: element,
          path: elementPath,
          directory: stats.isDirectory(),
          size: formatFileSize(stats.size),
          type: 'Unknown', //fileType,
          category: 'Unknown', //categ,
          children: [],
        };

        if (stats.isDirectory()) {
          // Obtener los children del directorio
          fileDetail.children = getChildren(elementPath);
        }

        fileDetails.push(fileDetail);
      }

      return fileDetails;
    } catch (error) {
      console.error('Error al obtener los archivos del directorio:', error);
      showdanger('top', 'center', { error });
    }
  },
};



module.exports = {
  localfiles,
  upload,
  projectFilemanager,
  projectsImageStorage,
  configure,
};
