import { Router } from 'express';
import pool from '../config/database';
import { ResultSetHeader } from 'mysql2';

const router = Router();

// Get all gallery items
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM gallery ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching gallery items:', error);
    res.status(500).json({ error: 'Failed to fetch gallery items' });
  }
});

// Add a new gallery item
router.post('/', async (req, res) => {
  const { title, description, image_url } = req.body;
  try {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO gallery (title, description, image_url) VALUES (?, ?, ?)',
      [title, description, image_url]
    );
    res.status(201).json({ id: result.insertId, title, description, image_url });
  } catch (error) {
    console.error('Error adding gallery item:', error);
    res.status(500).json({ error: 'Failed to add gallery item' });
  }
});

// Update a gallery item
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, image_url } = req.body;
  try {
    await pool.query<ResultSetHeader>(
      'UPDATE gallery SET title = ?, description = ?, image_url = ? WHERE id = ?',
      [title, description, image_url, id]
    );
    res.json({ id, title, description, image_url });
  } catch (error) {
    console.error('Error updating gallery item:', error);
    res.status(500).json({ error: 'Failed to update gallery item' });
  }
});

// Delete a gallery item
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query<ResultSetHeader>('DELETE FROM gallery WHERE id = ?', [id]);
    res.json({ message: 'Gallery item deleted successfully' });
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    res.status(500).json({ error: 'Failed to delete gallery item' });
  }
});

export default router; 