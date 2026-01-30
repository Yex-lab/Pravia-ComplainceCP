#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const prompt = (question, defaultValue) => {
  return new Promise((resolve) => {
    const displayDefault = defaultValue ? ` (${defaultValue})` : '';
    rl.question(`${question}${displayDefault}: `, (answer) => {
      resolve(answer.trim() || defaultValue);
    });
  });
};

const shouldInclude = (entryName, isRoot = false) => {
  const excluded = ['node_modules', 'dist', 'build', '.DS_Store', '_archive', 'docs', 'package-lock.json'];
  if (excluded.includes(entryName)) return false;
  
  if (isRoot) {
    const rootIncludes = ['public', 'scripts', 'src', '.env', '.env.localhost', '.env.development'];
    return rootIncludes.some(inc => entryName.startsWith(inc)) || 
           ['.gitignore', 'index.html', 'package.json', 'vite.config.ts', 'tsconfig.json', 
            'tsconfig.node.json', 'README.md', 'eslint.config.mjs', 'prettier.config.mjs', 
            'vitest.config.ts'].includes(entryName);
  }
  return true;
};

const copyDirectory = (src, dest, replacements, isRoot = false) => {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    if (!shouldInclude(entry.name, isRoot)) continue;

    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath, replacements, false);
    } else {
      let content = fs.readFileSync(srcPath, 'utf-8');
      
      for (const [key, value] of Object.entries(replacements)) {
        content = content.replace(new RegExp(key, 'g'), value);
      }
      
      fs.writeFileSync(destPath, content);
    }
  }
};

(async () => {
  console.log('\n🚀 App Generator\n');

  const appName = await prompt('App name (lowercase, e.g., my-app)', 'my-app');
  const appDisplayName = await prompt('Display name', appName.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));
  const appDescription = await prompt('Description', `${appDisplayName} application built with Vite and React`);
  const port = await prompt('Port number', '8081');
  const packageScope = await prompt('Package scope', '@asyml8');
  const author = await prompt('Author', 'Tony Henderson');

  rl.close();

  const templatePath = path.join(__dirname, 'base-app');
  const targetPath = path.join(__dirname, '../../apps', appName);

  if (fs.existsSync(targetPath)) {
    console.error(`\n❌ Error: Directory ${targetPath} already exists`);
    process.exit(1);
  }

  const replacements = {
    '{{APP_NAME}}': appName,
    '{{APP_DISPLAY_NAME}}': appDisplayName,
    '{{APP_TITLE}}': `Pravia ${appDisplayName}`,
    '{{APP_DESCRIPTION}}': appDescription,
    '{{AUTHOR}}': author,
    '{{VERSION}}': '1.0.0',
    '{{BUILD_DATE}}': new Date().toISOString(),
    '{{PORT}}': port,
  };

  console.log('\n📦 Generating app...');
  copyDirectory(templatePath, targetPath, replacements, true);

  console.log(`\n✅ App created at: ${targetPath}`);
  console.log(`\nNext steps:`);
  console.log(`  cd apps/${appName}`);
  console.log(`  pnpm install`);
  console.log(`  pnpm dev\n`);
})();
