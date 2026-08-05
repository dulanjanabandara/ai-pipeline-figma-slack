import { createTool } from '@mastra/core/tools';
import type { SlackNotifyResult } from '@ai-pipeline/shared';
import { z } from 'zod';
import { isDryRun, optionalEnv } from '../lib/env.js';

export const notifySlackTool = createTool({
  id: 'notify-slack',
  description: 'Post a pipeline status update to Slack (bot token or incoming webhook).',
  inputSchema: z.object({
    channel: z.string().optional(),
    text: z.string(),
    dryRun: z.boolean().optional(),
  }),
  outputSchema: z.object({
    channel: z.string(),
    messageTs: z.string(),
    dryRun: z.boolean(),
  }),
  execute: async (input): Promise<SlackNotifyResult> => {
    const dryRun = isDryRun(input.dryRun);
    const channel = input.channel || optionalEnv('SLACK_CHANNEL', '#ai-pipeline');

    if (dryRun) {
      return {
        channel,
        messageTs: `${Date.now()}.000001`,
        dryRun: true,
      };
    }

    const webhook = optionalEnv('SLACK_WEBHOOK_URL');
    const botToken = optionalEnv('SLACK_BOT_TOKEN');

    if (webhook) {
      const res = await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input.text }),
      });
      if (!res.ok) {
        throw new Error(`Slack webhook error: ${await res.text()}`);
      }
      return { channel, messageTs: `${Date.now()}.webhook`, dryRun: false };
    }

    if (!botToken) {
      throw new Error('SLACK_WEBHOOK_URL or SLACK_BOT_TOKEN required when dryRun is false');
    }

    const res = await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${botToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ channel, text: input.text }),
    });

    const json = (await res.json()) as { ok: boolean; ts?: string; error?: string };
    if (!json.ok) {
      throw new Error(`Slack API error: ${json.error}`);
    }

    return {
      channel,
      messageTs: json.ts ?? `${Date.now()}`,
      dryRun: false,
    };
  },
});
