import express, { Request, Response, Router } from 'express';
import { getBandMembers, getBandMember, createBandMember, updateBandMember, deleteBandMember } from '../services/band-members.service';

interface SocialLinks {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  youtube?: string;
}

interface BandMemberInput {
  name: string;
  role: string;
  bio?: string;
  image_url?: string;
  social_links?: SocialLinks;
  display_order: number;
}

const router: Router = express.Router();

// Transform the input data to match the database schema
const transformBandMember = (input: BandMemberInput) => {
  return {
    ...input,
    social_links: input.social_links ? JSON.stringify(input.social_links) : null
  };
};

// Get all band members
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const members = await getBandMembers();
    res.json(members.map(member => ({
      ...member,
      social_links: member.social_links ? JSON.parse(member.social_links) : null
    })));
  } catch (error) {
    console.error('Error getting band members:', error);
    res.status(500).json({ error: 'Failed to get band members' });
  }
});

// Get a single band member
router.get('/:id', async (req, res): Promise<void> => {
  try {
    const member = await getBandMember(parseInt(req.params.id));
    if (!member) {
      return res.status(404).json({ error: 'Band member not found' });
    }
    res.json({
      ...member,
      social_links: member.social_links ? JSON.parse(member.social_links) : null
    });
  } catch (error) {
    console.error('Error getting band member:', error);
    res.status(500).json({ error: 'Failed to get band member' });
  }
});

// Create a new band member
router.post('/', async (req: Request<{}, {}, BandMemberInput>, res: Response): Promise<void> => {
  try {
    const input: BandMemberInput = req.body;
    const transformedMember = transformBandMember(input);
    const newMember = await createBandMember(transformedMember);
    res.status(201).json({
      ...newMember,
      social_links: newMember.social_links ? JSON.parse(newMember.social_links) : null
    });
  } catch (error) {
    console.error('Error creating band member:', error);
    res.status(500).json({ error: 'Failed to create band member' });
  }
});

// Update a band member
router.put('/:id', async (req: Request<{ id: string }, {}, Partial<BandMemberInput>>, res: Response): Promise<void> => {
  try {
    const input: Partial<BandMemberInput> = req.body;
    const transformedMember = input.social_links 
      ? { ...input, social_links: JSON.stringify(input.social_links) }
      : input;
    
    const updatedMember = await updateBandMember(parseInt(req.params.id), transformedMember);
    if (!updatedMember) {
      return res.status(404).json({ error: 'Band member not found' });
    }
    res.json({
      ...updatedMember,
      social_links: updatedMember.social_links ? JSON.parse(updatedMember.social_links) : null
    });
  } catch (error) {
    console.error('Error updating band member:', error);
    res.status(500).json({ error: 'Failed to update band member' });
  }
});

// Delete a band member
router.delete('/:id', async (req, res): Promise<void> => {
  try {
    await deleteBandMember(parseInt(req.params.id));
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting band member:', error);
    res.status(500).json({ error: 'Failed to delete band member' });
  }
});

export default router;