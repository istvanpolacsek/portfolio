import 'dotenv/config';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { generateTune, generateTuneSchema } from './tools';

const server = new McpServer({
  name: 'forza-tune-server',
  version: '1.0.0',
});

server.registerTool(
  'generate_tune',
  {
    description:
      'Generate a structured Forza tuning sheet for a given vehicle, class, and tuning type',
    inputSchema: generateTuneSchema.shape,
  },
  async (params) => {
    const result = await generateTune(params);
    return {
      content: [{ type: 'text', text: result }],
    };
  },
);

const transport = new StdioServerTransport();

async function main() {
  await server.connect(transport);
}

main().catch((err) => {
  console.error('Server failed to start:', err);
  process.exit(1);
});
