import fs from 'fs';
import path from 'path';
import pool from '../config/database';
import { RowDataPacket } from 'mysql2/promise';

interface MigrationRow extends RowDataPacket {
  name: string;
}

async function migrate() {
  const connection = await pool.getConnection();
  try {
    // Create migrations table if it doesn't exist
    await connection.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Get list of executed migrations
    const [executedMigrations] = await connection.query<MigrationRow[]>('SELECT name FROM migrations');
    const executedMigrationNames = new Set(executedMigrations.map(row => row.name));

    // Read migration files
    const migrationsDir = path.join(__dirname, 'migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    // Execute new migrations
    for (const file of migrationFiles) {
      if (!executedMigrationNames.has(file)) {
        console.log(`Executing migration: ${file}`);
        const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
        
        // Split SQL file into individual statements
        const statements = sql.split(';').filter(stmt => stmt.trim());
        
        // Execute each statement
        for (const statement of statements) {
          if (statement.trim()) {
            await connection.query(statement);
          }
        }

        // Record migration execution
        await connection.query('INSERT INTO migrations (name) VALUES (?)', [file]);
        console.log(`Migration completed: ${file}`);
      } else {
        console.log(`Skipping already executed migration: ${file}`);
      }
    }

    console.log('All migrations completed successfully');
  } catch (error) {
    console.error('Error executing migrations:', error);
    throw error;
  } finally {
    connection.release();
    process.exit(0);
  }
}

// Execute migrations
migrate().catch(error => {
  console.error('Migration failed:', error);
  process.exit(1);
}); 