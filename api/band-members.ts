import { VercelRequest, VercelResponse } from '@vercel/node';
import { getBandMembers, getBandMember, createBandMember, updateBandMember, deleteBandMember } from '../src/services/band-members.service';
import cors from 'cors';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Database connection configuration
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false
  }
});

// CORS middleware
const corsMiddleware = cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('API Handler started');
  console.log('Environment variables:', {
    DB_HOST: process.env.DB_HOST ? 'Set' : 'Not set',
    DB_USER: process.env.DB_USER ? 'Set' : 'Not set',
    DB_PASSWORD: process.env.DB_PASSWORD ? 'Set' : 'Not set',
    DB_NAME: process.env.DB_NAME ? 'Set' : 'Not set'
  });

  // Run the CORS middleware
  try {
    await runMiddleware(req, res, corsMiddleware);
  } catch (error) {
    console.error('CORS middleware error:', error);
    return res.status(500).json({ error: 'CORS configuration error' });
  }

  try {
    // Test database connection
    const connection = await pool.getConnection();
    console.log('Database connection successful');
    connection.release();

    switch (req.method) {
      case 'GET':
        if (req.query.id) {
          console.log('Getting band member by ID:', req.query.id);
          const member = await getBandMember(parseInt(req.query.id as string));
          if (!member) {
            return res.status(404).json({ error: 'Band member not found' });
          }
          return res.json(member);
        } else {
          console.log('Getting all band members');
          const members = await getBandMembers();
          return res.json(members);
        }

      case 'POST':
        console.log('Creating new band member:', req.body);
        const newMember = await createBandMember(req.body);
        return res.status(201).json(newMember);

      case 'PUT':
        if (!req.query.id) {
          return res.status(400).json({ error: 'ID is required' });
        }
        console.log('Updating band member:', req.query.id);
        const updatedMember = await updateBandMember(parseInt(req.query.id as string), req.body);
        if (!updatedMember) {
          return res.status(404).json({ error: 'Band member not found' });
        }
        return res.json(updatedMember);

      case 'DELETE':
        if (!req.query.id) {
          return res.status(400).json({ error: 'ID is required' });
        }
        console.log('Deleting band member:', req.query.id);
        await deleteBandMember(parseInt(req.query.id as string));
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
