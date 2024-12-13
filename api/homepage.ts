import { VercelRequest, VercelResponse } from '@vercel/node';
import mysql from 'mysql2/promise';
import cors from 'cors';

// Database configuration
const pool = mysql.createPool({
  host: '212.1.209.223',
  port: 3306,
  database: 'u669885128_uZsNT',
  user: 'u669885128_Deb9t',
  password: 'Loulouta159',
  ssl: {
    rejectUnauthorized: false
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// CORS middleware
const corsMiddleware = cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
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

interface Homepage {
  id: number;
  last_updated: string;
  hero_section: {
    title: string;
    subtitle?: string;
    background_image?: string;
  };
  about_section: {
    title: string;
    content?: string;
    image?: string;
  };
  featured_products: Array<{
    product_id: string;
    display_order: number;
  }>;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('Homepage API Handler started');
  
  // Run the CORS middleware
  try {
    await runMiddleware(req, res, corsMiddleware);
  } catch (error) {
    console.error('CORS middleware error:', error);
    return res.status(500).json({ error: 'CORS configuration error' });
  }

  // Test database connection
  try {
    const connection = await pool.getConnection();
    console.log('Database connected successfully');
    connection.release();
  } catch (error) {
    console.error('Database connection error:', error);
    return res.status(500).json({ 
      error: 'Database connection error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }

  try {
    switch (req.method) {
      case 'GET':
        // Get homepage data with all related sections
        const [homepageRows] = await pool.query('SELECT * FROM homepage WHERE id = 1');
        if (!Array.isArray(homepageRows) || homepageRows.length === 0) {
          return res.status(404).json({ error: 'Homepage not found' });
        }

        const homepage = homepageRows[0];

        // Get hero section
        const [heroRows] = await pool.query('SELECT * FROM hero_section WHERE homepage_id = 1');
        const hero = Array.isArray(heroRows) && heroRows.length > 0 ? heroRows[0] : null;

        // Get about section
        const [aboutRows] = await pool.query('SELECT * FROM about_section WHERE homepage_id = 1');
        const about = Array.isArray(aboutRows) && aboutRows.length > 0 ? aboutRows[0] : null;

        // Get featured products
        const [productRows] = await pool.query(
          'SELECT * FROM featured_products WHERE homepage_id = 1 ORDER BY display_order'
        );
        const featured_products = Array.isArray(productRows) ? productRows : [];

        return res.json({
          ...homepage,
          hero_section: hero,
          about_section: about,
          featured_products
        });

      case 'PUT':
        const updateData = req.body;
        const connection = await pool.getConnection();
        
        try {
          await connection.beginTransaction();

          // Update hero section
          if (updateData.hero_section) {
            await connection.query(
              'UPDATE hero_section SET title = ?, subtitle = ?, background_image = ? WHERE homepage_id = 1',
              [updateData.hero_section.title, updateData.hero_section.subtitle, updateData.hero_section.background_image]
            );
          }

          // Update about section
          if (updateData.about_section) {
            await connection.query(
              'UPDATE about_section SET title = ?, content = ?, image = ? WHERE homepage_id = 1',
              [updateData.about_section.title, updateData.about_section.content, updateData.about_section.image]
            );
          }

          // Update featured products
          if (updateData.featured_products) {
            // Delete existing featured products
            await connection.query('DELETE FROM featured_products WHERE homepage_id = 1');
            
            // Insert new featured products
            for (const product of updateData.featured_products) {
              await connection.query(
                'INSERT INTO featured_products (homepage_id, product_id, display_order) VALUES (1, ?, ?)',
                [product.product_id, product.display_order]
              );
            }
          }

          // Update last_updated timestamp
          await connection.query('UPDATE homepage SET last_updated = CURRENT_TIMESTAMP WHERE id = 1');

          await connection.commit();

          // Get updated data
          const [updatedData] = await connection.query(
            'SELECT * FROM homepage WHERE id = 1'
          );
          return res.json(updatedData[0]);

        } catch (error) {
          await connection.rollback();
          throw error;
        } finally {
          connection.release();
        }

      default:
        res.setHeader('Allow', ['GET', 'PUT']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('Error handling request:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
