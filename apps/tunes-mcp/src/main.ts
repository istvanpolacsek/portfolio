import 'dotenv/config';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { registerGenerateTuneTool } from './tools';
import { registerGenerateTunePrompt } from './prompts';

const server = new McpServer({
  name: 'forza-tune-server',
  version: '1.0.0',
});

registerGenerateTuneTool(server);
registerGenerateTunePrompt(server);

const transport = new StdioServerTransport();

async function main() {
  await server.connect(transport);
}

main().catch((err) => {
  console.error('Server failed to start:', err);
  process.exit(1);
});
