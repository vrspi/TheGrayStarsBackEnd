import { VercelRequest, VercelResponse } from '@vercel/node';
import { getBandMembers, getBandMember, createBandMember, updateBandMember, deleteBandMember } from '../src/services/band-members.service';
import cors from 'cors';

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
  // Run the CORS middleware
  await runMiddleware(req, res, corsMiddleware);

  try {
    switch (req.method) {
      case 'GET':
        if (req.query.id) {
          const member = await getBandMember(parseInt(req.query.id as string));
          if (!member) {
            return res.status(404).json({ error: 'Band member not found' });
          }
          return res.json(member);
        } else {
          const members = await getBandMembers();
          return res.json(members);
        }

      case 'POST':
        const newMember = await createBandMember(req.body);
        return res.status(201).json(newMember);

      case 'PUT':
        if (!req.query.id) {
          return res.status(400).json({ error: 'ID is required' });
        }
        const updatedMember = await updateBandMember(parseInt(req.query.id as string), req.body);
        if (!updatedMember) {
          return res.status(404).json({ error: 'Band member not found' });
        }
        return res.json(updatedMember);

      case 'DELETE':
        if (!req.query.id) {
          return res.status(400).json({ error: 'ID is required' });
        }
        await deleteBandMember(parseInt(req.query.id as string));
        return res.status(204).end();

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('Error handling request:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
