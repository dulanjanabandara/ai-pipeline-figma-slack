import { Agent } from '@mastra/core/agent';
import { createGithubPrTool } from '../tools/github-tool.js';
import { createLinearIssueTool } from '../tools/linear-tool.js';
import { deployRailwayTool } from '../tools/railway-tool.js';
import { notifySlackTool } from '../tools/slack-tool.js';
import { fetchFigmaDesignTool } from '../tools/figma-tool.js';

/**
 * Orchestrator-facing agent for Studio chat and Slack conversations.
 * Prefer designToDeployWorkflow for the durable end-to-end pipeline.
 */
export const pipelineControlAgent = new Agent({
  id: 'pipeline-control-agent',
  name: 'Pipeline Control Agent',
  instructions: `You help operators run the design-to-deploy pipeline.

When asked to ship a Figma design:
1. Confirm figma URL and GitHub repo (owner/repo).
2. Explain that the durable path is the designToDeployWorkflow (Figma → codegen → GitHub → Linear → approve → Railway → Slack).
3. You may use tools for individual steps when debugging.
4. Always summarize PR URL, Linear issue, Railway URL, and Slack notification status.
5. Prefer dry-run mode unless the user explicitly asks for live integrations.
6. When MCP tools are available (figma_*, github_*), prefer them for richer integrations.`,
  model: 'google/gemini-2.5-flash',
  tools: {
    fetchFigmaDesignTool,
    createGithubPrTool,
    createLinearIssueTool,
    deployRailwayTool,
    notifySlackTool,
  },
});
