import { Router } from 'express';
import pool from '../config/database';
import { ResultSetHeader } from 'mysql2';

const router = Router();

// Get all music tracks
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM music ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching music tracks:', error);
    res.status(500).json({ error: 'Failed to fetch music tracks' });
  }
});

// Add a new music track
router.post('/', async (req, res) => {
  const { title, artist, album, release_date, duration, audio_url, cover_image_url } = req.body;
  try {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO music (title, artist, album, release_date, duration, audio_url, cover_image_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, artist, album, release_date, duration, audio_url, cover_image_url]
    );
    res.status(201).json({ 
      id: result.insertId, 
      title, 
      artist, 
      album, 
      release_date, 
      duration, 
      audio_url, 
      cover_image_url 
    });
  } catch (error) {
    console.error('Error adding music track:', error);
    res.status(500).json({ error: 'Failed to add music track' });
  }
});

// Update a music track
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, artist, album, release_date, duration, audio_url, cover_image_url } = req.body;
  try {
    await pool.query<ResultSetHeader>(
      'UPDATE music SET title = ?, artist = ?, album = ?, release_date = ?, duration = ?, audio_url = ?, cover_image_url = ? WHERE id = ?',
      [title, artist, album, release_date, duration, audio_url, cover_image_url, id]
    );
    res.json({ 
      id, 
      title, 
      artist, 
      album, 
      release_date, 
      duration, 
      audio_url, 
      cover_image_url 
    });
  } catch (error) {
    console.error('Error updating music track:', error);
    res.status(500).json({ error: 'Failed to update music track' });
  }
});

// Delete a music track
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query<ResultSetHeader>('DELETE FROM music WHERE id = ?', [id]);
    res.json({ message: 'Music track deleted successfully' });
  } catch (error) {
    console.error('Error deleting music track:', error);
    res.status(500).json({ error: 'Failed to delete music track' });
  }
});

export default router; 