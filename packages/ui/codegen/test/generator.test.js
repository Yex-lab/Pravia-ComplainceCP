import { describe, test, beforeEach, afterEach, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import os from 'os';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Test configuration
const TEST_OUTPUT_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'codegen-test-'));
const GENERATOR_PATH = path.join(__dirname, '../index.js');

describe('Code Generator Tests', () => {
  beforeEach(() => {
    // Create mock monorepo structure in temp directory
    fs.mkdirSync(path.join(TEST_OUTPUT_DIR, 'apps/pravia-web/src'), { recursive: true });
    fs.mkdirSync(path.join(TEST_OUTPUT_DIR, 'packages/ui/codegen'), { recursive: true });
  });

  afterEach(() => {
    // Clean up temp directory
    if (fs.existsSync(TEST_OUTPUT_DIR)) {
      fs.rmSync(TEST_OUTPUT_DIR, { recursive: true, force: true });
    }
  });

  test('should generate submission entity-list-page with correct file structure', () => {
    // Run generator from temp monorepo root
    const result = execSync(
      `node ${GENERATOR_PATH} entity-list-page submission --routePrefix /my-workspace --entityPlural submissions`,
      { 
        encoding: 'utf8', 
        cwd: TEST_OUTPUT_DIR,
        env: { ...process.env }
      }
    );

    console.log('Generator output:', result);

    // Verify expected files were created
    const expectedFiles = [
      'apps/pravia-web/src/_mock/submission.mock.ts',
      'apps/pravia-web/src/app/my-workspace/submissions/page.tsx',
      'apps/pravia-web/src/sections/my-workspace/submissions/index.ts',
      'apps/pravia-web/src/sections/my-workspace/submissions/view/submissions-list-view.tsx',
      'apps/pravia-web/src/services/submission.service.ts',
      'apps/pravia-web/src/stores/submissions.store.ts'
    ];

    expectedFiles.forEach(filePath => {
      const fullPath = path.join(TEST_OUTPUT_DIR, filePath);
      expect(fs.existsSync(fullPath)).toBe(true);
      console.log(`✓ Created: ${filePath}`);
    });

    // Verify no admin folders were created
    const adminPaths = [
      'apps/pravia-web/src/app/admin',
      'apps/pravia-web/src/sections/admin'
    ];

    adminPaths.forEach(adminPath => {
      const fullPath = path.join(TEST_OUTPUT_DIR, adminPath);
      expect(fs.existsSync(fullPath)).toBe(false);
      console.log(`✓ No admin folder: ${adminPath}`);
    });
  });

  test('should properly substitute template variables in file contents with PascalCase', () => {
    execSync(
      `node ${GENERATOR_PATH} entity-list-page submission --routePrefix /my-workspace --entityPlural submissions`,
      { 
        encoding: 'utf8', 
        cwd: TEST_OUTPUT_DIR 
      }
    );

    // Check page.tsx content - should use PascalCase for React components
    const pageContent = fs.readFileSync(
      path.join(TEST_OUTPUT_DIR, 'apps/pravia-web/src/app/my-workspace/submissions/page.tsx'),
      'utf8'
    );
    
    expect(pageContent).toContain('SubmissionListView');
    expect(pageContent).toContain('src/sections/my-workspace/submissions');
    expect(pageContent).not.toContain('submissionListView'); // Should not have lowercase component
    expect(pageContent).not.toMatch(/\{\{\w+\}\}/); // No template variables should remain
    console.log('✓ Page content properly substituted with PascalCase');

    // Check service content - should use PascalCase for class names
    const serviceContent = fs.readFileSync(
      path.join(TEST_OUTPUT_DIR, 'apps/pravia-web/src/services/submission.service.ts'),
      'utf8'
    );
    
    expect(serviceContent).toContain('class SubmissionService');
    expect(serviceContent).toContain('SubmissionData');
    expect(serviceContent).toContain('export const submissionService = new SubmissionService()');
    expect(serviceContent).toContain('/api/submissions');
    expect(serviceContent).not.toMatch(/\{\{\w+\}\}/); // No template variables should remain
    console.log('✓ Service content properly substituted with PascalCase');

    // Check store content - should import from @asyml8/ui
    const storeContent = fs.readFileSync(
      path.join(TEST_OUTPUT_DIR, 'apps/pravia-web/src/stores/submissions.store.ts'),
      'utf8'
    );
    
    expect(storeContent).toContain("from '@asyml8/ui'");
    expect(storeContent).toContain('submissionService');
    expect(storeContent).not.toContain("from './base-store'");
    expect(storeContent).not.toMatch(/\{\{\w+\}\}/); // No template variables should remain
    console.log('✓ Store content properly imports from @asyml8/ui');

    // Check ListView component - should use PascalCase function name
    const listViewContent = fs.readFileSync(
      path.join(TEST_OUTPUT_DIR, 'apps/pravia-web/src/sections/my-workspace/submissions/view/submissions-list-view.tsx'),
      'utf8'
    );
    
    expect(listViewContent).toContain('export function SubmissionListView()');
    expect(listViewContent).toContain('submissionService');
    expect(listViewContent).toContain('SubmissionData');
    expect(listViewContent).toContain('interface Submission');
    expect(listViewContent).toContain('transformSubmission');
    expect(listViewContent).not.toContain('submissionListView');
    // Check that no template variables remain (should not contain {{ followed by word characters and }})
    expect(listViewContent).not.toMatch(/\{\{\w+\}\}/);
    console.log('✓ ListView content properly uses PascalCase');
  });

  test('should create correct folder structure for route prefix', () => {
    execSync(
      `node ${GENERATOR_PATH} entity-list-page submission --routePrefix /my-workspace --entityPlural submissions`,
      { 
        encoding: 'utf8', 
        cwd: TEST_OUTPUT_DIR 
      }
    );

    // Verify correct folder structure
    expect(fs.existsSync(path.join(TEST_OUTPUT_DIR, 'apps/pravia-web/src/sections/my-workspace'))).toBe(true);
    expect(fs.existsSync(path.join(TEST_OUTPUT_DIR, 'apps/pravia-web/src/app/my-workspace'))).toBe(true);
    
    // Verify no malformed folders
    expect(fs.existsSync(path.join(TEST_OUTPUT_DIR, 'apps/pravia-web/src/sectionsmy-workspace'))).toBe(false);
    expect(fs.existsSync(path.join(TEST_OUTPUT_DIR, 'apps/pravia-web/src/sections{{routePrefix}}'))).toBe(false);
    
    console.log('✓ Correct folder structure created');
  });
});
