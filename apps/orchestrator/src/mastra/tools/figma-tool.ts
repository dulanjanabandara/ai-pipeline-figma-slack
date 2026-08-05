import { createTool } from '@mastra/core/tools';
import { parseFigmaUrl, type FigmaDesignContext } from '@ai-pipeline/shared';
import { z } from 'zod';
import { isDryRun, optionalEnv } from '../lib/env.js';

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Figma's REST API rate-limits per token (shared with the figma-developer-mcp
 * server if that's also running). A short 429 is usually transient, so retry
 * with backoff — but Figma can also return a `Retry-After` measured in HOURS
 * or DAYS once a token is badly throttled, and blindly sleeping for that long
 * would hang the whole pipeline. Cap the wait; if Figma demands longer than
 * that, fail fast with a clear message instead of hanging.
 */
const MAX_RETRY_WAIT_MS = 15_000;

async function fetchFigmaWithRetry(
  url: string,
  token: string,
  maxAttempts = 3,
): Promise<Response> {
  let lastRes: Response | undefined;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const res = await fetch(url, { headers: { 'X-Figma-Token': token } });
    if (res.status !== 429) return res;
    lastRes = res;

    const retryAfterHeader = Number(res.headers.get('Retry-After'));
    const requestedDelayMs =
      Number.isFinite(retryAfterHeader) && retryAfterHeader > 0
        ? retryAfterHeader * 1000
        : 2 ** attempt * 1000; // 2s, 4s, 8s...

    if (requestedDelayMs > MAX_RETRY_WAIT_MS) {
      const retryAfterMinutes = Math.ceil(requestedDelayMs / 60_000);
      throw new Error(
        `Figma API rate limit exceeded (429) and Retry-After is ${retryAfterMinutes} minute(s) — ` +
          `too long to wait inline. The FIGMA_ACCESS_TOKEN is likely heavily throttled right now; ` +
          `wait for the window to reset or use a different token.`,
      );
    }
    if (attempt === maxAttempts) break;
    await sleep(requestedDelayMs);
  }
  return lastRes!;
}

export const fetchFigmaDesignTool = createTool({
  id: 'fetch-figma-design',
  description:
    'Fetch design context from a Figma file URL (file key, node, summary). Uses Figma REST API or dry-run mocks.',
  inputSchema: z.object({
    figmaUrl: z.string().url(),
    dryRun: z.boolean().optional(),
  }),
  outputSchema: z.object({
    fileKey: z.string(),
    nodeId: z.string().optional(),
    name: z.string(),
    summary: z.string(),
    frameHints: z.array(z.string()),
    screenshotUrl: z.string().optional(),
    dryRun: z.boolean(),
  }),
  execute: async (input): Promise<FigmaDesignContext> => {
    const dryRun = isDryRun(input.dryRun);
    const { fileKey, nodeId } = parseFigmaUrl(input.figmaUrl);

    if (dryRun) {
      return {
        fileKey,
        nodeId,
        name: 'Hero Landing (dry-run)',
        summary:
          'A marketing hero with brand wordmark, one headline, supporting sentence, primary CTA, and full-bleed product imagery.',
        frameHints: [
          'Full-bleed hero background',
          'Brand-first typography',
          'Single CTA group',
          'No cards in hero',
        ],
        dryRun: true,
      };
    }

    const token = optionalEnv('FIGMA_ACCESS_TOKEN');
    if (!token) {
      throw new Error('FIGMA_ACCESS_TOKEN is required when dryRun is false');
    }

    const fileRes = await fetchFigmaWithRetry(
      `https://api.figma.com/v1/files/${fileKey}`,
      token,
    );

    if (!fileRes.ok) {
      throw new Error(`Figma API error ${fileRes.status}: ${await fileRes.text()}`);
    }

    const fileJson = (await fileRes.json()) as {
      name: string;
      document?: { children?: Array<{ name: string; type: string }> };
    };

    const frames =
      fileJson.document?.children
        ?.filter((c) => c.type === 'CANVAS' || c.type === 'FRAME')
        .map((c) => c.name)
        .slice(0, 8) ?? [];

    let screenshotUrl: string | undefined;
    if (nodeId) {
      const imgRes = await fetchFigmaWithRetry(
        `https://api.figma.com/v1/images/${fileKey}?ids=${encodeURIComponent(nodeId)}&format=png`,
        token,
      );
      if (imgRes.ok) {
        const imgJson = (await imgRes.json()) as { images?: Record<string, string> };
        screenshotUrl = imgJson.images?.[nodeId];
      }
    }

    return {
      fileKey,
      nodeId,
      name: fileJson.name,
      summary: `Figma file "${fileJson.name}" with frames: ${frames.join(', ') || 'none listed'}`,
      frameHints: frames,
      screenshotUrl,
      dryRun: false,
    };
  },
});
