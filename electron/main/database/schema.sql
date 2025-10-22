--  Clips table: stores all clipboard items
CREATE TABLE IF NOT EXISTS clips (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL CHECK(type IN('text', 'image', 'audio', 'file')),
    content TEXT NOT NULL,
    preview TEXT,
    metadata TEXT,
    created_at INTEGER NOT NULL,
    category_id TEXT,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL

); 

-- Categories table: user-created collections
CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY
    name TEXT NOT NULL,
    color TEXT NOT NULL,
    icon TEXT ,
    position INTEGER NOT NULL,
    created_at INTEGER NOT NULL,
)

-- some indexing
CREATE INDEX IF NOT EXISTS idx_clips_created_at ON clips(created_at_DESC)
CREATE INDEX IF NOT EXISTS idx_clips_category ON clips(category_id);
CREATE INDEX IF NOT EXISTS idx_clips_type ON clips(type);