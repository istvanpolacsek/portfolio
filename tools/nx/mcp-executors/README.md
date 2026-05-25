# MCP NX Executors

Custom NX executors for Anthropic Model Context Protocol (MCP) server projects.

## Overview

This library provides a set of specialized executors designed to streamline common MCP server development workflows. While standard NX executors handle generic Node.js builds, these executors are tailored to MCP patterns: tool registration, schema validation, and server lifecycle management.

## Executors

### 1. **validate-tools**

Validates MCP tool definitions and schemas are correctly structured.

**Usage:**
```json
{
  "validate-tools": {
    "executor": "@portfolio/nx-mcp-executors:validate-tools",
    "options": {
      "toolsPath": "src/tools",
      "strict": false
    }
  }
}
```

**Options:**
- `toolsPath` (string): Path to tools directory - default: `src/tools`
- `strict` (boolean): Fail on any validation warnings - default: `false`

**Output:**
- Validates tool definitions have required fields (name, description, inputSchema)
- Reports valid and invalid tools
- Exits with code 1 if strict mode and errors found

---

### 2. **validate-schema**

Validates JSON schemas for MCP tool inputs comply with JSON Schema spec.

**Usage:**
```json
{
  "validate-schema": {
    "executor": "@portfolio/nx-mcp-executors:validate-schema",
    "options": {
      "schemaPath": "src/schemas",
      "testDataPath": "src/schemas/fixtures"
    }
  }
}
```

**Options:**
- `schemaPath` (string): Path to schema files - default: `src/schemas`
- `testDataPath` (string|null): Path to test data for validation - default: `null`

**Output:**
- Validates all JSON schemas in the directory
- Optionally validates test data against schemas
- Reports schema compliance issues

---

### 3. **test-tools**

Runs MCP tool implementations against test inputs to verify correctness.

**Usage:**
```json
{
  "test-tools": {
    "executor": "@portfolio/nx-mcp-executors:test-tools",
    "options": {
      "toolsPath": "src/tools",
      "testFixturesPath": "src/tools/__fixtures__",
      "bail": true
    }
  }
}
```

**Options:**
- `toolsPath` (string): Path to tools directory - default: `src/tools`
- `testFixturesPath` (string|null): Path to test fixtures - default: `null`
- `bail` (boolean): Stop on first failure - default: `true`

**Output:**
- Validates tool structure (exports, description, schema)
- Loads and validates test fixtures if provided
- Reports pass/fail for each tool

---

### 4. **build-server**

Builds an MCP server with esbuild and MCP-specific sensible defaults.

**Usage:**
```json
{
  "build-server": {
    "executor": "@portfolio/nx-mcp-executors:build-server",
    "outputs": ["{options.outputPath}"],
    "options": {
      "outputPath": "dist",
      "main": "src/main.ts",
      "tsConfig": "tsconfig.json",
      "sourcemap": true,
      "assets": ["src/assets"]
    }
  }
}
```

**Options:**
- `outputPath` (string): Output directory - required
- `main` (string): Entry point - required
- `tsConfig` (string): TypeScript config - required
- `sourcemap` (boolean): Generate source maps - default: `true`
- `assets` (string[]): Assets to copy - default: `[]`

**Output:**
- Compiles TypeScript to JavaScript (CommonJS)
- Targets Node.js 18+
- Generates sourcemaps for debugging
- Copies specified assets
- Exits with code 1 on compilation errors

---

### 5. **dev-server**

Runs MCP server in development mode with optional hot-reload.

**Usage:**
```json
{
  "dev-server": {
    "executor": "@portfolio/nx-mcp-executors:dev-server",
    "options": {
      "main": "src/main.ts",
      "watch": true,
      "port": 3000,
      "envFile": ".env.local",
      "inspect": false
    }
  }
}
```

**Options:**
- `main` (string): Entry point file - required
- `watch` (boolean): Enable file watching and auto-restart - default: `true`
- `port` (number): Port (informational) - default: `3000`
- `envFile` (string): Environment file to load - default: `.env.local`
- `inspect` (boolean): Enable Node debugger - default: `false`

**Output:**
- Starts Node.js process running the server
- Watches src/ directory for changes and restarts
- Loads environment from .env.local
- Supports Node debugging via --inspect=9229
- Gracefully handles SIGINT for clean shutdown

---

## Integration with tunes-mcp

The `tunes-mcp` project includes these executors in its `project.json`:

```bash
# Validate tool definitions
nx validate-tools tunes-mcp

# Validate schemas
nx validate-schema tunes-mcp

# Test all tools
nx test-tools tunes-mcp

# Build for production
nx build-server tunes-mcp

# Run in dev mode
nx dev-server tunes-mcp
```

---

## Architecture

```
tools/nx/mcp-executors/
├── src/
│   ├── executors/
│   │   ├── validate-tools/
│   │   │   ├── executor.ts
│   │   │   ├── schema.json
│   │   │   └── executor.json
│   │   ├── validate-schema/
│   │   ├── test-tools/
│   │   ├── build-server/
│   │   └── dev-server/
│   ├── utils.ts
│   └── index.ts
├── executors.json
├── project.json
├── package.json
└── tsconfig.json
```

### Key Files

- **executor.ts** - Main executor implementation with full logic
- **schema.json** - JSON Schema defining executor options and validation
- **executor.json** - NX executor metadata (name, description, paths)
- **executors.json** - Root index registering all executors

---

## Extension Points

To add new executors:

1. Create new directory under `src/executors/my-executor/`
2. Implement `executor.ts` with default export function
3. Define `schema.json` for options validation
4. Add `executor.json` metadata
5. Register in `executors.json`
6. Import and export from `src/index.ts`

---

## Error Handling

All executors follow these patterns:

- **Validation Errors** - Exit code 1 with detailed error messages
- **File Not Found** - Exit code 1 with path and suggestion
- **Execution Errors** - Exit code 1 with error details
- **Success** - Exit code 0 with summary

Error output uses standard NX logger (console in non-NX environments).

---

## Future Enhancements

- [ ] Tool code generation from schema
- [ ] Performance profiling executor
- [ ] Documentation generation from tools
- [ ] Type-safe schema generation (Zod)
- [ ] Transport-specific executors (stdio, SSE, HTTP)
