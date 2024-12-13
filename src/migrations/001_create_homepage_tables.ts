import pool from '../config/database';
import fs from 'fs';
import path from 'path';

async function runMigration() {
  const connection = await pool.getConnection();
  try {
    console.log('Running homepage tables migration...');

    // Read and execute the schema SQL
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    // Split the SQL file into individual statements
    const statements = schemaSql
      .split(';')
      .filter(statement => statement.trim().length > 0);

    // Execute each statement
    for (const statement of statements) {
      await connection.query(statement + ';');
    }

    console.log('Homepage tables migration completed successfully');
  } catch (error) {
    console.error('Error running homepage tables migration:', error);
    throw error;
  } finally {
    connection.release();
  }
}

// Run the migration
runMigration().catch(console.error);
