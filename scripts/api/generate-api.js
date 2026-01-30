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

const copyDirectory = (src, dest, replacements) => {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.DS_Store') {
      continue;
    }

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath, replacements);
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
  console.log('\n🚀 API Generator\n');

  const apiName = await prompt('API name (lowercase, e.g., contacts)', 'contacts');
  const apiDisplayName = await prompt('Display name', apiName.charAt(0).toUpperCase() + apiName.slice(1));
  const apiDescription = await prompt('Description', `${apiDisplayName} Dataverse API for seamless integration across the Pravia ecosystem.`);
  const port = await prompt('Port number', '4007');
  const packageScope = await prompt('Package scope', '@asyml8');

  rl.close();

  const templatePath = path.join(__dirname, 'base-api');
  const targetPath = path.join(__dirname, '../../api', apiName);

  if (fs.existsSync(targetPath)) {
    console.error(`\n❌ Error: Directory ${targetPath} already exists`);
    process.exit(1);
  }

  const replacements = {
    '{{API_NAME}}': apiName,
    '{{API_DISPLAY_NAME}}': apiDisplayName,
    '{{API_DISPLAY_NAME_UPPER}}': apiDisplayName.toUpperCase(),
    '{{API_DESCRIPTION}}': apiDescription,
    '{{PORT}}': port,
    '{{PACKAGE_NAME}}': `${packageScope}/pravia-${apiName}-api`,
    '{{APP_TITLE}}': `Pravia ${apiDisplayName} API`,
    '{{SERVER_NAME}}': `Pravia ${apiDisplayName} Server`,
    '{{SWAGGER_TITLE}}': `${apiDisplayName} API`,
    '{{SWAGGER_TAG}}': apiName.toLowerCase(),
  };

  console.log('\n📦 Generating API...');
  copyDirectory(templatePath, targetPath, replacements);

  console.log(`\n✅ API created at: ${targetPath}`);
  console.log(`\nNext steps:`);
  console.log(`  cd api/${apiName}`);
  console.log(`  pnpm install`);
  console.log(`  cp .env.example .env.local`);
  console.log(`  pnpm dev\n`);
})();
