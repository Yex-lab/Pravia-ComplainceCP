#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { promises as fs } from "fs";
import * as path from "path";
import { glob } from "glob";

// Types for our component analysis
interface ComponentInfo {
  name: string;
  path: string;
  type: 'functional' | 'class' | 'unknown';
  imports: string[];
  exports: string[];
  dependencies: string[];
  hooks: string[];
  hasTests: boolean;
  complexity: 'low' | 'medium' | 'high';
  reusabilityScore: number;
}

interface ComponentAnalysis {
  component: ComponentInfo;
  inUiPackage: boolean;
  extractionCandidate: boolean;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
}

interface DuplicatePattern {
  pattern: string;
  occurrences: Array<{
    file: string;
    lines: number[];
  }>;
  suggestion: string;
}

const MONOREPO_ROOT = process.env.MONOREPO_ROOT || process.cwd();
const MULE_CLIENT = path.join(MONOREPO_ROOT, 'apps/mule-next');
const UI_PACKAGE = path.join(MONOREPO_ROOT, 'packages/ui');

class ComponentAnalyzerServer {
  private server: Server;
  private componentCache: Map<string, ComponentInfo> = new Map();

  constructor() {
    this.server = new Server(
      {
        name: "component-analyzer-mcp",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
    this.setupErrorHandling();
  }

  private setupErrorHandling(): void {
    this.server.onerror = (error) => {
      console.error("[MCP Error]", error);
    };

    process.on("SIGINT", async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupHandlers(): void {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: "scan_components",
            description: "Scan mule-next for all React components and analyze their structure",
            inputSchema: {
              type: "object",
              properties: {
                directory: {
                  type: "string",
                  description: "Directory to scan (relative to mule-next/src)",
                  default: "components"
                }
              }
            }
          },
          {
            name: "find_extraction_candidates",
            description: "Identify components that are good candidates for extraction to UI package",
            inputSchema: {
              type: "object",
              properties: {
                minReusabilityScore: {
                  type: "number",
                  description: "Minimum reusability score (0-100)",
                  default: 70
                }
              }
            }
          },
          {
            name: "check_if_exists_in_ui",
            description: "Check if a component or similar component already exists in UI package",
            inputSchema: {
              type: "object",
              properties: {
                componentName: {
                  type: "string",
                  description: "Name of the component to check"
                }
              },
              required: ["componentName"]
            }
          },
          {
            name: "find_duplicate_patterns",
            description: "Find duplicate code patterns across components that could be consolidated",
            inputSchema: {
              type: "object",
              properties: {
                minOccurrences: {
                  type: "number",
                  description: "Minimum number of occurrences to report",
                  default: 2
                }
              }
            }
          },
          {
            name: "analyze_component_usage",
            description: "Analyze where a component is being used throughout the codebase",
            inputSchema: {
              type: "object",
              properties: {
                componentName: {
                  type: "string",
                  description: "Name of the component to analyze"
                }
              },
              required: ["componentName"]
            }
          },
          {
            name: "generate_extraction_plan",
            description: "Generate a detailed plan for extracting a component to the UI package",
            inputSchema: {
              type: "object",
              properties: {
                componentPath: {
                  type: "string",
                  description: "Path to the component file"
                }
              },
              required: ["componentPath"]
            }
          },
          {
            name: "track_migration_status",
            description: "Track which components have been migrated to UI package",
            inputSchema: {
              type: "object",
              properties: {}
            }
          }
        ] satisfies Tool[]
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        switch (request.params.name) {
          case "scan_components":
            return await this.handleScanComponents(request.params.arguments);

          case "find_extraction_candidates":
            return await this.handleFindExtractionCandidates(request.params.arguments);

          case "check_if_exists_in_ui":
            return await this.handleCheckIfExistsInUi(request.params.arguments);

          case "find_duplicate_patterns":
            return await this.handleFindDuplicatePatterns(request.params.arguments);

          case "analyze_component_usage":
            return await this.handleAnalyzeComponentUsage(request.params.arguments);

          case "generate_extraction_plan":
            return await this.handleGenerateExtractionPlan(request.params.arguments);

          case "track_migration_status":
            return await this.handleTrackMigrationStatus(request.params.arguments);

          default:
            return {
              content: [
                {
                  type: "text",
                  text: `Unknown tool: ${request.params.name}`
                }
              ]
            };
        }
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${error instanceof Error ? error.message : String(error)}`
            }
          ],
          isError: true
        };
      }
    });
  }

  private async handleScanComponents(args: any) {
    const directory = args?.directory || "components";
    const scanPath = path.join(PRAVIA_WEB, "src", directory);

    const componentFiles = await glob("**/*.{tsx,ts,jsx,js}", {
      cwd: scanPath,
      ignore: ["**/*.test.*", "**/*.spec.*", "**/*.stories.*"],
      absolute: true
    });

    const components: ComponentInfo[] = [];

    for (const file of componentFiles) {
      try {
        const info = await this.analyzeComponent(file);
        components.push(info);
        this.componentCache.set(file, info);
      } catch (error) {
        console.error(`Error analyzing ${file}:`, error);
      }
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            scannedDirectory: directory,
            totalComponents: components.length,
            components: components.map(c => ({
              name: c.name,
              path: path.relative(PRAVIA_WEB, c.path),
              type: c.type,
              complexity: c.complexity,
              reusabilityScore: c.reusabilityScore,
              hasTests: c.hasTests
            }))
          }, null, 2)
        }
      ]
    };
  }

  private async analyzeComponent(filePath: string): Promise<ComponentInfo> {
    const content = await fs.readFile(filePath, 'utf-8');
    const fileName = path.basename(filePath, path.extname(filePath));

    // Basic pattern matching for analysis
    const importMatches = content.match(/import\s+.*\s+from\s+['"]([^'"]+)['"]/g) || [];
    const imports = importMatches.map(imp => {
      const match = imp.match(/from\s+['"]([^'"]+)['"]/);
      return match ? match[1] : '';
    });

    const exportMatches = content.match(/export\s+(default\s+)?(function|const|class)\s+(\w+)/g) || [];
    const exports = exportMatches.map(exp => {
      const match = exp.match(/\s+(\w+)$/);
      return match ? match[1] : '';
    });

    const hookMatches = content.match(/use[A-Z]\w+/g) || [];
    const hooks = [...new Set(hookMatches)];

    const isFunctional = content.includes('const') && content.includes('=>') ||
                        content.includes('function');
    const isClass = content.includes('class') && content.includes('extends');

    // Calculate complexity based on various factors
    const lines = content.split('\n').length;
    const hasState = content.includes('useState') || content.includes('this.state');
    const hasEffects = content.includes('useEffect') || content.includes('componentDidMount');
    const complexityScore = lines + (hasState ? 20 : 0) + (hasEffects ? 20 : 0) + (hooks.length * 5);

    let complexity: 'low' | 'medium' | 'high';
    if (complexityScore < 100) complexity = 'low';
    else if (complexityScore < 300) complexity = 'medium';
    else complexity = 'high';

    // Calculate reusability score
    const hasPropsInterface = /interface\s+\w+Props/.test(content);
    const hasPropTypes = /PropTypes/.test(content);
    const hasDefaultProps = /defaultProps/.test(content);
    const hasDocumentation = /\/\*\*/.test(content);
    const isGeneric = !/(auth|login|signup|dashboard|admin)/i.test(content);
    const hasMinimalDeps = imports.filter(imp => !imp.startsWith('@mui') &&
                                                  !imp.startsWith('react')).length < 5;

    let reusabilityScore = 0;
    if (hasPropsInterface || hasPropTypes) reusabilityScore += 20;
    if (hasDefaultProps) reusabilityScore += 10;
    if (hasDocumentation) reusabilityScore += 15;
    if (isGeneric) reusabilityScore += 25;
    if (hasMinimalDeps) reusabilityScore += 20;
    if (complexity === 'low') reusabilityScore += 10;

    // Check for tests
    const testPath = filePath.replace(/\.(tsx|ts|jsx|js)$/, '.test.$1');
    const hasTests = await fs.access(testPath).then(() => true).catch(() => false);

    return {
      name: fileName,
      path: filePath,
      type: isClass ? 'class' : isFunctional ? 'functional' : 'unknown',
      imports,
      exports,
      dependencies: imports.filter(imp => !imp.startsWith('.')),
      hooks,
      hasTests,
      complexity,
      reusabilityScore
    };
  }

  private async handleFindExtractionCandidates(args: any) {
    const minScore = args?.minReusabilityScore || 70;

    // Get all cached components or scan if cache is empty
    if (this.componentCache.size === 0) {
      await this.handleScanComponents({ directory: "components" });
    }

    const candidates: ComponentAnalysis[] = [];

    for (const [, info] of this.componentCache) {
      const inUiPackage = await this.checkComponentInUiPackage(info.name);

      const extractionCandidate = info.reusabilityScore >= minScore && !inUiPackage;

      let priority: 'high' | 'medium' | 'low' = 'low';
      if (info.reusabilityScore >= 85) priority = 'high';
      else if (info.reusabilityScore >= 70) priority = 'medium';

      let effort: 'low' | 'medium' | 'high' = 'low';
      if (info.complexity === 'high') effort = 'high';
      else if (info.complexity === 'medium') effort = 'medium';

      let reason = '';
      if (extractionCandidate) {
        reason = `High reusability score (${info.reusabilityScore}), ${info.complexity} complexity`;
      } else if (inUiPackage) {
        reason = 'Already exists in UI package';
      } else {
        reason = `Low reusability score (${info.reusabilityScore})`;
      }

      if (extractionCandidate) {
        candidates.push({
          component: info,
          inUiPackage,
          extractionCandidate,
          reason,
          priority,
          effort
        });
      }
    }

    // Sort by priority and reusability score
    candidates.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority] ||
             b.component.reusabilityScore - a.component.reusabilityScore;
    });

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            totalCandidates: candidates.length,
            candidates: candidates.map(c => ({
              name: c.component.name,
              path: path.relative(PRAVIA_WEB, c.component.path),
              reusabilityScore: c.component.reusabilityScore,
              complexity: c.component.complexity,
              priority: c.priority,
              effort: c.effort,
              reason: c.reason,
              hasTests: c.component.hasTests
            }))
          }, null, 2)
        }
      ]
    };
  }

  private async checkComponentInUiPackage(componentName: string): Promise<boolean> {
    try {
      const uiComponentsPath = path.join(UI_PACKAGE, 'src/components');
      const uiFiles = await glob(`**/${componentName}*`, { cwd: uiComponentsPath });
      return uiFiles.length > 0;
    } catch {
      return false;
    }
  }

  private async handleCheckIfExistsInUi(args: any) {
    const componentName = args?.componentName;

    if (!componentName) {
      throw new Error("componentName is required");
    }

    const exists = await this.checkComponentInUiPackage(componentName);

    // Also check for similar components
    const uiComponentsPath = path.join(UI_PACKAGE, 'src/components');
    const allUiFiles = await glob('**/*.{tsx,ts}', { cwd: uiComponentsPath });
    const similarComponents = allUiFiles.filter(file => {
      const baseName = path.basename(file, path.extname(file)).toLowerCase();
      return baseName.includes(componentName.toLowerCase()) ||
             componentName.toLowerCase().includes(baseName);
    });

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            componentName,
            existsInUiPackage: exists,
            similarComponents: similarComponents.map(f => path.relative(UI_PACKAGE, path.join(uiComponentsPath, f))),
            recommendation: exists
              ? "Component already exists in UI package. Consider using or enhancing the existing version."
              : similarComponents.length > 0
                ? "Similar components found. Review before creating a new one."
                : "No similar components found. Safe to extract."
          }, null, 2)
        }
      ]
    };
  }

  private async handleFindDuplicatePatterns(args: any) {
    // This is a simplified implementation
    // In production, you'd use AST parsing for better accuracy
    const patterns: DuplicatePattern[] = [];
    const minOccurrences = args?.minOccurrences || 2;

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            note: "Duplicate pattern detection is a complex feature. Consider using tools like jscpd or implementing AST-based analysis for production use.",
            minOccurrences,
            patterns
          }, null, 2)
        }
      ]
    };
  }

  private async handleAnalyzeComponentUsage(args: any) {
    const componentName = args?.componentName;

    if (!componentName) {
      throw new Error("componentName is required");
    }

    const allFiles = await glob('**/*.{tsx,ts,jsx,js}', {
      cwd: path.join(PRAVIA_WEB, 'src'),
      ignore: ["**/*.test.*", "**/*.spec.*"],
      absolute: true
    });

    const usages: Array<{ file: string; lines: number[] }> = [];

    for (const file of allFiles) {
      const content = await fs.readFile(file, 'utf-8');
      const lines = content.split('\n');
      const matchingLines: number[] = [];

      lines.forEach((line, index) => {
        if (line.includes(componentName) &&
            (line.includes('import') || line.includes('<' + componentName))) {
          matchingLines.push(index + 1);
        }
      });

      if (matchingLines.length > 0) {
        usages.push({
          file: path.relative(PRAVIA_WEB, file),
          lines: matchingLines
        });
      }
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            componentName,
            totalUsages: usages.length,
            usages,
            recommendation: usages.length > 3
              ? "High usage count. Extracting to UI package would benefit multiple locations."
              : usages.length > 1
                ? "Moderate usage. Consider extraction if component is generic."
                : "Low usage. Only extract if component is highly reusable."
          }, null, 2)
        }
      ]
    };
  }

  private async handleGenerateExtractionPlan(args: any) {
    const componentPath = args?.componentPath;

    if (!componentPath) {
      throw new Error("componentPath is required");
    }

    const fullPath = path.isAbsolute(componentPath)
      ? componentPath
      : path.join(PRAVIA_WEB, componentPath);

    const info = await this.analyzeComponent(fullPath);
    // Future: incorporate usage and existence data into plan
    // const usageResult = await this.handleAnalyzeComponentUsage({ componentName: info.name });
    // const existsResult = await this.handleCheckIfExistsInUi({ componentName: info.name });

    const plan = {
      component: info.name,
      currentPath: path.relative(PRAVIA_WEB, fullPath),
      targetPath: `packages/ui/src/components/${info.name.toLowerCase()}`,
      steps: [
        "1. Review component dependencies and ensure they're compatible with UI package",
        "2. Check if similar component exists in UI package (run check_if_exists_in_ui tool)",
        "3. Create new directory in packages/ui/src/components/",
        "4. Copy component file and any related files (styles, tests, etc.)",
        "5. Update imports to use UI package dependencies",
        "6. Remove app-specific logic if any",
        "7. Add comprehensive prop types/interface documentation",
        "8. Create/update tests",
        "9. Add Storybook story",
        "10. Export from packages/ui/src/index.ts",
        "11. Update mule-next to import from @asyml8/ui",
        "12. Run tests in both packages",
        "13. Update documentation"
      ],
      dependencies: info.dependencies,
      estimatedEffort: info.complexity === 'low' ? '1-2 hours' :
                       info.complexity === 'medium' ? '3-4 hours' :
                       '1-2 days',
      warnings: [
        info.hasTests ? null : "⚠️ Component has no tests. Create tests before extraction.",
        info.dependencies.length > 10 ? "⚠️ High dependency count. Review for app-specific dependencies." : null,
        info.complexity === 'high' ? "⚠️ High complexity. Consider refactoring before extraction." : null
      ].filter(Boolean)
    };

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(plan, null, 2)
        }
      ]
    };
  }

  private async handleTrackMigrationStatus(_args: any) {
    // This would track components that have been migrated
    // For now, we'll compare what's in mule-next vs UI package

    const praviaComponents = await glob('**/*.tsx', {
      cwd: path.join(PRAVIA_WEB, 'src/components'),
      ignore: ["**/*.test.*", "**/*.stories.*"]
    });

    const uiComponents = await glob('**/*.tsx', {
      cwd: path.join(UI_PACKAGE, 'src/components')
    });

    const praviaNames = praviaComponents.map(f => path.basename(f, '.tsx').toLowerCase());
    const uiNames = uiComponents.map(f => path.basename(f, '.tsx').toLowerCase());

    const migrated = praviaNames.filter(name => uiNames.includes(name));
    const notMigrated = praviaNames.filter(name => !uiNames.includes(name));

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            summary: {
              totalInPraviaWeb: praviaComponents.length,
              totalInUiPackage: uiComponents.length,
              migratedCount: migrated.length,
              notMigratedCount: notMigrated.length
            },
            migratedComponents: migrated,
            notMigratedComponents: notMigrated,
            migrationProgress: `${Math.round((migrated.length / praviaComponents.length) * 100)}%`
          }, null, 2)
        }
      ]
    };
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Component Analyzer MCP Server running on stdio");
  }
}

const server = new ComponentAnalyzerServer();
server.run().catch(console.error);
