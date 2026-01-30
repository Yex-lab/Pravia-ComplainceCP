# Code Generator CLI

Deterministic code generator for creating common components, services, and stores.

## Installation

**Global Installation:**
```bash
npm install -g @asyml8/codegen
# or
pnpm add -g @asyml8/codegen
```

**Local Development:**
```bash
# From monorepo root
pnpm codegen

# Or directly
node packages/ui/codegen/index.js
```

## Usage

```bash
# List all available templates
codegen list

# Get help for a specific template
codegen help list-page

# Generate a React component
codegen component MyButton

# Generate a service
codegen service User --apiEndpoint /api/v1

# Generate a complete CRUD list page
codegen list-page Product --routePrefix /workspace

# Generate nested pages
codegen list-page Report --routePrefix /dashboard/analytics
```

## Publishing as CLI

```bash
# From codegen directory
cd packages/ui/codegen
npm publish

# Users can then install globally
npm install -g @asyml8/codegen
codegen list
```

## Adding New Templates

1. Create a new directory in `templates/`
2. Add a `config.js` file with template configuration
3. Create template files using `{{variable}}` syntax
4. Update `templates.manifest.json` with metadata

### Template Structure

```
templates/
├── my-template/
│   ├── config.js          # Template configuration
│   ├── {{name}}.tsx       # Template files
│   └── index.ts
```

### Config Options

```javascript
module.exports = {
  outputPath: 'src/components',  // Where to generate files
  defaults: {                    // Default template variables
    typescript: true,
    testing: false
  },
  postGenerate: [               // Commands to run after generation
    'pnpm lint:fix'
  ]
};
```

## Template Variables

- `{{name}}` - The name passed to the generator
- `{{author}}` - From global config
- `{{packageScope}}` - From global config
- Any custom variables passed via `--key value`

## Configuration

Global settings in `codegen.config.js`:

```javascript
module.exports = {
  globals: {
    author: 'Your Team',
    packageScope: '@yourorg'
  }
};
```
