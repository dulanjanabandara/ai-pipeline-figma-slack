import { Agent } from '@mastra/core/agent';
import { Mastra } from '@mastra/core/mastra';
import { LibSQLStore } from '@mastra/libsql';
import { createSlackAdapter } from '@chat-adapter/slack';
import { githubAgent } from './agents/github-agent.js';
import { linearAgent } from './agents/linear-agent.js';
import { railwayAgent } from './agents/railway-agent.js';
import { designToDeployWorkflow } from './workflows/design-to-deploy.js';
import { fetchFigmaDesignTool } from './tools/figma-tool.js';
import { createGithubPrTool } from './tools/github-tool.js';
import { createLinearIssueTool } from './tools/linear-tool.js';
import { deployRailwayTool } from './tools/railway-tool.js';
import { notifySlackTool } from './tools/slack-tool.js';
import { loadMcpResources } from './mcp/client.js';

const { mcpTools, mcpServers, serverNames } = await loadMcpResources();

if (serverNames.length > 0) {
  console.log(`[mcp] Connected MCP servers: ${serverNames.join(', ')}`);
} else {
  console.log(
    '[mcp] No MCP servers connected (set FIGMA_ACCESS_TOKEN / GITHUB_TOKEN / LINEAR_API_KEY to enable)',
  );
}

const restTools = {
  fetchFigmaDesignTool,
  createGithubPrTool,
  createLinearIssueTool,
  deployRailwayTool,
  notifySlackTool,
};

const controlTools = {
  ...restTools,
  ...mcpTools,
};

const figmaCodegenAgent = new Agent({
  id: 'figma-codegen-agent',
  name: 'Figma → React Code Generator',
  instructions: `You convert Figma design context into clean React + TypeScript + Tailwind UI code.

Rules:
- Prefer a single composition for the first viewport (not a dashboard).
- Brand/product name must be hero-level, not only nav text.
- No cards in the hero. Keep one headline, one supporting sentence, one CTA group.
- This is a monorepo; ALWAYS prefix file paths with "apps/demo-app/"
  (e.g. apps/demo-app/src/App.tsx, apps/demo-app/src/index.css). Never use bare "src/...".
- When MCP Figma tools are available, use them for richer design context.`,
  model: 'google/gemini-flash-latest',
  tools: {
    fetchFigmaDesignTool,
    ...mcpTools,
  } as never,
});

const slackChannels = process.env.SLACK_SIGNING_SECRET
  ? {
      adapters: {
        slack: createSlackAdapter({
          signingSecret: process.env.SLACK_SIGNING_SECRET,
          botToken: process.env.SLACK_BOT_TOKEN,
        }),
      },
    }
  : undefined;

const slackBotAgent = new Agent({
  id: 'slack-bot-agent',
  name: 'Slack Bot Agent',
  instructions: `You are the Slack control plane for the design-to-deploy pipeline.

When a user asks to ship a design (or uses /ship-design):
1. Extract Figma URL and GitHub repo (owner/repo). Default repo from env DEFAULT_GITHUB_REPO if missing.
2. Prefer running / explaining the designToDeployWorkflow.
3. Prefer dry-run unless they say "live".
4. Summarize PR, Linear, Railway, and Slack status.
5. When MCP tools are present (figma_*, github_*, linear_*), prefer them for richer context.

Command: /ship-design <figma-url> [owner/repo] [--live]`,
  model: 'google/gemini-flash-latest',
  tools: controlTools as never,
  ...(slackChannels ? { channels: slackChannels } : {}),
});

const pipelineControlAgent = new Agent({
  id: 'pipeline-control-agent',
  name: 'Pipeline Control Agent',
  instructions: `You help operators run the design-to-deploy pipeline.

Prefer designToDeployWorkflow for the full path.
Use MCP tools when available; otherwise use the REST tools.
Prefer dry-run unless the user asks for live.`,
  model: 'google/gemini-flash-latest',
  tools: controlTools as never,
});

export const mastra = new Mastra({
  agents: {
    figmaCodegenAgent,
    githubAgent,
    linearAgent,
    railwayAgent,
    slackBotAgent,
    pipelineControlAgent,
  },
  workflows: {
    designToDeployWorkflow,
  },
  tools: restTools,
  mcpServers: mcpServers as never,
  storage: new LibSQLStore({
    id: 'pipeline-storage',
    url: 'file:./mastra.db',
  }),
  bundler: {
    transpilePackages: ['@ai-pipeline/shared'],
  },
});
