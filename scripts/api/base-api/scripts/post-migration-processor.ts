#!/usr/bin/env tsx

import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

async function processMigrations() {
  const migrationsDir = join(__dirname, '../migrations');

  try {
    const files = await readdir(migrationsDir);
    const migrationFiles = files.filter(
      (file) => file.endsWith('.ts') && !file.includes('schema-update'),
    );

    for (const file of migrationFiles) {
      const filePath = join(migrationsDir, file);
      let content = await readFile(filePath, 'utf-8');

      // Add schema creation if not present
      if (content.includes('CREATE SCHEMA') && !content.includes('IF NOT EXISTS')) {
        content = content.replace(/CREATE SCHEMA (\w+)/g, 'CREATE SCHEMA IF NOT EXISTS $1');
        await writeFile(filePath, content);
        console.log(`✅ Processed: ${file}`);
      }
    }

    console.log('🎉 Migration processing complete!');
  } catch (error) {
    console.error('❌ Error processing migrations:', error);
    process.exit(1);
  }
}

processMigrations();
