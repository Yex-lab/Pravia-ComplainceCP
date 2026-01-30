#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Load configuration and manifest
const configPath = path.join(__dirname, 'codegen.config.js');
const config = fs.existsSync(configPath) ? require(configPath) : {};

const manifestPath = path.join(__dirname, 'templates.manifest.json');
const manifest = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, 'utf8')) : {};

// Parse command line arguments
const [,, command, ...args] = process.argv;

// Handle special commands
if (command === 'list' || command === 'templates') {
  listTemplatesFromManifest();
  process.exit(0);
}

if (command === 'help' && args[0]) {
  showTemplateHelp(args[0]);
  process.exit(0);
}

if (!command || args.length === 0) {
  showUsage();
  process.exit(1);
}

const [templateType, name, ...options] = [command, ...args];

if (!templateType || !name) {
  showUsage();
  process.exit(1);
}

function showUsage() {
  console.log('Usage: pnpm codegen <command> [options]');
  console.log('\nCommands:');
  console.log('  list, templates           List all available templates');
  console.log('  help <template>           Show detailed help for a template');
  console.log('  <template> <name> [opts]  Generate code from template');
  console.log('\nExamples:');
  console.log('  pnpm codegen list');
  console.log('  pnpm codegen help list-page');
  console.log('  pnpm codegen component MyButton');
}

function listTemplatesFromManifest() {
  if (!manifest.templates) {
    console.log('No templates found in manifest');
    return;
  }

  console.log('Available Templates:\n');
  
  // Group by category
  const categories = {};
  Object.entries(manifest.templates).forEach(([key, template]) => {
    const category = template.category || 'Other';
    if (!categories[category]) categories[category] = [];
    categories[category].push({ key, ...template });
  });

  Object.entries(categories).forEach(([category, templates]) => {
    console.log(`${category}:`);
    templates.forEach(template => {
      console.log(`  ${template.key.padEnd(12)} - ${template.description}`);
    });
    console.log('');
  });

  console.log('Use "pnpm codegen help <template>" for detailed usage examples');
}

function showTemplateHelp(templateKey) {
  const template = manifest.templates?.[templateKey];
  if (!template) {
    console.error(`Template "${templateKey}" not found`);
    process.exit(1);
  }

  console.log(`${template.name}\n`);
  console.log(`Description: ${template.description}\n`);
  
  if (template.files) {
    console.log('Generated Files:');
    template.files.forEach(file => console.log(`  - ${file}`));
    console.log('');
  }

  if (template.variables) {
    console.log('Variables:');
    Object.entries(template.variables).forEach(([key, desc]) => {
      console.log(`  --${key.padEnd(12)} ${desc}`);
    });
    console.log('');
  }

  if (template.examples) {
    console.log('Examples:');
    template.examples.forEach(example => {
      console.log(`  ${example.command}`);
      console.log(`    ${example.description}\n`);
    });
  }
}

function listTemplates() {
  const templatesDir = path.join(__dirname, 'templates');
  if (!fs.existsSync(templatesDir)) return;
  
  const templates = fs.readdirSync(templatesDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
  
  templates.forEach(template => console.log(`  - ${template}`));
}

function parseOptions(options) {
  const parsed = {};
  for (let i = 0; i < options.length; i += 2) {
    const key = options[i]?.replace('--', '');
    const value = options[i + 1];
    if (key && value) parsed[key] = value;
  }
  return parsed;
}

function toKebabCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase();
}

function generateFromTemplate(templateType, name, options) {
  const templateDir = path.join(__dirname, 'templates', templateType);
  
  if (!fs.existsSync(templateDir)) {
    console.error(`Template "${templateType}" not found`);
    process.exit(1);
  }
  
  const templateConfig = require(path.join(templateDir, 'config.js'));
  
  // Process entityPlural properly and convert to kebab-case
  const entityPlural = options.entityPlural || `${name}s`;
  const kebabName = toKebabCase(name);
  const kebabEntityPlural = toKebabCase(entityPlural);
  
  // Create base context with template defaults first
  const baseContext = {
    ...config.globals,
    ...templateConfig.defaults
  };
  
  // Then override with actual values
  const context = {
    ...baseContext,
    name,
    entityPlural,
    kebabName,
    kebabEntityPlural,
    Name: name.charAt(0).toUpperCase() + name.slice(1),
    EntityPlural: entityPlural.charAt(0).toUpperCase() + entityPlural.slice(1),
    ...options
  };
  
  console.log('Context:', context); // Debug log
  
  // Determine correct output base directory
  let outputBase;
  if (process.cwd().includes('/packages/ui/codegen')) {
    // Running from codegen directory
    outputBase = path.join(process.cwd(), '../../../apps/pravia-web');
  } else if (process.cwd().includes('/packages/ui')) {
    // Running from ui package directory  
    outputBase = path.join(process.cwd(), '../../apps/pravia-web');
  } else {
    // Running from monorepo root
    outputBase = path.join(process.cwd(), 'apps/pravia-web');
  }
  
  console.log('Output base:', outputBase); // Debug log
  
  // Process each file in template
  processDirectory(templateDir, path.join(outputBase, templateConfig.outputPath || '.'), context);
  
  console.log(`✅ Generated ${templateType}: ${name}`);
}

function processDirectory(templateDir, outputDir, context) {
  const files = fs.readdirSync(templateDir);
  
  files.forEach(file => {
    if (file === 'config.js') return;
    
    const templatePath = path.join(templateDir, file);
    const outputPath = path.join(outputDir, processTemplate(file, context));
    
    if (fs.statSync(templatePath).isDirectory()) {
      fs.mkdirSync(outputPath, { recursive: true });
      processDirectory(templatePath, outputPath, context);
    } else {
      const content = fs.readFileSync(templatePath, 'utf8');
      const processedContent = processTemplate(content, context);
      
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      fs.writeFileSync(outputPath, processedContent);
      console.log(`Created: ${outputPath}`);
    }
  });
}

function processTemplate(template, context) {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    if (context.hasOwnProperty(key)) {
      let value = context[key];
      // For routePrefix in folder/file names, strip leading slash
      if (key === 'routePrefix' && typeof value === 'string' && value.startsWith('/')) {
        value = value.substring(1);
      }
      return value;
    }
    console.warn(`Template variable ${match} not found in context`);
    return match;
  });
}

// Run generator
const parsedOptions = parseOptions(options);
generateFromTemplate(templateType, name, parsedOptions);
