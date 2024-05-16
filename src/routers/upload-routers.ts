import express from 'express';
import { processCSV } from '../data/upload-data';
import { authenticateHandler } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import * as db from '../db';
import { truncateTable } from '../db/utils';
const path = require('path');
const fs = require('fs');

const uploadRouter = express.Router();


uploadRouter.post('/upload', authenticateHandler, authorize('admin'), async (req, res) => {
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
      if (error && error.details) {
        const errorDetails = error.details;
        const errorFields: any = {};
    
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
      }
    });

    res.json({ ok: true, data: { success, errors: formattedErrors } });
  } catch (error) {
    console.error('Error processing CSV file:', error);
    res.status(500).json({ ok: false, error: 'Error processing CSV file: check the file and try again' });
  }
});

export default uploadRouter;
