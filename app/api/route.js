import { NextResponse } from 'next/server';
import fs from 'fs';
import csv from 'csv-parser';

function loadWordsCSV() {
  return new Promise((resolve) => {
    const rows = [];
    fs.createReadStream('./public/words.csv')
      .pipe(csv())
      .on('data', (row) => {
        rows.push(row);
      })
      .on('end', () => {
        resolve(rows);
      });
  });
}
 
export async function GET(request) {
  const words = await loadWordsCSV();
  const pick = words[Math.floor(Math.random() * words.length)];
  return NextResponse.json(pick);
}
