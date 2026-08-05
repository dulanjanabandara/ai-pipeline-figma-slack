import { createTool } from '@mastra/core/tools';
import type { LinearIssueResult } from '@ai-pipeline/shared';
import { z } from 'zod';
import { isDryRun, optionalEnv } from '../lib/env.js';

export const createLinearIssueTool = createTool({
  id: 'create-linear-issue',
  description: 'Create a Linear issue for the generated UI work and link the GitHub PR.',
  inputSchema: z.object({
    title: z.string(),
    description: z.string(),
    prUrl: z.string().url(),
    dryRun: z.boolean().optional(),
  }),
  outputSchema: z.object({
    issueId: z.string(),
    identifier: z.string(),
    url: z.string(),
    dryRun: z.boolean(),
  }),
  execute: async (input): Promise<LinearIssueResult> => {
    const dryRun = isDryRun(input.dryRun);

    if (dryRun) {
      const n = Math.floor(Math.random() * 900) + 100;
      return {
        issueId: `dryrun-issue-${n}`,
        identifier: `AI-${n}`,
        url: `https://linear.app/team/issue/AI-${n}`,
        dryRun: true,
      };
    }

    const apiKey = optionalEnv('LINEAR_API_KEY');
    const teamId = optionalEnv('LINEAR_TEAM_ID');
    if (!apiKey || !teamId) {
      throw new Error('LINEAR_API_KEY and LINEAR_TEAM_ID are required when dryRun is false');
    }

    const mutation = `
      mutation IssueCreate($input: IssueCreateInput!) {
        issueCreate(input: $input) {
          success
          issue {
            id
            identifier
            url
          }
        }
      }
    `;

    const res = await fetch('https://api.linear.app/graphql', {
      method: 'POST',
      headers: {
        Authorization: apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: mutation,
        variables: {
          input: {
            teamId,
            title: input.title,
            description: `${input.description}\n\nPR: ${input.prUrl}`,
          },
        },
      }),
    });

    if (!res.ok) {
      throw new Error(`Linear API error: ${await res.text()}`);
    }

    const json = (await res.json()) as {
      data?: {
        issueCreate?: {
          success: boolean;
          issue?: { id: string; identifier: string; url: string };
        };
      };
      errors?: unknown;
    };

    const issue = json.data?.issueCreate?.issue;
    if (!issue) {
      throw new Error(`Linear issue create failed: ${JSON.stringify(json.errors ?? json)}`);
    }

    return {
      issueId: issue.id,
      identifier: issue.identifier,
      url: issue.url,
      dryRun: false,
    };
  },
});
