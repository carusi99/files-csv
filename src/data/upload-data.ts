import { Client, clientSchema } from '../models/upload-models';
import { parse } from 'csv-parse';
import fs from 'fs';
import * as db from '../db';

export async function processCSV(filePath: string): Promise<{ success: any[], errors: any[] }> {
  const parser = parse({ columns: true });
  const results: any[] = [];
  const errors: any[] = [];
  let rowNumber = 0; // Variable para llevar el número de fila
