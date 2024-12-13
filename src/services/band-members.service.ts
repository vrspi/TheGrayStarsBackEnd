import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

interface BandMember {
  id?: number;
  name: string;
  role: string;
  bio?: string;
  image_url?: string;
  social_links?: string;
  display_order: number;
}

export async function getBandMembers(): Promise<BandMember[]> {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM band_members ORDER BY display_order'
    );
    return rows as BandMember[];
  } catch (error) {
    console.error('Error in getBandMembers:', error);
    throw new Error('Failed to fetch band members');
  }
}

export async function getBandMember(id: number): Promise<BandMember | null> {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM band_members WHERE id = ?',
      [id]
    );
    return rows[0] as BandMember || null;
  } catch (error) {
    console.error('Error in getBandMember:', error);
    throw new Error(`Failed to fetch band member with id ${id}`);
  }
}

export async function createBandMember(member: BandMember): Promise<BandMember> {
  try {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO band_members (name, role, bio, image_url, social_links, display_order) VALUES (?, ?, ?, ?, ?, ?)',
      [member.name, member.role, member.bio, member.image_url, member.social_links, member.display_order]
    );
    return { ...member, id: result.insertId };
  } catch (error) {
    console.error('Error in createBandMember:', error);
    throw new Error('Failed to create band member');
  }
}

export async function updateBandMember(id: number, member: Partial<BandMember>): Promise<BandMember | null> {
  try {
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE band_members SET ? WHERE id = ?',
      [member, id]
    );
    if (result.affectedRows === 0) {
      return null;
    }
    return { ...member, id } as BandMember;
  } catch (error) {
    console.error('Error in updateBandMember:', error);
    throw new Error(`Failed to update band member with id ${id}`);
  }
}

export async function deleteBandMember(id: number): Promise<void> {
  try {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM band_members WHERE id = ?',
      [id]
    );
    if (result.affectedRows === 0) {
      throw new Error('Band member not found');
    }
  } catch (error) {
    console.error('Error in deleteBandMember:', error);
    throw new Error(`Failed to delete band member with id ${id}`);
  }
}