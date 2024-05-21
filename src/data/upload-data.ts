import { clientSchema } from '../models/upload-models';
import { parse } from 'csv-parse';
import fs from 'fs';

export async function processCSV(filePath: string): Promise<{ success: any[], errors: any[] }> {
  const parser = parse({ columns: true });
  const results: any[] = []; // Variable para almacenar los datos (con [] para el push)
  const errors: any[] = []; // Variable para almacenar los errores (con [] para el push)
  let rowNumber = 0; // Variable para llevar el número de fila

  return new Promise((resolve, reject) => { //promesa para retornar los datos
    fs.createReadStream(filePath) //lee el archivo desde filePath que es la ruta del archivo csv
      .pipe(parser) //pipe para procesar el archivo y convertirlo a json
      .on('data', (data) => {
        rowNumber++; // Incrementa el número de fila para cada nueva fila
        try {
          data.age = Number(data.age); // Convierte la edad a un número entero
          const parsedData = clientSchema.parse(data); // Convierte los datos a un formato válido desde zod
          results.push(parsedData); // Agrega los datos al arreglo de resultados
        } catch (error: any) { // Captura los errores y los agrega al arreglo de errores
          errors.push({ row: rowNumber, details: error.errors }); // Agrega el número de fila y los detalles de error
        }
      })
      .on('error', (error) => { // Captura los errores
        reject(error); // Rechaza la promesa con el error
      })
      .on('end', () => {
        resolve({ success: results, errors }); // Resuelve la promesa con los datos y los errores
      });
  });
}