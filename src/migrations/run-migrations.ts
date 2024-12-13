import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function runMigrations() {
  const connection = await mysql.createConnection({
    host: '212.1.209.223',
    port: 3306,
    user: 'u669885128_Deb9t',
    password: 'Loulouta159',
    database: 'u669885128_uZsNT'
  });

  try {
    console.log('Running migrations...');

    // Read and execute the schema SQL
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    // Split the SQL file into individual statements
    const statements = schemaSql
      .split(';')
      .filter(statement => statement.trim().length > 0);

    // Execute each statement
    for (const statement of statements) {
      try {
        await connection.query(statement + ';');
        console.log('Successfully executed:', statement.slice(0, 50) + '...');
      } catch (error) {
        console.error('Error executing statement:', statement);
        console.error('Error details:', error);
        throw error;
      }
    }

    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Error running migrations:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

// Run migrations
runMigrations().catch(error => {
  console.error('Error running migrations:', error);
  process.exit(1);
});
