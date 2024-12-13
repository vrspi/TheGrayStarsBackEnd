import express from 'express';
import { Router } from 'express';
import postsRouter from './posts';
import homepageRouter from './homepage';

const router: Router = express.Router();

// Basic test route
router.get('/', (req, res) => {
  res.json({ message: 'Welcome to TheGrayStars API' });
});

// Posts routes
router.use('/posts', postsRouter);

// Homepage routes
router.use('/homepage', homepageRouter);

export default router;