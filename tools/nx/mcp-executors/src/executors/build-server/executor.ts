import { execSync } from 'child_process';
import { existsSync, copyFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import { logInfo, logError, ExecutorResult } from '../../utils';

interface BuildServerOptions {
  outputPath: string;
  main: string;
  tsConfig: string;
  sourcemap: boolean;
  bundle?: boolean;
  assets?: string[];
}

interface ExecutorContext {
  root: string;
  projectRoot?: string;
  projectName?: string;
}

function copyAssets(assetsPatterns: string[] | undefined, from: string, to: string): void {
  if (!assetsPatterns || assetsPatterns.length === 0) {
    return;
  }

  for (const pattern of assetsPatterns) {
    const assetPath = join(from, pattern);
    if (existsSync(assetPath)) {
      const stat = statSync(assetPath);
      if (stat.isFile()) {
        const fileName = pattern.split('/').pop();
        if (fileName) {
          copyFileSync(assetPath, join(to, fileName));
        }
      }
    }
  }
}

export default async function runExecutor(
  options: BuildServerOptions,
  context: ExecutorContext,
): Promise<ExecutorResult> {
  const workspaceRoot = context.root;
  const projectRoot = context.projectName ? join(workspaceRoot, context.projectRoot || '') : workspaceRoot;

  logInfo(`Building MCP server from ${options.main}...`);

  try {
    // Validate entry point
    const mainPath = join(projectRoot, options.main);
    if (!existsSync(mainPath)) {
      logError(`Entry point not found: ${mainPath}`);
      return { success: false };
    }

    // Build using esbuild
    const outputPath = join(projectRoot, options.outputPath);
    const esbuildCmd = [
      'esbuild',
      options.main,
      `--outdir=${options.outputPath}`,
      '--platform=node',
      '--format=cjs',
      `--bundle=${options.bundle ?? true}`,
      '--target=node18',
    ];

    if (options.sourcemap) {
      esbuildCmd.push('--sourcemap');
    }

    logInfo(`Running: ${esbuildCmd.join(' ')}`);

    execSync(esbuildCmd.join(' '), {
      cwd: projectRoot,
      stdio: 'inherit',
    });

    logInfo(`✓ Build completed to ${options.outputPath}`);

    // Copy assets
    if (options.assets && options.assets.length > 0) {
      logInfo(`Copying assets...`);
      copyAssets(options.assets, projectRoot, outputPath);
      logInfo(`✓ Assets copied`);
    }

    return { success: true };
  } catch (error) {
    logError(`Build failed: ${error instanceof Error ? error.message : String(error)}`);
    return { success: false };
  }
}
