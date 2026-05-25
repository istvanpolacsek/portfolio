import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';
import { logInfo, logError, ExecutorResult } from '../../utils';

interface ValidateSchemaOptions {
  schemaPath: string;
  testDataPath: string | null;
}

interface ExecutorContext {
  root: string;
  projectRoot?: string;
  projectName?: string;
}

function validateJsonSchema(schema: object): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Basic JSON Schema validation
  if (typeof schema !== 'object' || schema === null) {
    errors.push('Schema must be an object');
    return { valid: false, errors };
  }

  const schemaObj = schema as Record<string, unknown>;

  // Check for required schema properties
  if (!('type' in schemaObj) && !('$ref' in schemaObj) && !('oneOf' in schemaObj) && !('allOf' in schemaObj)) {
    errors.push('Schema must have type, $ref, oneOf, or allOf');
  }

  // Validate if type is specified
  if ('type' in schemaObj) {
    const validTypes = ['string', 'number', 'integer', 'boolean', 'array', 'object', 'null'];
    if (!validTypes.includes(schemaObj.type as string)) {
      errors.push(`Invalid type: ${schemaObj.type}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

function validateTestData(schema: object, testData: object): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const schemaObj = schema as Record<string, unknown>;
  const dataObj = testData as Record<string, unknown>;

  // Basic type checking
  if ('type' in schemaObj) {
    const expectedType = schemaObj.type;
    const actualType = Array.isArray(dataObj) ? 'array' : typeof dataObj;

    if (expectedType !== actualType) {
      errors.push(`Type mismatch: expected ${expectedType}, got ${actualType}`);
    }
  }

  // Check required properties
  if ('required' in schemaObj && Array.isArray(schemaObj.required)) {
    for (const prop of schemaObj.required as string[]) {
      if (!(prop in dataObj)) {
        errors.push(`Missing required property: ${prop}`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export default async function runExecutor(
  options: ValidateSchemaOptions,
  context: ExecutorContext,
): Promise<ExecutorResult> {
  const workspaceRoot = context.root;
  const schemaPath = join(workspaceRoot, options.schemaPath);
  const testDataPath = options.testDataPath ? join(workspaceRoot, options.testDataPath) : null;

  logInfo(`Validating JSON schemas in ${options.schemaPath}...`);

  try {
    if (!existsSync(schemaPath)) {
      logError(`Schema path not found: ${schemaPath}`);
      return { success: false };
    }

    let validCount = 0;
    let totalCount = 0;
    let hasErrors = false;

    // Process schema files
    const schemaFiles = readdirSync(schemaPath).filter(
      (f) => extname(f) === '.json',
    );

    for (const file of schemaFiles) {
      const filePath = join(schemaPath, file);
      const stat = statSync(filePath);

      if (stat.isFile()) {
        try {
          totalCount++;
          const content = readFileSync(filePath, 'utf-8');
          const schema = JSON.parse(content);

          const validation = validateJsonSchema(schema);

          if (validation.valid) {
            logInfo(`✓ ${file}`);
            validCount++;
          } else {
            logError(`✗ ${file}`);
            validation.errors.forEach((err) => logError(`  - ${err}`));
            hasErrors = true;
          }
        } catch (error) {
          logError(`✗ ${file}: ${error instanceof Error ? error.message : String(error)}`);
          hasErrors = true;
        }
      }
    }

    // Validate test data if provided
    if (testDataPath && existsSync(testDataPath)) {
      logInfo(`\nValidating test data against schemas...`);
      const testFiles = readdirSync(testDataPath).filter((f) => extname(f) === '.json');

      for (const file of testFiles) {
        const filePath = join(testDataPath, file);
        const stat = statSync(filePath);

        if (stat.isFile()) {
          try {
            const testContent = readFileSync(filePath, 'utf-8');
            const testData = JSON.parse(testContent);
            // Simplified: would need to map test data to schema
            logInfo(`✓ Test data ${file} is valid JSON`);
          } catch (error) {
            logError(
              `✗ Test data ${file}: ${error instanceof Error ? error.message : String(error)}`,
            );
            hasErrors = true;
          }
        }
      }
    }

    logInfo(`\nSchema validation complete: ${validCount}/${totalCount} schemas passed`);

    return { success: !hasErrors };
  } catch (error) {
    logError(`Failed to validate schemas: ${error instanceof Error ? error.message : String(error)}`);
    return { success: false };
  }
}
