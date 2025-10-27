// setting up the db connection

import Database from 'better-sqlite3'
import path from 'path'
import { app } from 'electron'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const userDataPath = app.getPath('userData') // where’s the system directory that Electron should use for saving user-specific data for this app?
const dbPath = path.join(userDataPath, 'clipboard.db') // 

console.log('Database path:', dbPath)

export const db: Database.Database = new Database(dbPath, { verbose: console.log })

db.pragma('foreign_keys = ON')

// Inline schema
const schema = `
CREATE TABLE IF NOT EXISTS clips (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK(type IN ('text', 'image', 'audio', 'file')),
  content TEXT NOT NULL,
  preview TEXT,
  metadata TEXT,
  created_at INTEGER NOT NULL,
  category_id TEXT,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  icon TEXT,
  position INTEGER NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_clips_created_at ON clips(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_clips_category ON clips(category_id);
CREATE INDEX IF NOT EXISTS idx_clips_type ON clips(type);
`

db.exec(schema)

console.log('Database initialized successfully')

process.on('exit', () => db.close())
process.on('SIGHUP', () => process.exit(128 + 1))
process.on('SIGINT', () => process.exit(128 + 2))
process.on('SIGTERM', () => process.exit(128 + 15))