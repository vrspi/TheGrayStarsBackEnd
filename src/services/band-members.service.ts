import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

interface BandMember {
  id?: number;
  name: string;
  role: string;
  bio: string;
  image_url: string;
  social_links: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
  };
  display_order: number;
}

interface BandMemberRow extends RowDataPacket, Omit<BandMember, 'social_links'> {
  social_links: string;
}

export async function getBandMembers(): Promise<BandMember[]> {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query<BandMemberRow[]>(
      'SELECT * FROM band_members ORDER BY display_order'
    );
    return rows.map(row => ({
      ...row,
      social_links: JSON.parse(row.social_links as string)
    }));
  } finally {
    connection.release();
  }
}

export async function getBandMember(id: number): Promise<BandMember | null> {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query<BandMemberRow[]>(
      'SELECT * FROM band_members WHERE id = ?',
      [id]
    );
    if (rows.length === 0) return null;
    return {
      ...rows[0],
      social_links: JSON.parse(rows[0].social_links as string)
    };
  } finally {
    connection.release();
  }
}

export async function createBandMember(member: BandMember): Promise<BandMember> {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query<ResultSetHeader>(
      'INSERT INTO band_members (name, role, bio, image_url, social_links, display_order) VALUES (?, ?, ?, ?, ?, ?)',
      [
        member.name,
        member.role,
        member.bio,
        member.image_url,
        JSON.stringify(member.social_links),
        member.display_order
      ]
    );
    return {
      ...member,
      id: result.insertId
    };
  } finally {
    connection.release();
  }
}

export async function updateBandMember(id: number, member: BandMember): Promise<BandMember | null> {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query<ResultSetHeader>(
      'UPDATE band_members SET name = ?, role = ?, bio = ?, image_url = ?, social_links = ?, display_order = ? WHERE id = ?',
      [
        member.name,
        member.role,
        member.bio,
        member.image_url,
        JSON.stringify(member.social_links),
        member.display_order,
        id
      ]
    );
    if (result.affectedRows === 0) return null;
    return {
      ...member,
      id
    };
  } finally {
    connection.release();
  }
}

export async function deleteBandMember(id: number): Promise<boolean> {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query<ResultSetHeader>(
      'DELETE FROM band_members WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  } finally {
    connection.release();
  }
} 