import { MCPClient } from '@mastra/mcp';

type StdioServer = {
  command: string;
  args: string[];
  env?: Record<string, string>;
};

/**
 * MCP integrations for the assignment.
 * Servers are only registered when their tokens are present so dry-run still boots.
 */
export function createPipelineMcpClient(): MCPClient | null {
  const servers: Record<string, StdioServer> = {};

  // The figma-developer-mcp server does its own API handshake on every process
  // start, which competes for the same account-level Figma rate limit as the
  // REST tool. Allow disabling it independently (e.g. while a rate-limit
  // cooldown is in effect) without losing FIGMA_ACCESS_TOKEN for REST calls.
  if (process.env.FIGMA_ACCESS_TOKEN && process.env.DISABLE_FIGMA_MCP !== 'true') {
    servers.figma = {
      command: 'npx',
      args: ['-y', 'figma-developer-mcp', `--figma-api-key=${process.env.FIGMA_ACCESS_TOKEN}`],
    };
  }

  if (process.env.GITHUB_TOKEN) {
    servers.github = {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-github'],
      env: {
        GITHUB_PERSONAL_ACCESS_TOKEN: process.env.GITHUB_TOKEN,
      },
    };
  }

  // Linear community MCP (optional)
  if (process.env.LINEAR_API_KEY) {
    servers.linear = {
      command: 'npx',
      args: ['-y', 'mcp-linear'],
      env: {
        LINEAR_API_KEY: process.env.LINEAR_API_KEY,
      },
    };
  }

  if (Object.keys(servers).length === 0) {
    return null;
  }

  return new MCPClient({
    id: 'pipeline-mcp',
    servers,
    timeout: 60_000,
  });
}

export async function loadMcpResources(): Promise<{
  mcpClient: MCPClient | null;
  mcpTools: Record<string, unknown>;
  mcpServers: Record<string, unknown>;
  serverNames: string[];
}> {
  const mcpClient = createPipelineMcpClient();
  if (!mcpClient) {
    return { mcpClient: null, mcpTools: {}, mcpServers: {}, serverNames: [] };
  }

  try {
    const { tools, errors } = await mcpClient.listToolsWithErrors();
    if (Object.keys(errors).length > 0) {
      console.warn('[mcp] Some MCP servers failed to load tools:', errors);
    }
    const mcpServers = await mcpClient.toMCPServerProxies();
    return {
      mcpClient,
      mcpTools: tools as Record<string, unknown>,
      mcpServers: mcpServers as Record<string, unknown>,
      serverNames: Object.keys(mcpServers),
    };
  } catch (error) {
    console.warn('[mcp] Failed to initialize MCP client:', error);
    return { mcpClient: null, mcpTools: {}, mcpServers: {}, serverNames: [] };
  }
}
