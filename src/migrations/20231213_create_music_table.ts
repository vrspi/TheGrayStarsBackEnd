import pool from '../config/database';

async function runMigration() {
  const connection = await pool.getConnection();
  try {
    console.log('Running music table migration...');

    await connection.query(`
      CREATE TABLE IF NOT EXISTS music (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        album VARCHAR(255),
        release_date DATE,
        duration VARCHAR(10),
        track_url VARCHAR(1024) NOT NULL,
        cover_image_url VARCHAR(1024),
        lyrics TEXT,
        display_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    console.log('Music table migration completed successfully');
  } catch (error) {
    console.error('Error running music table migration:', error);
    throw error;
  } finally {
    connection.release();
  }
}

export default runMigration;
