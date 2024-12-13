import { VercelRequest, VercelResponse } from '@vercel/node';
import mysql from 'mysql2/promise';
import cors from 'cors';

// Database configuration
const pool = mysql.createPool({
  host: '212.1.209.223',
  port: 3306,
  database: 'u669885128_uZsNT',
  user: 'u669885128_Deb9t',
  password: 'Loulouta159',
  ssl: {
    rejectUnauthorized: false
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// CORS middleware
const corsMiddleware = cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
});

const runMiddleware = (req: VercelRequest, res: VercelResponse, fn: Function) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

interface GalleryItem {
  id?: number;
  title: string;
  description?: string;
  image_url: string;
  thumbnail_url?: string;
  category?: string;
  created_at?: string;
  display_order?: number;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('Gallery API Handler started');
  
  // Run the CORS middleware
  try {
    await runMiddleware(req, res, corsMiddleware);
  } catch (error) {
    console.error('CORS middleware error:', error);
    return res.status(500).json({ error: 'CORS configuration error' });
  }

  // Test database connection
  try {
    const connection = await pool.getConnection();
    console.log('Database connected successfully');
    connection.release();
  } catch (error) {
    console.error('Database connection error:', error);
    return res.status(500).json({ 
      error: 'Database connection error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }

  try {
    switch (req.method) {
      case 'GET':
        if (req.query.id) {
          const [rows] = await pool.query('SELECT * FROM gallery WHERE id = ?', [req.query.id]);
          if (!Array.isArray(rows) || rows.length === 0) {
            return res.status(404).json({ error: 'Gallery item not found' });
          }
          return res.json(rows[0]);
        } else {
          // Optional category filter
          const categoryFilter = req.query.category ? 'WHERE category = ?' : '';
          const queryParams = req.query.category ? [req.query.category] : [];
          
          const [rows] = await pool.query(
            `SELECT * FROM gallery ${categoryFilter} ORDER BY display_order ASC, created_at DESC`,
            queryParams
          );
          return res.json(Array.isArray(rows) ? rows : []);
        }

      case 'POST':
        const newItem: GalleryItem = req.body;
        const [result] = await pool.query(
          'INSERT INTO gallery (title, description, image_url, thumbnail_url, category, display_order) VALUES (?, ?, ?, ?, ?, ?)',
          [newItem.title, newItem.description, newItem.image_url, newItem.thumbnail_url, newItem.category, newItem.display_order]
        );
        const insertId = (result as any).insertId;
        return res.status(201).json({ ...newItem, id: insertId });

      case 'PUT':
        if (!req.query.id) {
          return res.status(400).json({ error: 'ID is required' });
        }
        const updateItem: Partial<GalleryItem> = req.body;
        await pool.query(
          'UPDATE gallery SET ? WHERE id = ?',
          [updateItem, req.query.id]
        );
        const [updatedRows] = await pool.query('SELECT * FROM gallery WHERE id = ?', [req.query.id]);
        if (!Array.isArray(updatedRows) || updatedRows.length === 0) {
          return res.status(404).json({ error: 'Gallery item not found' });
        }
        return res.json(updatedRows[0]);

      case 'DELETE':
        if (!req.query.id) {
          return res.status(400).json({ error: 'ID is required' });
        }
        await pool.query('DELETE FROM gallery WHERE id = ?', [req.query.id]);
        return res.status(204).end();

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('Error handling request:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
