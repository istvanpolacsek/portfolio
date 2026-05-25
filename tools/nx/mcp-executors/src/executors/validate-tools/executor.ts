import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';
import { logInfo, logError, ExecutorResult } from '../../utils';

interface ValidateToolsOptions {
  toolsPath: string;
  strict: boolean;
}

interface ExecutorContext {
  root: string;
  projectRoot?: string;
  projectName?: string;
}

interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: object;
}

function validateToolSchema(tool: ToolDefinition, filePath: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!tool.name || typeof tool.name !== 'string') {
    errors.push(`Tool name is missing or not a string in ${filePath}`);
  }

  if (!tool.description || typeof tool.description !== 'string') {
    errors.push(`Tool description is missing or not a string in ${filePath}`);
  }

  if (!tool.inputSchema || typeof tool.inputSchema !== 'object') {
    errors.push(`Tool inputSchema is missing or not an object in ${filePath}`);
  } else {
    // Validate it's a valid JSON schema
    if (!('type' in tool.inputSchema) && !('$ref' in tool.inputSchema)) {
      errors.push(`Tool inputSchema should have 'type' or '$ref' field in ${filePath}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

function findToolDefinitions(dir: string): Map<string, ToolDefinition> {
  const tools = new Map<string, ToolDefinition>();
  
  function traverse(currentPath: string) {
    try {
      const entries = readdirSync(currentPath);
      
      for (const entry of entries) {
        const fullPath = join(currentPath, entry);
        const stat = statSync(fullPath);
        
        if (stat.isDirectory() && !entry.startsWith('.')) {
          traverse(fullPath);
        } else if (stat.isFile() && (extname(entry) === '.ts' || extname(entry) === '.js')) {
          try {
            const content = readFileSync(fullPath, 'utf-8');
            // Simple heuristic: look for tool exports
            if (content.includes('export') && (content.includes('Schema') || content.includes('description'))) {
              tools.set(fullPath, { name: entry, description: '', inputSchema: {} });
            }
          } catch {
            // Skip files that can't be read
          }
        }
      }
    } catch (error) {
      // Skip directories that can't be read
    }
  }
  
  traverse(dir);
  return tools;
}

export default async function runExecutor(
  options: ValidateToolsOptions,
  context: ExecutorContext,
): Promise<ExecutorResult> {
  const workspaceRoot = context.root;
  const toolsPath = join(workspaceRoot, options.toolsPath);

  logInfo(`Validating MCP tools in ${options.toolsPath}...`);

  try {
    const tools = findToolDefinitions(toolsPath);
    let hasErrors = false;
    let validCount = 0;

    for (const [filePath, tool] of tools) {
      const validation = validateToolSchema(tool, filePath);
      
      if (validation.valid) {
        logInfo(`✓ ${filePath}`);
        validCount++;
      } else {
        logError(`✗ ${filePath}`);
        validation.errors.forEach((err) => logError(`  - ${err}`));
        hasErrors = true;
      }
    }

    logInfo(`\nValidation complete: ${validCount}/${tools.size} tools passed`);

    if (hasErrors && options.strict) {
      return { success: false };
    }

    return { success: true };
  } catch (error) {
    logError(`Failed to validate tools: ${error instanceof Error ? error.message : String(error)}`);
    return { success: false };
  }
}
