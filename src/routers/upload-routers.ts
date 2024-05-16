import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { authenticateHandler } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize'; // Asegúrate de importar tus middlewares correctamente
import { processCSV } from '../data/upload-data'; // Importa tus servicios y funciones correctamente
import * as db from '../db'; // Asegúrate de que tu módulo de base de datos esté importado correctamente
import { truncateTable } from '../db/utils';

const uploadRouter = express.Router();

uploadRouter.post('/upload', authenticateHandler, authorize('admin'), async (req: Request, res: Response) => {
  const filePath = path.join(__dirname, '../services/archivo.csv');
  if (!fs.existsSync(filePath)) {
    return res.status(500).json({ ok: false, error: 'El archivo no existe' });
  }

  try {
    const { success, errors } = await processCSV(filePath);

    // Inserta los usuarios válidos en la base de datos
    await truncateTable('client');
    for (const user of success) {
      await db.query(
        'INSERT INTO client (name, email, age) VALUES ($1, $2, $3)',
        [user.name, user.email, user.age]
      );
    }

    const formattedErrors = errors.map((error: any) => {
      const errorFields: any = {};
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
          details: 'Unknown error',
          rowNumber: error.rowNumber
        };
      }
    });

    return res.json({ ok: true, data: { success, errors: formattedErrors } });
  } catch (error) {
    console.error('Error processing CSV file:', error);
    return res.status(500).json({ ok: false, error: 'Error processing CSV file: check the file and try again' });
  }
});

export default uploadRouter;
