import express, { Router, Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import pool from '../config/database';
import { Post, CreatePostDTO, UpdatePostDTO } from '../models/Post';
import { ResultSetHeader } from 'mysql2';

const router: Router = express.Router();

interface TypedRequestParams<P extends ParamsDictionary> extends Request<P> {}
interface TypedRequestBody<T> extends Request<ParamsDictionary, any, T> {}

// Get all posts
router.get('/', (req: Request, res: Response) => {
  pool.query<Post[]>('SELECT * FROM posts ORDER BY created_at DESC')
    .then(([posts]) => {
      res.json(posts);
    })
    .catch(error => {
      console.error('Error fetching posts:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});

// Get a single post
router.get('/:id', (req: TypedRequestParams<{ id: string }>, res: Response) => {
  pool.query<Post[]>('SELECT * FROM posts WHERE id = ?', [req.params.id])
    .then(([posts]) => {
      if (posts.length === 0) {
        return res.status(404).json({ error: 'Post not found' });
      }
      res.json(posts[0]);
    })
    .catch(error => {
      console.error('Error fetching post:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});

// Create a new post
router.post('/', (req: TypedRequestBody<CreatePostDTO>, res: Response) => {
  const post = req.body;
  pool.query<ResultSetHeader>(
    'INSERT INTO posts (title, content, status, author, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
    [post.title, post.content, post.status, post.author]
  )
    .then(([result]) => {
      res.status(201).json({ id: result.insertId, ...post });
    })
    .catch(error => {
      console.error('Error creating post:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});

// Update a post
router.put('/:id', (req: TypedRequestBody<UpdatePostDTO> & TypedRequestParams<{ id: string }>, res: Response) => {
  const post = { id: parseInt(req.params.id), ...req.body };
  pool.query<ResultSetHeader>(
    'UPDATE posts SET title = ?, content = ?, status = ?, updated_at = NOW() WHERE id = ?',
    [post.title, post.content, post.status, post.id]
  )
    .then(([result]) => {
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Post not found' });
      }
      res.json(post);
    })
    .catch(error => {
      console.error('Error updating post:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});

// Delete a post
router.delete('/:id', (req: TypedRequestParams<{ id: string }>, res: Response) => {
  pool.query<ResultSetHeader>('DELETE FROM posts WHERE id = ?', [req.params.id])
    .then(([result]) => {
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Post not found' });
      }
      res.status(204).send();
    })
    .catch(error => {
      console.error('Error deleting post:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});

export default router;
