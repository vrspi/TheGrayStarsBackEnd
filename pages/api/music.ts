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

interface Track {
  id?: number;
  title: string;
  artist?: string;
  album?: string;
  release_date?: string;
  duration?: string;
  audio_url: string;
  cover_image_url?: string;
  display_order?: number;
  created_at?: string;
  updated_at?: string;
  lyrics?: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('Music API Handler started');
  
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
          const [rows] = await pool.query('SELECT * FROM music WHERE id = ?', [req.query.id]);
          if (!Array.isArray(rows) || rows.length === 0) {
            return res.status(404).json({ error: 'Track not found' });
          }
          return res.json(rows[0]);
        } else {
          // Optional album filter
          const albumFilter = req.query.album ? 'WHERE album = ?' : '';
          const queryParams = req.query.album ? [req.query.album] : [];
          
          const [rows] = await pool.query(
            `SELECT * FROM music ${albumFilter} ORDER BY COALESCE(display_order, 9999), release_date DESC`,
            queryParams
          );
          return res.json(Array.isArray(rows) ? rows : []);
        }

      case 'POST':
        const newTrack: Track = req.body;
        const [result] = await pool.query(
          'INSERT INTO music (title, artist, album, release_date, duration, audio_url, cover_image_url, display_order, lyrics) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [newTrack.title, newTrack.artist, newTrack.album, newTrack.release_date, newTrack.duration, newTrack.audio_url, newTrack.cover_image_url, newTrack.display_order, newTrack.lyrics]
        );
        const insertId = (result as any).insertId;
        return res.status(201).json({ ...newTrack, id: insertId });

      case 'PUT':
        if (!req.query.id) {
          return res.status(400).json({ error: 'ID is required' });
        }
        const updateTrack: Partial<Track> = req.body;
        await pool.query(
          'UPDATE music SET ? WHERE id = ?',
          [updateTrack, req.query.id]
        );
        const [updatedRows] = await pool.query('SELECT * FROM music WHERE id = ?', [req.query.id]);
        if (!Array.isArray(updatedRows) || updatedRows.length === 0) {
          return res.status(404).json({ error: 'Track not found' });
        }
        return res.json(updatedRows[0]);

      case 'DELETE':
        if (!req.query.id) {
          return res.status(400).json({ error: 'ID is required' });
        }
        await pool.query('DELETE FROM music WHERE id = ?', [req.query.id]);
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
