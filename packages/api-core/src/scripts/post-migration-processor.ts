#!/usr/bin/env tsx

/**
 * Post-migration processor
 * Processes generated migrations to ensure consistency
 */

import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const MIGRATIONS_DIR = join(__dirname, '../migrations');

async function processMigrations() {
  try {
    const files = await readdir(MIGRATIONS_DIR);
    const migrationFiles = files.filter(file => file.endsWith('.ts'));

    for (const file of migrationFiles) {
      const filePath = join(MIGRATIONS_DIR, file);
      let content = await readFile(filePath, 'utf-8');

      // Add any post-processing logic here
      // For example: formatting, adding comments, etc.

      await writeFile(filePath, content);
      console.log(`Processed migration: ${file}`);
    }

    console.log('✅ Migration processing completed');
  } catch (error) {
    console.error('❌ Migration processing failed:', error);
    process.exit(1);
  }
}

processMigrations();
