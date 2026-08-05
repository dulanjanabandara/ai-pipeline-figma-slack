import { createStep, createWorkflow } from '@mastra/core/workflows';
import { isValidationError, type ValidationError } from '@mastra/core/tools';
import { z } from 'zod';
import { figmaCodegenAgent } from '../agents/figma-codegen-agent.js';
import { fetchFigmaDesignTool } from '../tools/figma-tool.js';
import { createGithubPrTool } from '../tools/github-tool.js';
import { createLinearIssueTool } from '../tools/linear-tool.js';
import { deployRailwayTool } from '../tools/railway-tool.js';
import { notifySlackTool } from '../tools/slack-tool.js';
import { isDryRun, hasLlmApiKey } from '../lib/env.js';
import { postPipelineProgress } from '../lib/progress.js';

const generatedFileSchema = z.object({
  path: z.string(),
  content: z.string(),
  language: z.enum(['tsx', 'ts', 'css', 'json', 'html']).optional(),
});

const pipelineInputSchema = z.object({
  figmaUrl: z.string().url(),
  repo: z.string().describe('GitHub owner/repo'),
  slackChannel: z.string().optional(),
  dryRun: z.boolean().optional(),
  baseBranch: z.string().default('main'),
  /** Pause before Railway deploy until Slack approve (default true in live mode) */
  requireDeployApproval: z.boolean().optional(),
});

const figmaSchema = z.object({
  fileKey: z.string(),
  nodeId: z.string().optional(),
  name: z.string(),
  summary: z.string(),
  frameHints: z.array(z.string()),
  screenshotUrl: z.string().optional(),
  dryRun: z.boolean(),
});

const githubSchema = z.object({
  branch: z.string(),
  prNumber: z.number(),
  prUrl: z.string(),
  commitSha: z.string(),
  dryRun: z.boolean(),
});

const linearSchema = z.object({
  issueId: z.string(),
  identifier: z.string(),
  url: z.string(),
  dryRun: z.boolean(),
});

const railwaySchema = z.object({
  deploymentId: z.string(),
  status: z.string(),
  url: z.string(),
  dryRun: z.boolean(),
});

const slackSchema = z.object({
  channel: z.string(),
  messageTs: z.string(),
  dryRun: z.boolean(),
});

/**
 * Mastra's Tool.execute wrapper never throws on validation failure — it resolves
 * to a ValidationError object (or `undefined`) instead, so calling code must check
 * for that explicitly. This wraps a raw `tool.execute!(input, {} as never)` call and
 * turns a bad result into a thrown Error so failures surface where they actually happen.
 */
async function runTool<TOut>(
  toolId: string,
  invoke: () => Promise<TOut | ValidationError | void>,
): Promise<TOut> {
  const result = await invoke();
  if (result === undefined) {
    throw new Error(`Tool "${toolId}" returned no output.`);
  }
  if (isValidationError(result)) {
    throw new Error(`Tool "${toolId}" failed: ${result.message}`);
  }
  return result;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40);
}

function fallbackGeneratedFiles(designName: string) {
  return [
    {
      path: 'src/App.tsx',
      language: 'tsx' as const,
      content: `export default function App() {
  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_#1a2332_0%,_#0b1020_55%,_#070a12_100%)] text-stone-100">
      <section className="relative flex min-h-screen flex-col justify-end px-8 pb-16 pt-10 md:px-16 md:pb-24">
        <p className="mb-6 font-serif text-4xl tracking-tight text-amber-100 md:text-6xl">
          ${designName}
        </p>
        <h1 className="max-w-3xl font-sans text-3xl font-medium leading-tight md:text-5xl">
          Design becomes deployable React in one agent workflow.
        </h1>
        <p className="mt-5 max-w-xl text-base text-stone-300 md:text-lg">
          Figma context in. Pull request, Linear issue, and Railway URL out — with Slack as the control plane.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <a
            className="rounded-sm bg-amber-200 px-5 py-3 text-sm font-semibold text-stone-900"
            href="#ship"
          >
            Ship this screen
          </a>
          <a className="px-5 py-3 text-sm text-stone-300 underline-offset-4 hover:underline" href="#docs">
            Read the pipeline
          </a>
        </div>
      </section>
    </main>
  );
}
`,
    },
    {
      path: 'src/index.css',
      language: 'css' as const,
      content: `@import "tailwindcss";

:root {
  color-scheme: dark;
  font-family: "IBM Plex Sans", "Segoe UI", sans-serif;
}

body {
  margin: 0;
  min-height: 100vh;
  background: #070a12;
}
`,
    },
  ];
}

const afterGithubSchema = pipelineInputSchema.extend({
  figma: figmaSchema,
  files: z.array(generatedFileSchema),
  github: githubSchema,
});

const afterLinearSchema = afterGithubSchema.extend({
  linear: linearSchema,
});

const afterApproveSchema = afterLinearSchema.extend({
  deployApproved: z.boolean(),
});

const fetchDesignStep = createStep({
  id: 'fetch-figma-design',
  description: 'Pull design context from Figma',
  inputSchema: pipelineInputSchema,
  outputSchema: pipelineInputSchema.extend({
    figma: figmaSchema,
  }),
  execute: async ({ inputData }) => {
    const dryRun = isDryRun(inputData.dryRun);
    await postPipelineProgress({
      channel: inputData.slackChannel,
      dryRun,
      text: `:art: *Figma* — fetching design context…\n${inputData.figmaUrl}`,
    });

    const figma = await runTool('fetch-figma-design', () =>
      fetchFigmaDesignTool.execute!(
        {
          figmaUrl: inputData.figmaUrl,
          dryRun,
        },
        {} as never,
      ),
    );

    await postPipelineProgress({
      channel: inputData.slackChannel,
      dryRun,
      text: `:white_check_mark: *Figma* — \`${figma.name}\` (${figma.fileKey})${figma.dryRun ? ' _(dry-run)_' : ''}`,
    });

    return {
      ...inputData,
      dryRun,
      figma,
    };
  },
});

const codegenStep = createStep({
  id: 'generate-react-code',
  description: 'Generate React + TSX files from Figma context',
  inputSchema: pipelineInputSchema.extend({
    figma: figmaSchema,
  }),
  outputSchema: pipelineInputSchema.extend({
    figma: figmaSchema,
    files: z.array(generatedFileSchema),
  }),
  execute: async ({ inputData }) => {
    const dryRun = isDryRun(inputData.dryRun);
    await postPipelineProgress({
      channel: inputData.slackChannel,
      dryRun,
      text: ':gear: *Codegen* — generating React + TypeScript…',
    });

    if (dryRun || !hasLlmApiKey()) {
      const files = fallbackGeneratedFiles(inputData.figma.name);
      await postPipelineProgress({
        channel: inputData.slackChannel,
        dryRun: true,
        text: `:white_check_mark: *Codegen* — ${files.length} file(s) (template fallback / dry-run)`,
      });
      return {
        ...inputData,
        dryRun: true,
        files,
      };
    }

    const schema = z.object({
      files: z.array(generatedFileSchema).min(1),
    });

    const result = await figmaCodegenAgent.generate(
      `Generate React + TypeScript + Tailwind files for this Figma design.

Design name: ${inputData.figma.name}
Summary: ${inputData.figma.summary}
Frame hints: ${inputData.figma.frameHints.join(', ')}
File key: ${inputData.figma.fileKey}
Node: ${inputData.figma.nodeId ?? 'root'}

Return files suitable for the demo-app Vite project.`,
      {
        structuredOutput: { schema },
      },
    );

    const structured = result.object as z.infer<typeof schema> | undefined;
    const files = structured?.files?.length
      ? structured.files
      : fallbackGeneratedFiles(inputData.figma.name);

    await postPipelineProgress({
      channel: inputData.slackChannel,
      dryRun,
      text: `:white_check_mark: *Codegen* — ${files.map((f) => `\`${f.path}\``).join(', ')}`,
    });

    return {
      ...inputData,
      dryRun,
      files,
    };
  },
});

const githubStep = createStep({
  id: 'create-github-pr',
  description: 'Commit generated files and open a PR',
  inputSchema: pipelineInputSchema.extend({
    figma: figmaSchema,
    files: z.array(generatedFileSchema),
  }),
  outputSchema: afterGithubSchema,
  execute: async ({ inputData }) => {
    const dryRun = isDryRun(inputData.dryRun);
    await postPipelineProgress({
      channel: inputData.slackChannel,
      dryRun,
      text: `:octocat: *GitHub* — opening PR on \`${inputData.repo}\`…`,
    });

    const branch = `agent/figma-${slugify(inputData.figma.fileKey)}-${Date.now().toString(36)}`;

    const github = await runTool('create-github-pr', () =>
      createGithubPrTool.execute!(
        {
          repo: inputData.repo,
          baseBranch: inputData.baseBranch ?? 'main',
          branch,
          title: `feat(ui): generate ${inputData.figma.name} from Figma`,
          body: [
            `Automated PR from the Mastra design-to-deploy pipeline.`,
            ``,
            `**Figma:** ${inputData.figmaUrl}`,
            `**Design:** ${inputData.figma.name}`,
            `**Summary:** ${inputData.figma.summary}`,
          ].join('\n'),
          files: inputData.files,
          dryRun,
        },
        {} as never,
      ),
    );

    await postPipelineProgress({
      channel: inputData.slackChannel,
      dryRun,
      text: `:white_check_mark: *GitHub* — <${github.prUrl}|PR #${github.prNumber}> on \`${github.branch}\``,
    });

    return { ...inputData, dryRun, github };
  },
});

const linearStep = createStep({
  id: 'create-linear-issue',
  description: 'Track the UI work in Linear',
  inputSchema: afterGithubSchema,
  outputSchema: afterLinearSchema,
  execute: async ({ inputData }) => {
    const dryRun = isDryRun(inputData.dryRun);
    await postPipelineProgress({
      channel: inputData.slackChannel,
      dryRun,
      text: ':clipboard: *Linear* — creating issue…',
    });

    const linear = await runTool('create-linear-issue', () =>
      createLinearIssueTool.execute!(
        {
          title: `Implement UI: ${inputData.figma.name}`,
          description: `Generated from Figma (${inputData.figma.fileKey}). Branch \`${inputData.github.branch}\`.`,
          prUrl: inputData.github.prUrl,
          dryRun,
        },
        {} as never,
      ),
    );

    await postPipelineProgress({
      channel: inputData.slackChannel,
      dryRun,
      text: `:white_check_mark: *Linear* — <${linear.url}|${linear.identifier}>`,
    });

    return { ...inputData, dryRun, linear };
  },
});

const approveDeployStep = createStep({
  id: 'approve-deploy',
  description: 'Human-in-the-loop approval before Railway deploy (Slack control)',
  inputSchema: afterLinearSchema,
  outputSchema: afterApproveSchema,
  suspendSchema: z.object({
    reason: z.string(),
    runHint: z.string(),
    prUrl: z.string(),
    linearUrl: z.string(),
  }),
  resumeSchema: z.object({
    approved: z.boolean(),
  }),
  execute: async ({ inputData, resumeData, suspend }) => {
    const dryRun = isDryRun(inputData.dryRun);
    const requireApproval =
      inputData.requireDeployApproval ?? (!dryRun && process.env.SKIP_DEPLOY_APPROVAL !== 'true');

    if (!requireApproval) {
      await postPipelineProgress({
        channel: inputData.slackChannel,
        dryRun,
        text: ':rocket: *Approve* — skipped (dry-run or SKIP_DEPLOY_APPROVAL)',
      });
      return { ...inputData, dryRun, deployApproved: true };
    }

    const { approved } = resumeData ?? {};
    if (approved === true) {
      await postPipelineProgress({
        channel: inputData.slackChannel,
        dryRun,
        text: ':white_check_mark: *Approve* — deploy approved',
      });
      return { ...inputData, dryRun, deployApproved: true };
    }
    if (approved === false) {
      await postPipelineProgress({
        channel: inputData.slackChannel,
        dryRun,
        text: ':no_entry: *Approve* — deploy rejected; pipeline stopped',
      });
      throw new Error('Deploy rejected by operator in Slack');
    }

    await postPipelineProgress({
      channel: inputData.slackChannel,
      dryRun,
      text: [
        ':hand: *Approval needed before Railway deploy*',
        `• PR: ${inputData.github.prUrl}`,
        `• Linear: ${inputData.linear.url}`,
        'Reply in Slack with the approve/reject buttons, or resume the run from Studio.',
      ].join('\n'),
    });

    return await suspend({
      reason: 'Human approval required before Railway deploy.',
      runHint: 'Resume with { approved: true } or { approved: false }',
      prUrl: inputData.github.prUrl,
      linearUrl: inputData.linear.url,
    });
  },
});

const deployStep = createStep({
  id: 'deploy-railway',
  description: 'Trigger Railway deployment',
  inputSchema: afterApproveSchema,
  outputSchema: afterApproveSchema.extend({
    railway: railwaySchema,
  }),
  execute: async ({ inputData }) => {
    const dryRun = isDryRun(inputData.dryRun);
    await postPipelineProgress({
      channel: inputData.slackChannel,
      dryRun,
      text: ':railway_track: *Railway* — triggering deploy…',
    });

    let railway;
    try {
      railway = await runTool('deploy-railway', () => deployRailwayTool.execute!({ dryRun }, {} as never));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      await postPipelineProgress({
        channel: inputData.slackChannel,
        dryRun,
        text: `:x: *Railway* — deploy trigger failed: \`${message}\``,
      });
      throw error;
    }

    await postPipelineProgress({
      channel: inputData.slackChannel,
      dryRun,
      text: `:white_check_mark: *Railway* — <${railway.url}|${railway.status}> (\`${railway.deploymentId}\`)`,
    });

    return { ...inputData, dryRun, railway };
  },
});

const notifyStep = createStep({
  id: 'notify-slack',
  description: 'Post completion summary to Slack',
  inputSchema: afterApproveSchema.extend({
    railway: railwaySchema,
  }),
  outputSchema: z.object({
    status: z.literal('completed'),
    figma: figmaSchema,
    files: z.array(generatedFileSchema),
    github: githubSchema,
    linear: linearSchema,
    railway: railwaySchema,
    slack: slackSchema,
  }),
  execute: async ({ inputData }) => {
    const dryRun = isDryRun(inputData.dryRun);
    const text = [
      `*Design → Deploy pipeline complete*${dryRun ? ' (dry-run)' : ''}`,
      `• Figma: ${inputData.figma.name}`,
      `• PR: ${inputData.github.prUrl}`,
      `• Linear: ${inputData.linear.identifier} — ${inputData.linear.url}`,
      `• Railway: ${inputData.railway.url} (${inputData.railway.status})`,
      `• Files: ${inputData.files.map((f) => f.path).join(', ')}`,
    ].join('\n');

    const slack = await runTool('notify-slack', () =>
      notifySlackTool.execute!(
        {
          channel: inputData.slackChannel,
          text,
          dryRun,
        },
        {} as never,
      ),
    );

    return {
      status: 'completed' as const,
      figma: inputData.figma,
      files: inputData.files,
      github: inputData.github,
      linear: inputData.linear,
      railway: inputData.railway,
      slack,
    };
  },
});

export const designToDeployWorkflow = createWorkflow({
  id: 'design-to-deploy',
  description:
    'Slack-triggered: Figma → React → GitHub PR → Linear → approve → Railway → Slack',
  inputSchema: pipelineInputSchema,
  outputSchema: z.object({
    status: z.literal('completed'),
    figma: figmaSchema,
    files: z.array(generatedFileSchema),
    github: githubSchema,
    linear: linearSchema,
    railway: railwaySchema,
    slack: slackSchema,
  }),
})
  .then(fetchDesignStep)
  .then(codegenStep)
  .then(githubStep)
  .then(linearStep)
  .then(approveDeployStep)
  .then(deployStep)
  .then(notifyStep)
  .commit();

// Mastra's build step auto-discovers `src/mastra/workflows/*.ts` and requires a
// default export (separate from the named export used for explicit registration
// in `mastra/index.ts`). Both point to the same workflow instance.
export default designToDeployWorkflow;
