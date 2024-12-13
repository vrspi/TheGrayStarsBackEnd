import { RowDataPacket } from 'mysql2';

export interface Post extends RowDataPacket {
  id: number;
  title: string;
  content: string;
  status: 'draft' | 'published';
  author: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreatePostDTO {
  title: string;
  content: string;
  status: 'draft' | 'published';
  author: string;
}

export interface UpdatePostDTO extends Partial<CreatePostDTO> {
  id: number;
}
