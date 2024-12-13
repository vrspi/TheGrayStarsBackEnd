import mysql from 'mysql2/promise';

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

async function addDisplayOrder() {
  const connection = await pool.getConnection();
  try {
    console.log('Adding display_order column...');

    await connection.query(`
      ALTER TABLE music 
      ADD COLUMN display_order INT DEFAULT 0 
      AFTER cover_image_url
    `);

    console.log('Column added successfully');
  } catch (error) {
    console.error('Error adding column:', error);
  } finally {
    connection.release();
    await pool.end();
  }
}

addDisplayOrder()
  .then(() => {
    console.log('Migration completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
