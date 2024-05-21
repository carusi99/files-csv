import express from 'express';
import multer from 'multer';
import fs from 'fs';
import { unlinkSync } from 'fs';
import { authenticateHandler } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { processCSV } from '../data/upload-data';
import * as db from '../db';
// import { truncateTable } from '../db/utils';

const uploadRouter = express.Router(); // Crea un enrutador para subir archivos
const storage = multer.diskStorage({ // Configura el almacenamiento de archivos en disco para Multer
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directorio donde se guardarán los archivos subidos
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Nombre del archivo guardado en el directorio destino de Multer
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'text/csv') { // Verifica que el archivo sea un archivo CSV
      return cb(new Error('Only CSV files allowed'));
    }
    cb(null, true);
  }
});

uploadRouter.post('/upload', authenticateHandler, authorize('admin'), upload.single('csvFile'), async (req, res) => {
  if (!req.file) { // Verifica que se haya proporcionado un archivo
    return res.status(400).json({ ok: false, error: '' });
  }

  const filePath = req.file.path; // Ruta al archivo CSV
  try {
    if (!fs.existsSync(filePath)) {
      return res.status(500).json({ ok: false, error: 'The file does not exists' });
    }
    const { success, errors } = await processCSV(filePath);
    console.log('Processed data:', success); // Log para verificar los datos procesados
    await db.query('BEGIN'); // Iniciar una transacción para insertar datos
    try {
      // await truncateTable('client'); //Limpia la tabla antes de insertar los datos
      console.log('Truncated table. Inserting new data...');
      const values = success.map((user) => `('${user.name}', '${user.email}', ${user.age})`).join(', ');
      const query = `INSERT INTO client (name, email, age) VALUES ${values} RETURNING id, name, email, age`;
      const insertUsers = await db.query(query);

      await db.query('COMMIT'); // Confirmar la transacción para insertar los datos
      console.log('Data inserted correctly');

      const formattedErrors = errors.map((error) => { // Formatea los errores de validación para enviarlos en la respuesta
        const errorFields: { [key: string]: string } = {}; // Crea un objeto para almacenar los campos de error 
        if (error && error.details) {  // Verifica que el error tenga detalles 
          const errorDetails = error.details; // Obtiene los detalles del error
          errorDetails.forEach((detail: any) => { // Itera sobre los detalles 
            if (detail.path) { // Verifica que el detalle tenga un path para saber si es un campo de error
              errorFields[detail.path[0]] = detail.message; // Agrega el campo de error al objeto de campos de error
            }
          });
          return {  // Retorna el objeto de error formateado
            row: error.row,
            details: errorFields,
            rowNumber: error.rowNumber
          };
        } else { // Si el error no tiene detalles
          return {
            row: error.row,
            details: 'Unknown error',
            rowNumber: error.rowNumber
          };
        }
      });

      return res.json({ ok: true, data: { success: insertUsers.rows, errors: formattedErrors } }); // Retorna los datos insertados y los errores
    } catch (dbError) {
      await db.query('ROLLBACK'); // Rechazar la transacción para insertar los datos si hay un error 
      console.error('Error inserting data into database:', dbError); // Log para verificar el error de inserción
      throw dbError;
    }
  } catch (error) { // Captura los errores de procesamiento del archivo CSV
    console.error('Error processing CSV file:', error);
    if (req.file) {
      unlinkSync(req.file.path); // Elimina el archivo subido si hay un error en el procesamiento
    }
    return res.status(500).json({ ok: false, error: 'Error processing CSV file: data cannot be repeated or incorrect format' }); 
  }
});

export default uploadRouter;
