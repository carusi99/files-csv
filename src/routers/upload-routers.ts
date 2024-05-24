import express from 'express';
import fs from 'fs';
import { authenticateHandler } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { processCSV } from '../data/upload-data';
import * as db from '../db';
import upload from '../middlewares/multer';
// import { truncateTable } from '../db/utils';

const uploadRouter = express.Router(); 

uploadRouter.post('/upload', authenticateHandler, authorize('admin'), upload.single('csvFile'), async (req, res) => {
  if (!req.file) { 
    return res.status(400).json({ ok: false, error: 'No file provided' });
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
      console.log('Inserting new data...');
      const values = success.map((user) => `('${user.name}', '${user.email}', ${user.age})`).join(', ');
      const query = `INSERT INTO client (name, email, age) VALUES ${values} RETURNING id, name, email, age`;
      const insertUsers = await db.query(query);

      await db.query('COMMIT'); // Confirmar la transacción para insertar los datos
      console.log('Data inserted correctly');

      const formattedErrors = errors.map((error) => { 
        const errorFields: { [key: string]: string } = {}; 
        if (error && error.details) { 
          const errorDetails = error.details;
          errorDetails.forEach((detail: any) => { 
            if (detail.path) { // Verifica que el detalle tenga un path para saber si es un campo de error
              errorFields[detail.path[0]] = detail.message; 
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

      return res.json({ ok: true, data: { success: insertUsers.rows, errors: formattedErrors } }); 
    } catch (dbError) {
      console.error('Error inserting data into database:', dbError); 
      throw dbError;
    }
  } catch (error) { // Captura los errores de procesamiento del archivo CSV
    console.error('Error processing CSV file:', error);
    return res.status(500).json({ ok: false, error: 'Error processing CSV file: data cannot be repeated or incorrect format' }); 
  }
});

export default uploadRouter;
