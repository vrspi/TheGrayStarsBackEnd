import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

const pool = mysql.createPool({
  host: '212.1.209.223',
  port: 3306,
  database: 'u669885128_uZsNT',
  user: 'u669885128_Deb9t',
  password: 'Loulouta159',
  ssl: {
    rejectUnauthorized: false
  }
});

async function runMigration() {
  const connection = await pool.getConnection();
  try {
    console.log('Running music table migration...');

    const migrationPath = path.join(__dirname, '20231213_create_music_table.sql');
    const migrationSql = fs.readFileSync(migrationPath, 'utf8');

    await connection.query(migrationSql);
    console.log('Music table migration completed successfully');
  } catch (error) {
    console.error('Error running migration:', error);
    throw error;
  } finally {
    connection.release();
    await pool.end();
  }
}

runMigration()
  .then(() => {
    console.log('Migration completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
