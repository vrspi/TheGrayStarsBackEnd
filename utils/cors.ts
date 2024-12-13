import { VercelRequest, VercelResponse } from '@vercel/node';

export async function corsMiddleware(req: VercelRequest, res: VercelResponse) {
  // Allow requests from your frontend domain
  res.setHeader('Access-Control-Allow-Origin', 'https://the-gray-stars-front-end-74kd.vercel.app');
  
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
