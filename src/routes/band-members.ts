import express, { Request, Response, Router } from 'express';
import { getBandMembers, getBandMember, createBandMember, updateBandMember, deleteBandMember } from '../services/band-members.service';

interface BandMemberParams {
  id: string;
}

interface BandMember {
  id?: number;
  name: string;
  role: string;
  bio: string;
  image_url: string;
  social_links: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
  };
  display_order: number;
}

const router: Router = express.Router();

// Get all band members
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const members = await getBandMembers();
    res.json(members);
  } catch (error) {
    console.error('Error fetching band members:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a single band member
router.get<BandMemberParams>('/:id', async (req, res): Promise<void> => {
  try {
    const member = await getBandMember(parseInt(req.params.id));
    if (!member) {
      res.status(404).json({ error: 'Band member not found' });
      return;
    }
    res.json(member);
  } catch (error) {
    console.error('Error fetching band member:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new band member
router.post('/', async (req: Request<{}, {}, BandMember>, res: Response): Promise<void> => {
  try {
    const member = await createBandMember(req.body);
    res.status(201).json(member);
  } catch (error) {
    console.error('Error creating band member:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a band member
router.put<BandMemberParams>('/:id', async (req: Request<BandMemberParams, {}, BandMember>, res: Response): Promise<void> => {
  try {
    const member = await updateBandMember(parseInt(req.params.id), req.body);
    if (!member) {
      res.status(404).json({ error: 'Band member not found' });
      return;
    }
    res.json(member);
  } catch (error) {
    console.error('Error updating band member:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a band member
router.delete<BandMemberParams>('/:id', async (req, res): Promise<void> => {
  try {
    await deleteBandMember(parseInt(req.params.id));
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting band member:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router; 