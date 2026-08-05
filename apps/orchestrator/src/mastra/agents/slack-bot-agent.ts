import { Agent } from '@mastra/core/agent';
import { notifySlackTool } from '../tools/slack-tool.js';
import { fetchFigmaDesignTool } from '../tools/figma-tool.js';
import { createGithubPrTool } from '../tools/github-tool.js';
import { createLinearIssueTool } from '../tools/linear-tool.js';
import { deployRailwayTool } from '../tools/railway-tool.js';

/**
 * Slack Bot Agent — control plane + notifications.
 * Registered with optional Slack channel adapter in `src/mastra/index.ts` when
 * SLACK_SIGNING_SECRET is set. Slash command `/ship-design` is handled by `src/slack/bot.ts`.
 */
export const slackBotAgent = new Agent({
  id: 'slack-bot-agent',
  name: 'Slack Bot Agent',
  instructions: `You are the Slack control plane for the design-to-deploy pipeline.

When a user asks to ship a design (or uses /ship-design):
1. Extract Figma URL and GitHub repo (owner/repo). Default repo from env DEFAULT_GITHUB_REPO if missing.
2. Tell them you will run the designToDeployWorkflow.
3. Prefer dry-run unless they say "live" or "production".
4. After the run, summarize PR, Linear issue, Railway URL, and notification status.
5. You can also post status updates with notify-slack.

Command format users should use:
/ship-design <figma-url> [owner/repo] [--live]

You are notifications + control — keep replies short and actionable.`,
  model: 'google/gemini-flash-latest',
  tools: {
    notifySlackTool,
    fetchFigmaDesignTool,
    createGithubPrTool,
    createLinearIssueTool,
    deployRailwayTool,
  },
});
