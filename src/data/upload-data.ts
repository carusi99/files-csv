import { clientSchema } from "../models/upload-models";
import { parse } from "csv-parse";
import fs from "fs";

export async function processCSV(
  filePath: string
): Promise<{ success: any[]; errors: any[] }> {
  const parser = parse({ columns: true });
  const results: any[] = [];
  const errors: any[] = [];
  let rowNumber = 0;

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath) //lee el archivo desde filePath que es la ruta del archivo csv
      .pipe(parser) //pipe para procesar el archivo y convertirlo a json
      .on("data", (data) => {
        rowNumber++;
        try {
          data.age = Number(data.age);
          const parsedData = clientSchema.parse(data); // Convierte los datos a un formato válido desde zod
          results.push(parsedData); // Agrega los datos al arreglo de resultados
        } catch (error: any) {
          errors.push({ row: rowNumber, details: error.errors });
        }
      })
      .on("error", (error) => {
        reject(error);
      })
      .on("end", () => {
        resolve({ success: results, errors }); // Resuelve la promesa con los datos y los errores
      });
  });
}
