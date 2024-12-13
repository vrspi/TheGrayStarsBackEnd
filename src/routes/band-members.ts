import { Router, Request, Response } from 'express';
import { BandMember, getBandMembers, getBandMember, createBandMember, updateBandMember, deleteBandMember } from '../services/band-members.service';

const router = Router();

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

// Transform the input data to match the database schema
const transformBandMember = (input: BandMemberInput): Omit<BandMember, 'id'> => {
  return {
    name: input.name,
    role: input.role,
    bio: input.bio,
    image_url: input.image_url,
    social_links: input.social_links ? JSON.stringify(input.social_links) : null,
    display_order: input.display_order
  };
};

// Transform partial input data for updates
const transformPartialBandMember = (input: Partial<BandMemberInput>): Partial<BandMember> => {
  const transformed: Partial<BandMember> = { ...input };
  
  if (input.social_links !== undefined) {
    transformed.social_links = input.social_links ? JSON.stringify(input.social_links) : null;
  }

  // Remove the original social_links object to avoid type conflicts
  delete (transformed as any).social_links;
  
  return transformed;
};

// Get all band members
router.get('/', async (_req: Request, res: Response) => {
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
router.get('/:id', async (req: Request, res: Response) => {
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
router.post('/', async (req: Request, res: Response) => {
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
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const input: Partial<BandMemberInput> = req.body;
    const transformedMember = transformPartialBandMember(input);
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
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await deleteBandMember(parseInt(req.params.id));
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting band member:', error);
    res.status(500).json({ error: 'Failed to delete band member' });
  }
});

export default router;