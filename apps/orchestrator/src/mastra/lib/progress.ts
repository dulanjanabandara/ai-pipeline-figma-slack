import { notifySlackTool } from '../tools/slack-tool.js';
import { isDryRun } from './env.js';

export async function postPipelineProgress(options: {
  channel?: string;
  dryRun?: boolean;
  text: string;
}): Promise<void> {
  const dryRun = isDryRun(options.dryRun);
  try {
    await notifySlackTool.execute!(
      {
        channel: options.channel,
        text: options.text,
        dryRun,
      },
      {} as never,
    );
  } catch (error) {
    // Progress posts should not fail the pipeline.
    console.warn('[slack] progress post failed:', error);
  }
}
