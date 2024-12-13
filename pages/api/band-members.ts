import { VercelRequest, VercelResponse } from '@vercel/node';
import mysql from 'mysql2/promise';
import { corsMiddleware } from '../../utils/cors';

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

interface BandMember {
  id?: number;
  name: string;
  role: string;
  bio?: string;
  image_url?: string;
  social_links?: string;
  display_order: number;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('Band Members API Handler started');
  
  // Enable CORS
  await corsMiddleware(req, res);

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
          const [rows] = await pool.query('SELECT * FROM band_members WHERE id = ?', [req.query.id]);
          if (!Array.isArray(rows) || rows.length === 0) {
            return res.status(404).json({ error: 'Band member not found' });
          }
          const member = rows[0];
          return res.json({
            ...member,
            social_links: member.social_links ? JSON.parse(member.social_links as string) : null
          });
        } else {
          const [rows] = await pool.query('SELECT * FROM band_members ORDER BY display_order');
          return res.json(Array.isArray(rows) ? rows.map(member => ({
            ...member,
            social_links: member.social_links ? JSON.parse(member.social_links as string) : null
          })) : []);
        }

      case 'POST':
        const newMember = req.body;
        const socialLinksStr = newMember.social_links ? JSON.stringify(newMember.social_links) : null;
        const [result] = await pool.query(
          'INSERT INTO band_members (name, role, bio, image_url, social_links, display_order) VALUES (?, ?, ?, ?, ?, ?)',
          [newMember.name, newMember.role, newMember.bio, newMember.image_url, socialLinksStr, newMember.display_order]
        );
        const insertId = (result as any).insertId;
        return res.status(201).json({ ...newMember, id: insertId });

      case 'PUT':
        if (!req.query.id) {
          return res.status(400).json({ error: 'ID is required' });
        }
        const updateMember = req.body;
        if (updateMember.social_links) {
          updateMember.social_links = JSON.stringify(updateMember.social_links);
        }
        await pool.query(
          'UPDATE band_members SET ? WHERE id = ?',
          [updateMember, req.query.id]
        );
        const [updatedRows] = await pool.query('SELECT * FROM band_members WHERE id = ?', [req.query.id]);
        if (!Array.isArray(updatedRows) || updatedRows.length === 0) {
          return res.status(404).json({ error: 'Band member not found' });
        }
        const updatedMember = updatedRows[0];
        return res.json({
          ...updatedMember,
          social_links: updatedMember.social_links ? JSON.parse(updatedMember.social_links as string) : null
        });

      case 'DELETE':
        if (!req.query.id) {
          return res.status(400).json({ error: 'ID is required' });
        }
        await pool.query('DELETE FROM band_members WHERE id = ?', [req.query.id]);
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
