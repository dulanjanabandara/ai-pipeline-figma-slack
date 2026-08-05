/**
 * Slack Bot control plane (assignment: Slack Bot Agent — Notifications + Control).
 *
 * Starts with Socket Mode (no public URL required for local demos):
 *   npm run slack:bot -w orchestrator
 *
 * Slash command:
 *   /ship-design <figma-url> [owner/repo] [--live] [--approve]
 *
 * Required env:
 *   SLACK_BOT_TOKEN, SLACK_SIGNING_SECRET, SLACK_APP_TOKEN (xapp-… for Socket Mode)
 * Optional:
 *   DEFAULT_GITHUB_REPO, SLACK_CHANNEL, DRY_RUN
 */
import 'dotenv/config';
import { App, LogLevel } from '@slack/bolt';
import { mastra } from '../mastra/index.js';
import { parseShipDesignText } from './parse-command.js';
import { optionalEnv } from '../mastra/lib/env.js';

const botToken = process.env.SLACK_BOT_TOKEN;
const signingSecret = process.env.SLACK_SIGNING_SECRET;
const appToken = process.env.SLACK_APP_TOKEN;

if (!botToken || !signingSecret) {
  console.error(
    'Missing SLACK_BOT_TOKEN and/or SLACK_SIGNING_SECRET. See apps/orchestrator/.env.example',
  );
  process.exit(1);
}

const useSocketMode = Boolean(appToken);

const app = new App({
  token: botToken,
  signingSecret,
  ...(useSocketMode
    ? { socketMode: true, appToken }
    : { port: Number(process.env.SLACK_BOLT_PORT ?? 3001) }),
  logLevel: LogLevel.INFO,
});

/** In-memory helper for debugging approval message threads (runId is on the button value). */
const pendingApprovals = new Map<string, { runId: string; channel: string }>();

app.command('/ship-design', async ({ command, ack, respond, client }) => {
  await ack();

  let parsed;
  try {
    parsed = parseShipDesignText(command.text ?? '', {
      repo: optionalEnv('DEFAULT_GITHUB_REPO', 'acme/demo-app'),
    });
  } catch (error) {
    await respond({
      response_type: 'ephemeral',
      text: error instanceof Error ? error.message : String(error),
    });
    return;
  }

  const channel = command.channel_id;
  await respond({
    response_type: 'in_channel',
    text: [
      `:rocket: *Starting design → deploy pipeline*`,
      `• Figma: ${parsed.figmaUrl}`,
      `• Repo: \`${parsed.repo}\``,
      `• Mode: ${parsed.dryRun ? 'dry-run' : 'LIVE'}`,
      `• Deploy approval: ${parsed.requireDeployApproval ? 'required' : 'auto'}`,
    ].join('\n'),
  });

  const workflow = mastra.getWorkflow('designToDeployWorkflow');
  const run = await workflow.createRun();

  const result = await run.start({
    inputData: {
      figmaUrl: parsed.figmaUrl,
      repo: parsed.repo,
      slackChannel: channel,
      dryRun: parsed.dryRun,
      baseBranch: 'main',
      requireDeployApproval: parsed.requireDeployApproval,
    },
  });

  if (result.status === 'suspended') {
    const runId = run.runId;
    const blocks = [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: [
            ':hand: *Deploy approval required*',
            `Run: \`${runId}\``,
            result.suspended
              ? `_Paused at: ${JSON.stringify(result.suspended)}_`
              : '',
          ]
            .filter(Boolean)
            .join('\n'),
        },
      },
      {
        type: 'actions',
        block_id: 'deploy_approval',
        elements: [
          {
            type: 'button',
            text: { type: 'plain_text', text: 'Approve deploy' },
            style: 'primary',
            action_id: 'approve_deploy',
            value: runId,
          },
          {
            type: 'button',
            text: { type: 'plain_text', text: 'Reject' },
            style: 'danger',
            action_id: 'reject_deploy',
            value: runId,
          },
        ],
      },
    ];

    const posted = await client.chat.postMessage({
      channel,
      text: 'Deploy approval required',
      blocks,
    });

    if (posted.ts) {
      pendingApprovals.set(posted.ts, { runId, channel });
    }
    return;
  }

  if (result.status === 'success') {
    await client.chat.postMessage({
      channel,
      text: `:white_check_mark: Pipeline finished.\n\`\`\`${JSON.stringify(result.result, null, 2).slice(0, 2800)}\`\`\``,
    });
    return;
  }

  await client.chat.postMessage({
    channel,
    text: `:x: Pipeline ended with status \`${result.status}\`.\n\`\`\`${JSON.stringify(result, null, 2).slice(0, 2800)}\`\`\``,
  });
});

async function resumeDeploy(runId: string, approved: boolean, channel: string, client: typeof app.client) {
  const workflow = mastra.getWorkflow('designToDeployWorkflow');
  const run = await workflow.createRun({ runId });
  const result = await run.resume({
    step: 'approve-deploy',
    resumeData: { approved },
  });

  if (result.status === 'success') {
    await client.chat.postMessage({
      channel,
      text: `:white_check_mark: Pipeline finished after ${approved ? 'approval' : 'rejection path'}.`,
    });
  } else {
    await client.chat.postMessage({
      channel,
      text: `Resume status: \`${result.status}\`\n\`\`\`${JSON.stringify(result, null, 2).slice(0, 2000)}\`\`\``,
    });
  }
}

app.action('approve_deploy', async ({ ack, body, client }) => {
  await ack();
  const runId =
    body.type === 'block_actions' ? (body.actions[0] as { value?: string }).value : undefined;
  const channel = body.channel?.id;
  if (!runId || !channel) return;
  await client.chat.postMessage({ channel, text: `:white_check_mark: Deploy approved for run \`${runId}\`` });
  await resumeDeploy(runId, true, channel, client);
});

app.action('reject_deploy', async ({ ack, body, client }) => {
  await ack();
  const runId =
    body.type === 'block_actions' ? (body.actions[0] as { value?: string }).value : undefined;
  const channel = body.channel?.id;
  if (!runId || !channel) return;
  await client.chat.postMessage({ channel, text: `:no_entry: Deploy rejected for run \`${runId}\`` });
  await resumeDeploy(runId, false, channel, client);
});

/** Mentions / DMs → Slack Bot Agent conversational control */
app.event('app_mention', async ({ event, client, say }) => {
  const text = event.text.replace(/<@[^>]+>/g, '').trim();
  if (!text) {
    await say('Use `/ship-design <figma-url> [owner/repo] [--live]` to start the pipeline.');
    return;
  }

  try {
    const agent = mastra.getAgent('slackBotAgent');
    const result = await agent.generate(
      `User in Slack channel ${event.channel} said: ${text}\n\nHelp them run or understand the design-to-deploy pipeline. If they provided a Figma URL, explain how to use /ship-design.`,
    );
    await say(result.text ?? 'Done.');
  } catch (error) {
    await client.chat.postMessage({
      channel: event.channel,
      text: `Agent error: ${error instanceof Error ? error.message : String(error)}`,
    });
  }
});

const port = Number(process.env.SLACK_BOLT_PORT ?? 3001);

await app.start(useSocketMode ? undefined : port);
console.log(
  useSocketMode
    ? '⚡️ Slack bot running (Socket Mode) — /ship-design ready'
    : `⚡️ Slack bot listening on :${port} — set Event Request URL to this host`,
);
