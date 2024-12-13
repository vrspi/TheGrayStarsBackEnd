import { Router, Request, Response } from 'express';
import { BandMember, getBandMembers, getBandMember, createBandMember, updateBandMember, deleteBandMember } from '../services/band-members.service';

const router = Router();

interface SocialLinks {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  youtube?: string;
}

// Input types for API requests
interface BandMemberInput extends Omit<BandMember, 'id' | 'social_links'> {
  social_links?: SocialLinks;
}

interface BandMemberResponse extends Omit<BandMember, 'social_links'> {
  social_links?: SocialLinks | null;
}

// Transform functions
const transformInputToMember = (input: BandMemberInput): Omit<BandMember, 'id'> => ({
  name: input.name,
  role: input.role,
  bio: input.bio,
  image_url: input.image_url,
  display_order: input.display_order,
  social_links: input.social_links ? JSON.stringify(input.social_links) : null
});

const transformPartialInput = (input: Partial<BandMemberInput>): Partial<BandMember> => {
  const result: Partial<BandMember> = {};
  
  if (input.name !== undefined) result.name = input.name;
  if (input.role !== undefined) result.role = input.role;
  if (input.bio !== undefined) result.bio = input.bio;
  if (input.image_url !== undefined) result.image_url = input.image_url;
  if (input.display_order !== undefined) result.display_order = input.display_order;
  if (input.social_links !== undefined) {
    result.social_links = input.social_links ? JSON.stringify(input.social_links) : null;
  }

  return result;
};

const transformToResponse = (member: BandMember): BandMemberResponse => ({
  id: member.id,
  name: member.name,
  role: member.role,
  bio: member.bio,
  image_url: member.image_url,
  display_order: member.display_order,
  social_links: member.social_links ? JSON.parse(member.social_links) : null
});

// Get all band members
router.get('/', async (_req: Request, res: Response) => {
  try {
    const members = await getBandMembers();
    res.json(members.map(transformToResponse));
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
    res.json(transformToResponse(member));
  } catch (error) {
    console.error('Error getting band member:', error);
    res.status(500).json({ error: 'Failed to get band member' });
  }
});

// Create a new band member
router.post('/', async (req: Request, res: Response) => {
  try {
    const input: BandMemberInput = req.body;
    const transformedMember = transformInputToMember(input);
    const newMember = await createBandMember(transformedMember);
    res.status(201).json(transformToResponse(newMember));
  } catch (error) {
    console.error('Error creating band member:', error);
    res.status(500).json({ error: 'Failed to create band member' });
  }
});

// Update a band member
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const input: Partial<BandMemberInput> = req.body;
    const transformedMember = transformPartialInput(input);
    const updatedMember = await updateBandMember(parseInt(req.params.id), transformedMember);
    
    if (!updatedMember) {
      return res.status(404).json({ error: 'Band member not found' });
    }
    
    res.json(transformToResponse(updatedMember));
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