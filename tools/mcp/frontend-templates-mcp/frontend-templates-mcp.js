#!/usr/bin/env node

/**
 * Frontend Templates MCP Server (Auto-Discover + Hardened)
 * 
 * Features:
 *  - Auto-discovers all subfolders under a given parent (e.g., mcp-templates/frontend/*)
 *  - Restricts access to declared base directories only
 *  - Blocks directory traversal attempts
 *  - Allows only .ts / .tsx files
 * 
 * Usage:
 *   node frontend-templates-mcp.js
 *   node frontend-templates-mcp.js --dir ../../mcp-templates/frontend
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import minimist from "minimist";
import path from "path";
import fs from "fs";

// ----------------------
// Logging function that outputs to stderr (visible in Q CLI)
// ----------------------
function logToQCLI(message) {
  console.error(`[MCP Frontend Templates] ${new Date().toISOString()}: ${message}`);
}

// ----------------------
// CLI args & Directory Resolution
// ----------------------
const args = minimist(process.argv.slice(2));

// Check multiple possible template directories in order of preference
const possibleDirs = [
  args.dir ? path.resolve(args.dir) : null,
  path.resolve("/Users/tonyhenderson/Documents/GitHub/faro/mcp-templates/frontend")
].filter(Boolean);

let baseDir = null;
for (const dir of possibleDirs) {
  if (fs.existsSync(dir)) {
    baseDir = dir;
    break;
  }
}

// If no existing directory found, create the default one
if (!baseDir) {
  baseDir = path.resolve("/Users/tonyhenderson/Documents/GitHub/faro/mcp-templates/frontend");
  fs.mkdirSync(baseDir, { recursive: true });
  logToQCLI(`📁 Created default templates directory: ${baseDir}`);
}

// ----------------------
// Layout and Context Analysis Functions
// ----------------------
function analyzeLayoutContext(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath, path.extname(filePath));
    
    // Detect layout components
    const layoutComponents = {
      hasDashboardContent: content.includes('DashboardContent'),
      hasCustomBreadcrumbs: content.includes('CustomBreadcrumbs'),
      hasLayoutWrapper: content.includes('Layout') || content.includes('Container'),
      usesNavigation: content.includes('paths.') || content.includes('RouterLink'),
      hasActionButtons: content.includes('action=') || content.includes('Button'),
      isPageComponent: content.includes('export default') && (filePath.includes('/page.') || filePath.includes('View')),
      isLayoutComponent: filePath.includes('/layout') || content.includes('children'),
    };
    
    // Extract layout patterns
    const layoutPatterns = {
      breadcrumbStructure: extractBreadcrumbPattern(content),
      actionButtonPattern: extractActionButtonPattern(content),
      navigationPaths: extractNavigationPaths(content),
      wrapperComponents: extractWrapperComponents(content),
    };
    
    return {
      fileName,
      filePath,
      layoutComponents,
      layoutPatterns,
      needsLayoutPreservation: layoutComponents.hasDashboardContent || layoutComponents.hasCustomBreadcrumbs,
      isStandalonePage: !layoutComponents.hasDashboardContent && layoutComponents.isPageComponent,
    };
  } catch (error) {
    logToQCLI(`Error analyzing layout context for ${filePath}: ${error.message}`);
    return null;
  }
}

function extractBreadcrumbPattern(content) {
  const breadcrumbMatch = content.match(/CustomBreadcrumbs[^}]*links=\{([^}]+)\}/s);
  return breadcrumbMatch ? breadcrumbMatch[1] : null;
}

function extractActionButtonPattern(content) {
  const actionMatch = content.match(/action=\{([^}]+)\}/s);
  return actionMatch ? actionMatch[1] : null;
}

function extractNavigationPaths(content) {
  const pathMatches = content.match(/paths\.[a-zA-Z.]+/g) || [];
  return pathMatches;
}

function extractWrapperComponents(content) {
  const wrappers = [];
  if (content.includes('DashboardContent')) wrappers.push('DashboardContent');
  if (content.includes('Container')) wrappers.push('Container');
  if (content.includes('Box')) wrappers.push('Box');
  return wrappers;
}

function analyzeExistingPageLayout(contextFiles) {
  if (!contextFiles || contextFiles.length === 0) return null;
  
  const layoutAnalysis = contextFiles.map(filePath => {
    const analysis = analyzeLayoutContext(filePath);
    return analysis;
  }).filter(Boolean);
  
  return {
    hasExistingLayout: layoutAnalysis.some(a => a.needsLayoutPreservation),
    layoutPatterns: layoutAnalysis.map(a => a.layoutPatterns),
    recommendedWrapper: layoutAnalysis.find(a => a.needsLayoutPreservation)?.layoutPatterns.wrapperComponents[0] || 'DashboardContent',
    existingNavigation: layoutAnalysis.flatMap(a => a.layoutPatterns.navigationPaths),
  };
}
function extractComponentInfo(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath, path.extname(filePath));
    
    // Extract imports, props, and key patterns
    const imports = content.match(/import.*from.*['"`].*['"`]/g) || [];
    const propsMatch = content.match(/interface\s+\w*Props\s*{([^}]*)}/s) || content.match(/type\s+\w*Props\s*=\s*{([^}]*)}/s);
    const props = propsMatch ? propsMatch[1].split('\n').map(line => line.trim()).filter(Boolean) : [];
    const muiComponents = imports.filter(imp => imp.includes('@mui')).map(imp => imp.match(/{([^}]+)}/)?.[1]?.split(',').map(c => c.trim())).flat().filter(Boolean);
    const hasTheme = content.includes('useTheme') || content.includes('theme.');
    const hasStyles = content.includes('sx=') || content.includes('styled');
    
    // Enhanced pattern detection
    const advancedPatterns = {
      hasTabs: content.includes('Tabs') || content.includes('Tab'),
      hasFilters: content.includes('filter') || content.includes('Filter'),
      hasSearch: content.includes('search') || content.includes('Search') || content.includes('TextField'),
      hasTable: content.includes('Table') || content.includes('DataGrid'),
      hasPagination: content.includes('Pagination') || content.includes('TablePagination'),
      hasStatusBadges: content.includes('Label') || content.includes('Chip') || content.includes('Badge'),
      hasAvatars: content.includes('Avatar'),
      hasActions: content.includes('IconButton') || content.includes('MenuList'),
      hasSelection: content.includes('Checkbox') || content.includes('selected'),
      hasBreadcrumbs: content.includes('CustomBreadcrumbs') || content.includes('Breadcrumbs'),
      hasToolbar: content.includes('Toolbar') || content.includes('toolbar'),
      hasDropdowns: content.includes('Select') || content.includes('MenuItem'),
      hasStatusTabs: content.includes('STATUS_OPTIONS') || (content.includes('Tab') && content.includes('status')),
      hasRoleFiltering: content.includes('role') && (content.includes('filter') || content.includes('Select')),
      hasCompanyData: content.includes('company') || content.includes('Company'),
      hasPhoneData: content.includes('phone') || content.includes('Phone'),
      hasEmailData: content.includes('email') || content.includes('Email'),
    };
    
    // Calculate sophistication score
    const sophisticationScore = Object.values(advancedPatterns).filter(Boolean).length;
    
    // Detect component type
    const componentType = detectComponentType(fileName, content, advancedPatterns);
    
    return {
      fileName,
      filePath,
      imports: imports.length,
      props,
      muiComponents,
      hasTheme,
      hasStyles,
      size: content.length,
      complexity: (content.match(/useState|useEffect|useCallback/g) || []).length,
      advancedPatterns,
      sophisticationScore,
      componentType,
    };
  } catch (error) {
    logToQCLI(`Error analyzing ${filePath}: ${error.message}`);
    return null;
  }
}

function detectComponentType(fileName, content, patterns) {
  if (fileName.includes('list') && patterns.hasTable && patterns.hasTabs) return 'sophisticated-list';
  if (fileName.includes('list') && patterns.hasTable) return 'table-list';
  if (fileName.includes('card') && patterns.hasAvatars) return 'card-list';
  if (fileName.includes('form')) return 'form';
  if (fileName.includes('view') && patterns.hasBreadcrumbs) return 'page-view';
  if (patterns.hasTable && patterns.hasFilters) return 'filtered-table';
  return 'basic-component';
}

function findBestPatternMatch(userRequest, allComponents) {
  const requestLower = userRequest.toLowerCase();
  
  // Score components based on request relevance and sophistication
  const scoredComponents = allComponents.map(comp => {
    let score = 0;
    
    // Keyword matching
    const keywords = ['user', 'contact', 'list', 'table', 'form', 'profile'];
    keywords.forEach(keyword => {
      if (requestLower.includes(keyword)) {
        if (comp.fileName.toLowerCase().includes(keyword)) score += 10;
        if (comp.muiComponents.some(mui => mui.toLowerCase().includes(keyword))) score += 5;
      }
    });
    
    // Pattern matching for sophisticated features
    if (requestLower.includes('table') || requestLower.includes('list')) {
      if (comp.advancedPatterns.hasTabs) score += 15;
      if (comp.advancedPatterns.hasStatusTabs) score += 20;
      if (comp.advancedPatterns.hasFilters) score += 10;
      if (comp.advancedPatterns.hasRoleFiltering) score += 15;
      if (comp.advancedPatterns.hasSearch) score += 8;
      if (comp.advancedPatterns.hasTable) score += 12;
      if (comp.advancedPatterns.hasAvatars) score += 8;
      if (comp.advancedPatterns.hasStatusBadges) score += 8;
      if (comp.advancedPatterns.hasActions) score += 6;
      if (comp.advancedPatterns.hasSelection) score += 6;
    }
    
    // Bonus for sophisticated components
    score += comp.sophisticationScore * 2;
    
    // Component type bonus
    if (comp.componentType === 'sophisticated-list') score += 25;
    if (comp.componentType === 'filtered-table') score += 20;
    if (comp.componentType === 'page-view') score += 15;
    
    return { ...comp, matchScore: score };
  });
  
  return scoredComponents
    .filter(comp => comp.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore);
}

function findSimilarComponents(targetComponent, allComponents) {
  return allComponents
    .filter(comp => comp && comp.fileName !== targetComponent.fileName)
    .map(comp => {
      let score = 0;
      
      // MUI component overlap
      const commonMui = comp.muiComponents.filter(mui => targetComponent.muiComponents.includes(mui));
      score += commonMui.length * 3;
      
      // Props similarity
      const commonProps = comp.props.filter(prop => 
        targetComponent.props.some(tProp => 
          prop.toLowerCase().includes(tProp.toLowerCase()) || 
          tProp.toLowerCase().includes(prop.toLowerCase())
        )
      );
      score += commonProps.length * 2;
      
      // Theme/styling patterns
      if (comp.hasTheme === targetComponent.hasTheme) score += 2;
      if (comp.hasStyles === targetComponent.hasStyles) score += 2;
      
      // Size similarity (prefer similar complexity)
      const sizeDiff = Math.abs(comp.size - targetComponent.size);
      if (sizeDiff < 500) score += 3;
      else if (sizeDiff < 1000) score += 1;
      
      return { ...comp, similarityScore: score, commonMui, commonProps };
    })
    .filter(comp => comp.similarityScore > 0)
    .sort((a, b) => b.similarityScore - a.similarityScore);
}

function analyzeDirectory(dirPath) {
  const components = [];
  
  function scanDir(currentPath) {
    try {
      const entries = fs.readdirSync(currentPath, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(currentPath, entry.name);
        
        if (entry.isDirectory()) {
          scanDir(fullPath);
        } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
          const componentInfo = extractComponentInfo(fullPath);
          if (componentInfo) {
            components.push(componentInfo);
          }
        }
      }
    } catch (error) {
      logToQCLI(`Error scanning directory ${currentPath}: ${error.message}`);
    }
  }
  
  scanDir(dirPath);
  return components;
}
function getSubDirs(basePath) {
  if (!fs.existsSync(basePath)) {
    logToQCLI(`❌ Base directory not found: ${basePath}`);
    process.exit(1);
  }

  const entries = fs.readdirSync(basePath, { withFileTypes: true });
  logToQCLI(`📁 Found ${entries.length} entries in ${basePath}`);
  
  const subDirs = entries
    .filter(entry => {
      const isDir = entry.isDirectory();
      logToQCLI(`  ${isDir ? '📂' : '📄'} ${entry.name} ${isDir ? '(directory - included)' : '(file - skipped)'}`);
      return isDir;
    })
    .map(entry => {
      const fullPath = path.resolve(basePath, entry.name);
      logToQCLI(`  ✅ Added template directory: ${fullPath}`);
      return fullPath;
    });
  
  logToQCLI(`📂 Discovered ${subDirs.length} template directories total`);
  return subDirs;
}

const absDirs = getSubDirs(baseDir);

// ----------------------
// Path Validation
// ----------------------
function safePath(baseDir, requestedPath) {
  logToQCLI(`🔍 Validating path request: "${requestedPath}" in base directory: "${baseDir}"`);
  
  const fullPath = path.resolve(baseDir, requestedPath);
  logToQCLI(`🔗 Resolved full path: "${fullPath}"`);

  // Must remain inside baseDir
  if (!fullPath.startsWith(baseDir)) {
    logToQCLI(`🚫 SECURITY: Path escape attempt blocked - resolved path "${fullPath}" is outside base "${baseDir}"`);
    throw new Error(`🚫 Path escape attempt blocked: ${requestedPath}`);
  }
  logToQCLI(`✅ Security check passed - path is within allowed base directory`);

  // Check file extension
  const ext = path.extname(fullPath);
  logToQCLI(`🔍 File extension detected: "${ext}"`);
  if (!fullPath.endsWith(".ts") && !fullPath.endsWith(".tsx")) {
    logToQCLI(`🚫 EXTENSION: Invalid file extension "${ext}" - only .ts and .tsx allowed`);
    throw new Error(`🚫 Only .ts and .tsx files are allowed: ${requestedPath}`);
  }
  logToQCLI(`✅ Extension check passed - "${ext}" is allowed`);

  // Check if file exists
  const exists = fs.existsSync(fullPath);
  logToQCLI(`🔍 File existence check: ${exists ? 'EXISTS' : 'NOT FOUND'} - "${fullPath}"`);
  if (!exists) {
    // List what files ARE available in the directory
    const dir = path.dirname(fullPath);
    if (fs.existsSync(dir)) {
      const availableFiles = fs.readdirSync(dir).filter(f => f.endsWith('.ts') || f.endsWith('.tsx'));
      logToQCLI(`📋 Available .ts/.tsx files in "${dir}": [${availableFiles.join(', ')}]`);
    }
    logToQCLI(`🚫 FILE NOT FOUND: "${requestedPath}" resolved to "${fullPath}"`);
    throw new Error(`🚫 File does not exist: ${requestedPath}`);
  }

  logToQCLI(`✅ ALL CHECKS PASSED - File access granted: "${fullPath}"`);
  return fullPath;
}

// ----------------------
// Initialize Custom MCP Server with Component Analysis
// ----------------------
logToQCLI("🚀 Starting Frontend Templates MCP Server with Component Analysis...");

const server = new Server(
  {
    name: "frontend-templates",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Add component analysis tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "analyze_components",
        description: "Analyze components in template directories and find similar patterns",
        inputSchema: {
          type: "object",
          properties: {
            target_file: {
              type: "string",
              description: "Path to target component file to find matches for"
            }
          }
        }
      },
      {
        name: "find_similar_components",
        description: "Find components similar to a given component based on props, MUI usage, and patterns",
        inputSchema: {
          type: "object",
          properties: {
            component_name: {
              type: "string",
              description: "Name of component to find similar matches for"
            },
            min_score: {
              type: "number",
              description: "Minimum similarity score (default: 3)",
              default: 3
            }
          }
        }
      },
      {
        name: "list_template_components",
        description: "List all available template components with their characteristics",
        inputSchema: {
          type: "object",
          properties: {}
        }
      },
      {
        name: "recommend_solution",
        description: "Analyze user request, recommend components, show mockup, and ask for approval before proceeding",
        inputSchema: {
          type: "object",
          properties: {
            user_request: {
              type: "string",
              description: "User's request or requirement description"
            },
            context_files: {
              type: "array",
              items: { type: "string" },
              description: "Optional: Paths to relevant existing files for context"
            }
          },
          required: ["user_request"]
        }
      }
    ]
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  logToQCLI(`🔧 Tool called: ${name} with args: ${JSON.stringify(args)}`);
  
  try {
    switch (name) {
      case "analyze_components": {
        logToQCLI(`📊 Starting component analysis across ${absDirs.length} directories...`);
        
        const allComponents = [];
        for (const dir of absDirs) {
          logToQCLI(`🔍 Scanning directory: ${dir}`);
          const components = analyzeDirectory(dir);
          logToQCLI(`   Found ${components.length} components`);
          allComponents.push(...components);
        }
        
        logToQCLI(`✅ Analysis complete: ${allComponents.length} total components found`);
        
        if (args.target_file) {
          logToQCLI(`🎯 Analyzing target file: ${args.target_file}`);
          const targetInfo = extractComponentInfo(args.target_file);
          if (targetInfo) {
            logToQCLI(`   Target uses: ${targetInfo.muiComponents.join(', ')}`);
            const similar = findSimilarComponents(targetInfo, allComponents);
            logToQCLI(`   Found ${similar.length} similar components`);
            
            return {
              content: [{
                type: "text",
                text: `# Component Analysis Results

## Target Component: ${targetInfo.fileName}
- **MUI Components**: ${targetInfo.muiComponents.join(', ')}
- **Props**: ${targetInfo.props.length} defined
- **Has Theme**: ${targetInfo.hasTheme}
- **File Size**: ${targetInfo.size} chars

## Top 5 Similar Components:
${similar.slice(0, 5).map((comp, i) => `
${i + 1}. **${comp.fileName}** (Score: ${comp.similarityScore})
   - Path: ${comp.filePath}
   - Shared MUI: ${comp.commonMui.join(', ')}
   - Similar Props: ${comp.commonProps.length}
`).join('')}

**Total Components Analyzed**: ${allComponents.length}

**Recommendation**: Use the highest scoring component as your starting point and modify the differing props/MUI components.`
              }]
            };
          }
        }
        
        const summary = `# All Template Components (${allComponents.length} found)

${allComponents.map(comp => `
## ${comp.fileName}
- **Path**: ${comp.filePath}
- **MUI**: ${comp.muiComponents.join(', ')}
- **Props**: ${comp.props.length}
- **Theme**: ${comp.hasTheme ? '✅' : '❌'}
- **Complexity**: ${comp.complexity} hooks
`).join('')}`;
        
        return {
          content: [{
            type: "text", 
            text: summary
          }]
        };
      }
      
      case "find_similar_components": {
        logToQCLI(`🔍 Searching for components similar to: ${args.component_name}`);
        
        const allComponents = [];
        for (const dir of absDirs) {
          const components = analyzeDirectory(dir);
          allComponents.push(...components);
        }
        
        const target = allComponents.find(comp => 
          comp.fileName.toLowerCase().includes(args.component_name.toLowerCase())
        );
        
        if (!target) {
          const available = allComponents.map(c => c.fileName).join(', ');
          logToQCLI(`❌ Component "${args.component_name}" not found`);
          return {
            content: [{
              type: "text",
              text: `❌ Component "${args.component_name}" not found.\n\n**Available components**: ${available}`
            }]
          };
        }
        
        logToQCLI(`✅ Found target: ${target.fileName}`);
        const similar = findSimilarComponents(target, allComponents)
          .filter(comp => comp.similarityScore >= (args.min_score || 3));
        
        logToQCLI(`📊 Found ${similar.length} similar components above score ${args.min_score || 3}`);
        
        return {
          content: [{
            type: "text",
            text: `# Similar Components to "${target.fileName}"

## Target Component Analysis:
- **MUI Components**: ${target.muiComponents.join(', ')}
- **Props**: ${target.props.length} defined
- **Has Theme**: ${target.hasTheme}
- **Complexity**: ${target.complexity} hooks

## Similar Matches (Score ≥ ${args.min_score || 3}):

${similar.map((comp, i) => `
### ${i + 1}. ${comp.fileName} (Score: ${comp.similarityScore})
- **Path**: ${comp.filePath}
- **Shared MUI**: ${comp.commonMui.join(', ')}
- **Similar Props**: ${comp.commonProps.length}
- **Why Similar**: Shares ${comp.commonMui.length} MUI components, ${comp.commonProps.length} similar props
`).join('')}

## 🎯 Recommendations:
${similar.slice(0, 3).map((comp, i) => `
${i + 1}. **${comp.fileName}** - Best match with score ${comp.similarityScore}
   - Copy this component and modify: ${comp.commonMui.length > 0 ? 'MUI components already match' : 'Update MUI imports'}
`).join('')}`
          }]
        };
      }
      
      case "list_template_components": {
        logToQCLI(`📋 Listing all template components...`);
        
        const allComponents = [];
        for (const dir of absDirs) {
          const components = analyzeDirectory(dir);
          allComponents.push(...components);
        }
        
        const muiUsage = allComponents.reduce((acc, comp) => {
          comp.muiComponents.forEach(mui => {
            acc[mui] = (acc[mui] || 0) + 1;
          });
          return acc;
        }, {});
        
        logToQCLI(`📊 Found ${allComponents.length} components using ${Object.keys(muiUsage).length} different MUI components`);
        
        return {
          content: [{
            type: "text",
            text: `# Template Components Overview

**Total Components**: ${allComponents.length}

## Most Used MUI Components:
${Object.entries(muiUsage)
  .sort(([,a], [,b]) => b - a)
  .slice(0, 10)
  .map(([mui, count]) => `- **${mui}**: ${count} components`)
  .join('\n')}

## All Components:
${allComponents.map(comp => `
### ${comp.fileName}
- **Path**: \`${comp.filePath}\`
- **MUI**: ${comp.muiComponents.join(', ')}
- **Props**: ${comp.props.length} defined
- **Theme**: ${comp.hasTheme ? '✅' : '❌'}
- **Complexity**: ${comp.complexity} hooks
`).join('')}`
          }]
        };
      }
      
      case "recommend_solution": {
        logToQCLI(`🎯 Analyzing user request: "${args.user_request}"`);
        
        // Analyze all available components
        const allComponents = [];
        for (const dir of absDirs) {
          const components = analyzeDirectory(dir);
          allComponents.push(...components);
        }
        
        logToQCLI(`📊 Found ${allComponents.length} template components for analysis`);
        
        // Analyze context files and layout
        let contextAnalysis = "";
        let layoutAnalysis = null;
        if (args.context_files && args.context_files.length > 0) {
          logToQCLI(`🔍 Analyzing ${args.context_files.length} context files for layout patterns`);
          
          contextAnalysis = args.context_files.map(filePath => {
            try {
              const info = extractComponentInfo(filePath);
              const layoutInfo = analyzeLayoutContext(filePath);
              return `**${info.fileName}**: Uses ${info.muiComponents.join(', ')}, ${info.props.length} props, ${info.hasTheme ? 'themed' : 'no theme'}${layoutInfo?.needsLayoutPreservation ? ' (has dashboard layout)' : ''}`;
            } catch (error) {
              return `**${filePath}**: Could not analyze - ${error.message}`;
            }
          }).join('\n');
          
          layoutAnalysis = analyzeExistingPageLayout(args.context_files);
        }
        
        // Find relevant components using enhanced pattern matching
        const bestMatches = findBestPatternMatch(args.user_request, allComponents);
        const relevantComponents = bestMatches.slice(0, 5);
        
        logToQCLI(`✅ Found ${relevantComponents.length} relevant components with scores: ${relevantComponents.map(c => `${c.fileName}(${c.matchScore})`).join(', ')}`);
        
        // Enhanced component analysis for display
        const componentAnalysis = relevantComponents.map((comp, i) => `
${i + 1}. **${comp.fileName}** (Match Score: ${comp.matchScore}, Type: ${comp.componentType})
   - MUI Components: ${comp.muiComponents.join(', ')}
   - Advanced Features: ${Object.entries(comp.advancedPatterns).filter(([k,v]) => v).map(([k]) => k).join(', ')}
   - Props: ${comp.props.length} defined
   - Theme Support: ${comp.hasTheme ? '✅' : '❌'}
   - Sophistication: ${comp.sophisticationScore}/17
   - Path: \`${comp.filePath}\`
`).join('');
        
        // Layout preservation questions
        const layoutQuestions = layoutAnalysis?.hasExistingLayout ? `

## 🏗️ Layout Analysis
**Existing Layout Detected**: Your current code uses dashboard layout components
**Recommended Wrapper**: ${layoutAnalysis.recommendedWrapper}
**Navigation Paths**: ${layoutAnalysis.existingNavigation.join(', ') || 'None detected'}

### Layout Preservation Questions:
- **Should I preserve the existing dashboard layout?** (DashboardContent, CustomBreadcrumbs)
- **Keep existing navigation patterns?** (breadcrumbs, action buttons)
- **Maintain current page structure?** (wrapper components, spacing)` : `

## 🏗️ Layout Recommendations
**No existing layout detected** - I'll create a standalone page structure
**Recommended**: Use DashboardContent wrapper for consistency with dashboard pages`;

        return {
          content: [{
            type: "text",
            text: `# 🎯 Solution Recommendation

## 📋 Request Analysis
**User Request**: ${args.user_request}

${contextAnalysis ? `## 📁 Current Context Analysis\n${contextAnalysis}\n` : ''}

${layoutQuestions}

## 💡 Recommended Approach
Based on your request and available templates, I recommend using the **${relevantComponents[0]?.fileName || 'user-table pattern'}** as your starting point.

### 🏗️ Recommended Components:
${componentAnalysis}

## 🎨 ASCII Mockup
\`\`\`
┌─────────────────────────────────────────────────────────────┐
│  📋 ${args.user_request.includes('contact') ? 'Contacts' : 'Users'} Page                                           │
├─────────────────────────────────────────────────────────────┤
│  🏠 Dashboard > ${args.user_request.includes('contact') ? 'Contacts' : 'Users'}                    [🔄 Refresh] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🔍 Search...                    [🔽 Filter] [⚙️ Actions]    │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ ☐ │ Avatar │ Name         │ Email        │ Role │ Status │ │
│  ├───┼────────┼──────────────┼──────────────┼──────┼────────┤ │
│  │ ☐ │   👤   │ John Smith   │ john@co.com  │ Dev  │ Active │ │
│  │ ☐ │   👤   │ Jane Doe     │ jane@co.com  │ Des  │ Active │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                             │
│                    ◀ 1 2 3 4 5 ▶                          │
└─────────────────────────────────────────────────────────────┘
\`\`\`

## 🛠️ Implementation Plan
1. **Analyze existing layout** - Preserve dashboard structure if present
2. **Create main view component** - Match existing page patterns
3. **Create table components** - Follow established component standards  
4. **Add Supabase integration** - Data fetching with proper error handling
5. **Maintain theme consistency** - Use existing icons, labels, utilities

## ⚠️ APPROVAL REQUIRED

**🔴 STOP - Please confirm before I proceed:**

✅ **Do you approve this approach?**
✅ **Should I preserve existing layout patterns?**
✅ **Any modifications to the mockup?**  
✅ **Additional features needed?** (search, filters, actions, etc.)
✅ **Specific styling preferences?**
✅ **Different data structure requirements?**

**Type your approval and any changes, then I'll create the components following your established patterns.**`
          }]
        };
      }
      
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    logToQCLI(`❌ Tool error: ${error.message}`);
    return {
      content: [{
        type: "text",
        text: `❌ **Error**: ${error.message}`
      }],
      isError: true
    };
  }
});

// Start the server
const transport = new StdioServerTransport();
server.connect(transport);

logToQCLI("✅ MCP Server with Component Analysis ready");