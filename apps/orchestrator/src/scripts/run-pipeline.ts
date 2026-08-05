/**
 * CLI helper to run the design-to-deploy workflow once.
 *
 * Usage:
 *   npm run pipeline:dry-run -w orchestrator
 *   npm run pipeline:dry-run -w orchestrator -- --figma https://www.figma.com/design/ABC123/Hero --repo owner/repo
 *   npm run pipeline:dry-run -w orchestrator -- --live --approve
 */
import 'dotenv/config';
import { mastra } from '../mastra/index.js';

function arg(flag: string, fallback?: string): string | undefined {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return fallback;
  return process.argv[idx + 1] ?? fallback;
}

const figmaUrl =
  arg('--figma') ??
  'https://www.figma.com/design/DEMOFILEKEY/Hero-Landing?node-id=1-2';
const repo = arg('--repo') ?? 'acme/demo-app';
const dryRun = process.argv.includes('--live') ? false : true;
const requireDeployApproval = process.argv.includes('--approve');

const workflow = mastra.getWorkflow('designToDeployWorkflow');
const run = await workflow.createRun();

console.log('Starting design-to-deploy workflow...');
console.log({ figmaUrl, repo, dryRun, requireDeployApproval, runId: run.runId });

const result = await run.start({
  inputData: {
    figmaUrl,
    repo,
    dryRun,
    baseBranch: 'main',
    slackChannel: process.env.SLACK_CHANNEL || '#ai-pipeline',
    requireDeployApproval,
  },
});

console.log(JSON.stringify(result, null, 2));
