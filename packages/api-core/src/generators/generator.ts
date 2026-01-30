import { readdir, readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export interface APIGeneratorOptions {
  projectName: string;           // "pravia-data-api"
  apiTitle: string;             // "Pravia Data API"
  description: string;          // "Data Management API"
  port: number;                 // 4000
  databaseName: string;         // "pravia_data"
  includeSupabase: boolean;     // true/false
  includeAWS: boolean;          // true/false
  includeRedis: boolean;        // true/false
  swaggerPath: string;          // "docs"
  healthEndpoints: boolean;     // true
  outputDir: string;            // "./my-new-api"
}

export class APIGenerator {
  private templatesDir: string;

  constructor() {
    this.templatesDir = join(__dirname, 'templates');
  }

  async generate(options: APIGeneratorOptions): Promise<void> {
    console.log(`🚀 Generating ${options.apiTitle}...`);

    // Create output directory structure
    if (!existsSync(options.outputDir)) {
      await mkdir(options.outputDir, { recursive: true });
    }

    // Create required directories
    const dirs = [
      'src/modules/health',
      'src/modules/helloworld',
      'src/database/migrations',
      'src/database/scripts',
      'test',
      'docs',
      'load-tests',
      'public/static/swagger/assets'
    ];

    for (const dir of dirs) {
      await mkdir(join(options.outputDir, dir), { recursive: true });
    }

    // Process all template files
    await this.processTemplateDirectory(this.templatesDir, options.outputDir, options);

    console.log(`✅ Generated ${options.apiTitle} successfully!`);
    console.log(`📁 Location: ${options.outputDir}`);
    console.log(`📋 Next steps:`);
    console.log(`   cd ${options.outputDir}`);
    console.log(`   pnpm install`);
    console.log(`   cp .env.example .env`);
    console.log(`   pnpm dev`);
  }

  private async processTemplateDirectory(templateDir: string, outputDir: string, options: APIGeneratorOptions): Promise<void> {
    const items = await readdir(templateDir, { withFileTypes: true });

    for (const item of items) {
      const templatePath = join(templateDir, item.name);
      let outputPath = join(outputDir, item.name.replace('.template', ''));

      if (item.isDirectory()) {
        // Handle special directory mappings
        if (item.name === 'project') {
          // Files in project/ go to root
          await this.processTemplateDirectory(templatePath, outputDir, options);
          continue;
        } else if (item.name === 'database') {
          // Files in database/ go to src/database/
          const srcDbPath = join(outputDir, 'src', 'database');
          await mkdir(srcDbPath, { recursive: true });
          await this.processTemplateDirectory(templatePath, srcDbPath, options);
          continue;
        } else if (item.name === 'modules') {
          // Files in modules/ go to src/modules/
          const srcModulesPath = join(outputDir, 'src', 'modules');
          await mkdir(srcModulesPath, { recursive: true });
          await this.processTemplateDirectory(templatePath, srcModulesPath, options);
          continue;
        } else if (item.name === 'auth' && options.includeSupabase) {
          // Files in auth/ go to src/auth/ (only if Supabase is enabled)
          const srcAuthPath = join(outputDir, 'src', 'auth');
          await mkdir(srcAuthPath, { recursive: true });
          await this.processTemplateDirectory(templatePath, srcAuthPath, options);
          continue;
        }
        
        await mkdir(outputPath, { recursive: true });
        await this.processTemplateDirectory(templatePath, outputPath, options);
      } else if (item.name.endsWith('.template')) {
        await this.processTemplateFile(templatePath, outputPath, options);
      }
    }
  }

  private async processTemplateFile(templatePath: string, outputPath: string, options: APIGeneratorOptions): Promise<void> {
    let content = await readFile(templatePath, 'utf-8');

    // Replace placeholders
    content = content
      .replace(/{{PROJECT_NAME}}/g, options.projectName)
      .replace(/{{PROJECT_KEBAB}}/g, this.toKebabCase(options.projectName))
      .replace(/{{API_TITLE}}/g, options.apiTitle)
      .replace(/{{DESCRIPTION}}/g, options.description)
      .replace(/{{PORT}}/g, options.port.toString())
      .replace(/{{DATABASE_NAME}}/g, options.databaseName)
      .replace(/{{SWAGGER_PATH}}/g, options.swaggerPath);

    // Conditional content
    content = this.processConditionals(content, {
      includeSupabase: options.includeSupabase,
      includeAWS: options.includeAWS,
      includeRedis: options.includeRedis,
      healthEndpoints: options.healthEndpoints,
    });

    await writeFile(outputPath, content);
    console.log(`📝 Generated: ${outputPath}`);
  }

  private processConditionals(content: string, conditions: Record<string, boolean>): string {
    // Process {{#if condition}} blocks
    for (const [key, value] of Object.entries(conditions)) {
      const ifRegex = new RegExp(`{{#if ${key}}}([\\s\\S]*?){{/if}}`, 'g');
      content = content.replace(ifRegex, value ? '$1' : '');
    }
    return content;
  }

  private toKebabCase(str: string): string {
    return str
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/[\s_]+/g, '-')
      .toLowerCase();
  }
}
