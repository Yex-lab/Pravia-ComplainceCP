import Database from 'better-sqlite3';
import { app } from 'electron';
import { join } from 'path';

const dbPath = join(app.getPath('userData'), 'faro.db');
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS services (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    interval INTEGER DEFAULT 30000,
    enabled INTEGER DEFAULT 1,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );
`);

export const dbService = {
  getAll: () => db.prepare('SELECT * FROM services').all(),
  
  getById: (id: string) => db.prepare('SELECT * FROM services WHERE id = ?').get(id),
  
  create: (service: any) => 
    db.prepare(`
      INSERT INTO services (id, name, url, interval, enabled, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      service.id,
      service.name,
      service.url,
      service.interval || 30000,
      service.enabled ? 1 : 0,
      Date.now(),
      Date.now()
    ),
  
  update: (id: string, data: any) => 
    db.prepare(`
      UPDATE services 
      SET name = ?, url = ?, interval = ?, enabled = ?, updated_at = ?
      WHERE id = ?
    `).run(data.name, data.url, data.interval, data.enabled ? 1 : 0, Date.now(), id),
  
  delete: (id: string) => db.prepare('DELETE FROM services WHERE id = ?').run(id)
};

export default db;
