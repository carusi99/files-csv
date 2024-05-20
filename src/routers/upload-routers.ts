import express from 'express';
import multer from 'multer';
import fs from 'fs';
import { unlinkSync } from 'fs';
import { authenticateHandler } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { processCSV } from '../data/upload-data';
import * as db from '../db';
// import { truncateTable } from '../db/utils';

const uploadRouter = express.Router();

// Configuración de Multer para subir archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directorio donde se guardarán los archivos subidos
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Nombre del archivo guardado
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'text/csv') {
      return cb(new Error('Solo se permiten archivos CSV'));
    }
    cb(null, true);
  }
});

uploadRouter.post('/upload', authenticateHandler, authorize('admin'), upload.single('csvFile'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ ok: false, error: 'No se ha proporcionado ningún archivo' });
  }

  const filePath = req.file.path; // Ruta al archivo CSV

  try {
    if (!fs.existsSync(filePath)) {
      return res.status(500).json({ ok: false, error: 'El archivo no existe' });
    }

    const { success, errors } = await processCSV(filePath);

    console.log('Datos procesados:', success); // Log para verificar los datos procesados

    await db.query('BEGIN'); // Iniciar una transacción para insertar datos
    try {
      // await truncateTable('client'); // Asegúrate de que esta función esté funcionando correctamente
      console.log('Tabla truncada. Insertando nuevos datos...');

      const values = success.map((user) => `('${user.name}', '${user.email}', ${user.age})`).join(', ');
      const query = `INSERT INTO client (name, email, age) VALUES ${values} RETURNING id, name, email, age`;
      const insertUsers = await db.query(query);

      await db.query('COMMIT');
      console.log('Datos insertados correctamente.');

      const formattedErrors = errors.map((error) => {
        const errorFields: { [key: string]: string } = {};
        if (error && error.details) {
          const errorDetails = error.details;
          errorDetails.forEach((detail: any) => {
            if (detail.path) {
              errorFields[detail.path[0]] = detail.message;
            }
          });
  

          return {
            row: error.row,
            details: errorFields,
            rowNumber: error.rowNumber
          };
        } else {
          return {
            row: error.row,
            details: 'Error desconocido',
            rowNumber: error.rowNumber
          };
        }
      });

  

      return res.json({ ok: true, data: { success: insertUsers.rows, errors: formattedErrors } });
    } catch (dbError) {
      await db.query('ROLLBACK');
      console.error('Error al insertar datos en la base de datos:', dbError);
      throw dbError;
    }
  } catch (error) {
    console.error('Error al procesar el archivo CSV:', error);
    if (req.file) {
      unlinkSync(req.file.path);
    }
    return res.status(500).json({ ok: false, error: 'Error al procesar el archivo CSV: revisa el archivo e intenta de nuevo' });
  }
});

export default uploadRouter;
