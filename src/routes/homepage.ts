import { Router } from 'express';
import pool from '../config/database';

const router = Router();

router.get('/', async (req, res) => {
  try {
    // Default homepage data
    const homepageData = {
      heroSection: {
        title: 'Welcome to TheGrayStars',
        subtitle: 'Experience the Fusion of Rock and Innovation',
        backgroundImage: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=2070',
      },
      aboutSection: {
        title: 'About Us',
        content: 'TheGrayStars is a dynamic rock band that pushes the boundaries of musical expression. Our unique blend of rock genres creates an unforgettable experience for our audience.',
        image: 'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?q=80&w=2076',
      },
      featuredProducts: []
    };

    res.json(homepageData);
  } catch (error) {
    console.error('Error fetching homepage data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
