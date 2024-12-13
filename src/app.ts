import express from 'express';
import cors from 'cors';
import bandMembersRouter from './routes/band-members';
import musicRouter from './routes/music';
import galleryRouter from './routes/gallery';
import homepageRoutes from './routes/homepage';

const app = express();

// Configure CORS to accept requests from any origin
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow all common HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow common headers
  credentials: true // Allow credentials
}));

app.use(express.json());

// API routes
app.use('/api/band-members', bandMembersRouter);
app.use('/api/music', musicRouter);
app.use('/api/gallery', galleryRouter);
app.use('/api/homepage', homepageRoutes);

export default app;