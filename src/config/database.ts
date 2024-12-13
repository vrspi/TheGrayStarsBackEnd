import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || '212.1.209.223',
  port: parseInt(process.env.DB_PORT || '3306'),
  database: process.env.DB_NAME || 'u669885128_uZsNT',
  user: process.env.DB_USER || 'u669885128_Deb9t',
  password: process.env.DB_PASSWORD || 'Loulouta159',
  ssl: {
    rejectUnauthorized: false
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;