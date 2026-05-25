import { spawn } from 'child_process';
import { existsSync, watchFile } from 'fs';
import { join } from 'path';
import { logInfo, logError, ExecutorResult } from '../../utils';

interface DevServerOptions {
  main: string;
  watch: boolean;
  port: number;
  envFile: string;
  inspect: boolean;
}

interface ExecutorContext {
  root: string;
  projectRoot?: string;
  projectName?: string;
}

export default async function runExecutor(
  options: DevServerOptions,
  context: ExecutorContext,
): Promise<ExecutorResult> {
  const workspaceRoot = context.root;
  const projectRoot = context.projectName ? join(workspaceRoot, context.projectRoot || '') : workspaceRoot;

  logInfo(`Starting MCP dev server from ${options.main}...`);

  try {
    // Validate entry point
    const mainPath = join(projectRoot, options.main);
    if (!existsSync(mainPath)) {
      logError(`Entry point not found: ${mainPath}`);
      return { success: false };
    }

    // Build command - use tsx to run TypeScript directly with proper module resolution
    const nodeArgs: string[] = [];

    if (options.inspect) {
      nodeArgs.push('--inspect=9229');
    }

    nodeArgs.push(options.main);

    // Load env file if it exists
    const envPath = join(projectRoot, options.envFile);
    const env = { ...process.env };

    if (existsSync(envPath)) {
      logInfo(`Loading environment from ${options.envFile}`);
      // Note: In a real implementation, you'd parse the .env file
      // For now, just note that it exists
    }

    logInfo(`Starting server with: ts-node ${nodeArgs.join(' ')}`);

    // Spawn the server process - use ts-node for direct TypeScript execution
    const serverProcess = spawn('ts-node', nodeArgs, {
      cwd: projectRoot,
      env,
      stdio: 'inherit',
    });

    // Handle termination
    process.on('SIGINT', () => {
      logInfo('Shutting down server...');
      serverProcess.kill('SIGTERM');
      process.exit(0);
    });

    // Watch for file changes if enabled
    if (options.watch) {
      logInfo(`Watching for file changes...`);
      
      const watchPath = join(projectRoot, 'src');
      watchFile(watchPath, () => {
        logInfo(`Files changed, restarting...`);
        serverProcess.kill('SIGTERM');
        
        // Restart the server using ts-node
        setTimeout(() => {
          const newProcess = spawn('ts-node', nodeArgs, {
            cwd: projectRoot,
            env,
            stdio: 'inherit',
          });
          
          process.on('SIGINT', () => {
            newProcess.kill('SIGTERM');
            process.exit(0);
          });
        }, 1000);
      });
    }

    return new Promise((resolve) => {
      serverProcess.on('exit', (code) => {
        if (code === 0) {
          logInfo('Server exited cleanly');
          resolve({ success: true });
        } else {
          logError(`Server exited with code ${code}`);
          resolve({ success: false });
        }
      });

      serverProcess.on('error', (error) => {
        logError(`Server error: ${error.message}`);
        resolve({ success: false });
      });
    });
  } catch (error) {
    logError(`Failed to start dev server: ${error instanceof Error ? error.message : String(error)}`);
    return { success: false };
  }
}
