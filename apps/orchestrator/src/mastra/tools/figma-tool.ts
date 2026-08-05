import { createTool } from '@mastra/core/tools';
import { parseFigmaUrl, type FigmaDesignContext } from '@ai-pipeline/shared';
import { z } from 'zod';
import { isDryRun, optionalEnv } from '../lib/env.js';

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Figma's REST API rate-limits per token (shared with the figma-developer-mcp
 * server if that's also running). A 429 is almost always transient, so retry
 * with backoff instead of failing the whole pipeline run immediately.
 */
async function fetchFigmaWithRetry(
  url: string,
  token: string,
  maxAttempts = 4,
): Promise<Response> {
  let lastRes: Response | undefined;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const res = await fetch(url, { headers: { 'X-Figma-Token': token } });
    if (res.status !== 429) return res;
    lastRes = res;
    if (attempt === maxAttempts) break;
    const retryAfterHeader = Number(res.headers.get('Retry-After'));
    const delayMs = Number.isFinite(retryAfterHeader) && retryAfterHeader > 0
      ? retryAfterHeader * 1000
      : 2 ** attempt * 1000; // 2s, 4s, 8s...
    await sleep(delayMs);
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
