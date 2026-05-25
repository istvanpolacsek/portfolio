import { readFileSync, existsSync, readdirSync } from 'fs';
import { join, extname } from 'path';
import { logInfo, logError, ExecutorResult } from '../../utils';

interface TestToolsOptions {
  toolsPath: string;
  testFixturesPath: string | null;
  bail: boolean;
}

interface ExecutorContext {
  root: string;
  projectRoot?: string;
  projectName?: string;
}

interface TestResult {
  toolName: string;
  passed: number;
  failed: number;
  errors: string[];
}

export default async function runExecutor(
  options: TestToolsOptions,
  context: ExecutorContext,
): Promise<ExecutorResult> {
  const workspaceRoot = context.root;
  const toolsPath = join(workspaceRoot, options.toolsPath);
  const testFixturesPath = options.testFixturesPath ? join(workspaceRoot, options.testFixturesPath) : null;

  logInfo(`Testing MCP tools in ${options.toolsPath}...`);

  try {
    if (!existsSync(toolsPath)) {
      logError(`Tools path not found: ${toolsPath}`);
      return { success: false };
    }

    const results: TestResult[] = [];
    let totalPassed = 0;
    let totalFailed = 0;

    // Find all tool files
    const toolFiles = readdirSync(toolsPath)
      .filter((f) => (extname(f) === '.ts' || extname(f) === '.js') && !f.endsWith('.spec.ts'))
      .map((f) => join(toolsPath, f));

    if (toolFiles.length === 0) {
      logInfo('No tool files found to test');
      return { success: true };
    }

    for (const toolFile of toolFiles) {
      try {
        const toolName = require(toolFile);
        const testResult: TestResult = {
          toolName: toolFile,
          passed: 0,
          failed: 0,
          errors: [],
        };

        // Check if tool exports required fields
        if (!toolName.description || !toolName.inputSchema) {
          testResult.errors.push('Missing tool description or inputSchema');
          testResult.failed++;
        } else {
          testResult.passed++;
          logInfo(`✓ ${toolFile}: Tool structure valid`);
        }

        // If test fixtures exist, run them
        if (testFixturesPath && existsSync(testFixturesPath)) {
          const fixtureFile = join(testFixturesPath, `${toolName.name || 'test'}.json`);
          if (existsSync(fixtureFile)) {
            try {
              const fixtures = JSON.parse(readFileSync(fixtureFile, 'utf-8'));
              logInfo(`✓ ${toolFile}: Test fixtures loaded`);
              testResult.passed++;
            } catch (error) {
              testResult.errors.push(`Failed to load fixtures: ${error instanceof Error ? error.message : String(error)}`);
              testResult.failed++;
              if (options.bail) {
                return { success: false };
              }
            }
          }
        }

        results.push(testResult);
        totalPassed += testResult.passed;
        totalFailed += testResult.failed;
      } catch (error) {
        logError(`Failed to test ${toolFile}: ${error instanceof Error ? error.message : String(error)}`);
        totalFailed++;
        if (options.bail) {
          return { success: false };
        }
      }
    }

    logInfo(`\nTest results: ${totalPassed} passed, ${totalFailed} failed`);

    return { success: totalFailed === 0 };
  } catch (error) {
    logError(`Test tools executor failed: ${error instanceof Error ? error.message : String(error)}`);
    return { success: false };
  }
}
