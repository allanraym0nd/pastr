import Database from "better-sqlite3";
import path from 'path'
import { fileURLToPath } from "url";
import { app } from 'electron'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// store db in users app
const userDataPath = app.getPath('userData') 
const dbPath = path.join(userDataPath, 'clipboard.db')

console.log('Database path:', dbPath)

// initialize db 
export const db:Database.Database = new Database(dbPath, { verbose: console.log })

db.pragma('foreign_keys=ON')

// Read and execute schema
const schemaPath = path.join(__dirname, 'schema.sql')
const schema = fs.readFileSync(schemaPath, 'utf-8')

db.exec(schema)

console.log('Database initialized successfully')

process.on('exit', () => db.close())
process.on('SIGHUP', () => process.exit(128+1))
process.on('SIGINT', () => process.exit(128+2))
process.on('SIGTERM', () => process.exit(128+15))