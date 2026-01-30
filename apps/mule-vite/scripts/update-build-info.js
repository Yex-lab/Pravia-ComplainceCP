import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packagePath = path.join(__dirname, '../package.json');
const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

const version = pkg.version || '1.0.0';
const [major, minor, patch] = version.split('.').map(Number);
const newVersion = `${major}.${minor}.${patch + 1}`;

pkg.version = newVersion;
pkg.buildDate = new Date().toISOString();

fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2) + '\n');

console.log(`✓ Build version updated to ${newVersion}`);
console.log(`✓ Build date updated to ${pkg.buildDate}`);
