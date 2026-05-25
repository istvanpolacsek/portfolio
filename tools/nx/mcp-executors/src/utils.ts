let logger: any;

try {
  // Try to import logger from @nx/devkit if available
  const devkit = require('@nx/devkit');
  logger = devkit.logger;
} catch {
  // Fallback to console if @nx/devkit is not available
  logger = {
    info: (msg: string) => console.log(`ℹ  ${msg}`),
    error: (msg: string) => console.error(`✖  ${msg}`),
    warn: (msg: string) => console.warn(`⚠  ${msg}`),
  };
}

export interface ExecutorResult {
  success: boolean;
}

export function logInfo(message: string): void {
  logger.info(message);
}

export function logError(message: string): void {
  logger.error(message);
}

export function logWarn(message: string): void {
  logger.warn(message);
}
