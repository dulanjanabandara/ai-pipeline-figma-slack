import { createTool } from '@mastra/core/tools';
import type { GithubPrResult } from '@ai-pipeline/shared';
import { z } from 'zod';
import { isDryRun, optionalEnv } from '../lib/env.js';

const generatedFileSchema = z.object({
  path: z.string(),
  content: z.string(),
  language: z.enum(['tsx', 'ts', 'css', 'json', 'html']).optional(),
});

export const createGithubPrTool = createTool({
  id: 'create-github-pr',
  description:
    'Create a branch, commit generated React files, and open a pull request on GitHub.',
  inputSchema: z.object({
    repo: z.string().describe('owner/repo'),
    baseBranch: z.string().default('main'),
    branch: z.string(),
    title: z.string(),
    body: z.string(),
    files: z.array(generatedFileSchema),
    dryRun: z.boolean().optional(),
  }),
  outputSchema: z.object({
    branch: z.string(),
    prNumber: z.number(),
    prUrl: z.string(),
    commitSha: z.string(),
    dryRun: z.boolean(),
  }),
  execute: async (input): Promise<GithubPrResult> => {
    const dryRun = isDryRun(input.dryRun);
    const [owner, repo] = input.repo.split('/');

    if (!owner || !repo) {
      throw new Error(`Invalid repo format "${input.repo}". Expected owner/repo.`);
    }

    if (dryRun) {
      const prNumber = Math.floor(Math.random() * 900) + 100;
      return {
        branch: input.branch,
        prNumber,
        prUrl: `https://github.com/${owner}/${repo}/pull/${prNumber}`,
        commitSha: `dryrun${Date.now().toString(16)}`,
        dryRun: true,
      };
    }

    const token = optionalEnv('GITHUB_TOKEN');
    if (!token) {
      throw new Error('GITHUB_TOKEN is required when dryRun is false');
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
    };

    const baseRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/ref/heads/${input.baseBranch}`,
      { headers },
    );
    if (!baseRes.ok) {
      throw new Error(`Failed to read base branch: ${await baseRes.text()}`);
    }
    const baseRef = (await baseRes.json()) as { object: { sha: string } };
    const baseSha = baseRef.object.sha;

    const refRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/refs`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        ref: `refs/heads/${input.branch}`,
        sha: baseSha,
      }),
    });
    if (!refRes.ok && refRes.status !== 422) {
      throw new Error(`Failed to create branch: ${await refRes.text()}`);
    }

    let latestSha = baseSha;
    for (const file of input.files) {
      const contentBase64 = Buffer.from(file.content, 'utf8').toString('base64');
      const putRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${file.path}`,
        {
          method: 'PUT',
          headers,
          body: JSON.stringify({
            message: `feat: add ${file.path} via AI pipeline`,
            content: contentBase64,
            branch: input.branch,
          }),
        },
      );
      if (!putRes.ok) {
        throw new Error(`Failed to write ${file.path}: ${await putRes.text()}`);
      }
      const putJson = (await putRes.json()) as { commit: { sha: string } };
      latestSha = putJson.commit.sha;
    }

    const prRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        title: input.title,
        head: input.branch,
        base: input.baseBranch,
        body: input.body,
      }),
    });
    if (!prRes.ok) {
      throw new Error(`Failed to open PR: ${await prRes.text()}`);
    }
    const pr = (await prRes.json()) as { number: number; html_url: string };

    return {
      branch: input.branch,
      prNumber: pr.number,
      prUrl: pr.html_url,
      commitSha: latestSha,
      dryRun: false,
    };
  },
});
