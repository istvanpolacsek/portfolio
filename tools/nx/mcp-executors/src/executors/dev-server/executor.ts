import { spawn } from 'child_process';
import { existsSync } from 'fs';
import { join, resolve } from 'path';
import { logInfo, logError, ExecutorResult } from '../../utils';

interface DevServerOptions {
  serverScript: string;
  envFile: string;
}

interface ExecutorContext {
  root: string;
  projectRoot?: string;
}

export default async function runExecutor(
  options: DevServerOptions,
  context: ExecutorContext,
): Promise<ExecutorResult> {
  const workspaceRoot = context.root;
  const serverScriptPath = resolve(workspaceRoot, options.serverScript);

  if (!existsSync(serverScriptPath)) {
    logError(`Server script not found: ${serverScriptPath}. Did you build the project first?`);
    return { success: false };
  }

  const env = { ...process.env };
  const envPath = join(workspaceRoot, options.envFile);
  if (existsSync(envPath)) {
    logInfo(`Loading environment from ${options.envFile}`);
  }

  const inspectorBin = join(workspaceRoot, 'node_modules', '.bin', 'mcp-inspector');
  const [cmd, args] = existsSync(inspectorBin)
    ? [inspectorBin, ['node', serverScriptPath]]
    : ['npx', ['@modelcontextprotocol/inspector', 'node', serverScriptPath]];

  logInfo(`Starting MCP Inspector for ${options.serverScript}...`);

  const inspectorProcess = spawn(cmd, args, {
    cwd: workspaceRoot,
    env,
    stdio: 'inherit',
  });

  process.on('SIGINT', () => {
    logInfo('Shutting down MCP Inspector...');
    inspectorProcess.kill('SIGTERM');
    process.exit(0);
  });

  return new Promise((resolve) => {
    inspectorProcess.on('exit', (code) => {
      if (code === 0 || code === null) {
        resolve({ success: true });
      } else {
        logError(`MCP Inspector exited with code ${code}`);
        resolve({ success: false });
      }
    });

    inspectorProcess.on('error', (error) => {
      logError(`Failed to start MCP Inspector: ${error.message}`);
      resolve({ success: false });
    });
  });
}
