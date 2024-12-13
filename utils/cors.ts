import { VercelRequest, VercelResponse } from '@vercel/node';

const allowedOrigins = [
  'https://the-gray-stars-front-end-74kd.vercel.app',
  'https://the-gray-stars-front-end-74kd-cz22ezzwt-vrspis-projects.vercel.app',
  'http://localhost:3000'
];

export async function corsMiddleware(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin;
  
  // Check if the origin is allowed
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    // For development/testing, you might want to allow all origins
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  
  // Allow specific methods
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  
  // Allow specific headers
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Allow credentials (if needed)
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true;
  }
  return false;
}
