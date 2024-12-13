import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

interface HeroSection {
  title: string;
  subtitle: string;
  backgroundImage: string;
}

interface AboutSection {
  title: string;
  content: string;
  image: string;
}

interface HomepageData {
  heroSection: HeroSection;
  aboutSection: AboutSection;
  featuredProducts: Array<{ id: string }>;
}

interface HeroRow extends RowDataPacket {
  title: string;
  subtitle: string;
  background_image: string;
}

interface AboutRow extends RowDataPacket {
  title: string;
  content: string;
  image: string;
}

interface ProductRow extends RowDataPacket {
  product_id: string;
}

export async function getHomepage(): Promise<HomepageData> {
  const connection = await pool.getConnection();
  try {
    // Get hero section
    const [heroRows] = await connection.query<HeroRow[]>(
      'SELECT title, subtitle, background_image FROM hero_section WHERE homepage_id = 1'
    );
    const heroSection = heroRows[0] ? {
      title: heroRows[0].title,
      subtitle: heroRows[0].subtitle,
      backgroundImage: heroRows[0].background_image,
    } : null;

    // Get about section
    const [aboutRows] = await connection.query<AboutRow[]>(
      'SELECT title, content, image FROM about_section WHERE homepage_id = 1'
    );
    const aboutSection = aboutRows[0] ? {
      title: aboutRows[0].title,
      content: aboutRows[0].content,
      image: aboutRows[0].image,
    } : null;

    // Get featured products
    const [productRows] = await connection.query<ProductRow[]>(
      'SELECT product_id FROM featured_products WHERE homepage_id = 1 ORDER BY display_order'
    );
    const featuredProducts = productRows.map(row => ({ id: row.product_id }));

    return {
      heroSection: heroSection || {
        title: 'Welcome to TheGrayStars',
        subtitle: 'Experience the fusion of Eastern and Western music',
        backgroundImage: '',
      },
      aboutSection: aboutSection || {
        title: 'About Us',
        content: 'Welcome to TheGrayStars',
        image: '',
      },
      featuredProducts: featuredProducts || [],
    };
  } finally {
    connection.release();
  }
}

export async function updateHomepage(data: HomepageData): Promise<void> {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Update hero section
    await connection.query<ResultSetHeader>(
      'UPDATE hero_section SET title = ?, subtitle = ?, background_image = ? WHERE homepage_id = 1',
      [data.heroSection.title, data.heroSection.subtitle, data.heroSection.backgroundImage]
    );

    // Update about section
    await connection.query<ResultSetHeader>(
      'UPDATE about_section SET title = ?, content = ?, image = ? WHERE homepage_id = 1',
      [data.aboutSection.title, data.aboutSection.content, data.aboutSection.image]
    );

    // Update featured products
    await connection.query<ResultSetHeader>('DELETE FROM featured_products WHERE homepage_id = 1');
    
    if (data.featuredProducts.length > 0) {
      const values = data.featuredProducts.map((product, index) => 
        [1, product.id, index + 1]
      );
      await connection.query<ResultSetHeader>(
        'INSERT INTO featured_products (homepage_id, product_id, display_order) VALUES ?',
        [values]
      );
    }

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
