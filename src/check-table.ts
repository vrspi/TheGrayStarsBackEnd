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

async function checkTable() {
  const connection = await pool.getConnection();
  try {
    console.log('Checking music table structure...');

    const [rows] = await connection.query('DESCRIBE music');
    console.log('Table structure:', rows);

  } catch (error) {
    console.error('Error checking table:', error);
  } finally {
    connection.release();
    await pool.end();
  }
}

checkTable()
  .then(() => {
    console.log('Check completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Check failed:', error);
    process.exit(1);
  });
