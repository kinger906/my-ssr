import { query } from '../db'

export async function ensureTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS items (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT DEFAULT '',
      status VARCHAR(50) DEFAULT 'active',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `)

  await query(`
    CREATE TABLE IF NOT EXISTS files (
      id SERIAL PRIMARY KEY,
      file_id VARCHAR(255) NOT NULL UNIQUE,
      original_name VARCHAR(500) NOT NULL,
      url TEXT NOT NULL,
      size BIGINT NOT NULL DEFAULT 0,
      mime_type VARCHAR(100) NOT NULL,
      item_id INTEGER REFERENCES items(id) ON DELETE SET NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `)
}