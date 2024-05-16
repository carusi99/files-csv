import { Client, clientSchema } from '../models/upload-models';
import { parse } from 'csv-parse';
import fs from 'fs';

export async function processCSV(filePath: string): Promise<{ success: any[], errors: any[] }> {
  const parser = parse({ columns: true });
  const results: any[] = [];
  const errors: any[] = [];
  let rowNumber = 0; // Variable para llevar el número de fila

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(parser)
      .on('data', (data) => {
        rowNumber++; // Incrementa el número de fila para cada nueva fila
        try {
          data.age = Number(data.age);
          const parsedData = clientSchema.parse(data);
          results.push(parsedData);
        } catch (error: any) {
          errors.push({ row: rowNumber, details: error.errors });
        }
      })
      .on('error', (error) => {
        reject(error);
      })
      .on('end', () => {
        resolve({ success: results, errors });
      });
  });
}