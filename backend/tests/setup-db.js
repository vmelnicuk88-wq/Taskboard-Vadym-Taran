const mysql = require('mysql2/promise');
const fs = require('node:fs');
const path = require('node:path');

async function main() {
  const sql = fs.readFileSync(path.join(__dirname, '../../database/taskboard.sql'), 'utf8');
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    multipleStatements: true
  });
  try {
    await connection.query(sql);
    console.log('Testowa baza TaskBoard gotowa.');
  } finally {
    await connection.end();
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
