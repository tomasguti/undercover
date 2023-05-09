import fs from 'fs';
import csv from 'csv-parser';
import { NextResponse } from 'next/server';

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
 
export async function GET() {
  const words = await loadWordsCSV();
  const pick = words[Math.floor(Math.random() * words.length)];

  return NextResponse.json(pick,
    {
      status: 200,
      headers: { 'cache-control': 'private, s-maxage=5, max-age=5, no-cache, no-store, must-revalidate' },
    },
  );
}
