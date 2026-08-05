/** Shared contracts for the design → deploy pipeline. */

export type PipelineStatus =
  | 'pending'
  | 'figma'
  | 'codegen'
  | 'github'
  | 'linear'
  | 'deploy'
  | 'notify'
  | 'completed'
  | 'failed';

export interface GeneratedFile {
  path: string;
  content: string;
  language?: 'tsx' | 'ts' | 'css' | 'json' | 'html';
}

export interface FigmaDesignContext {
  fileKey: string;
  nodeId?: string;
  name: string;
  summary: string;
  frameHints: string[];
  screenshotUrl?: string;
  dryRun: boolean;
}

export interface GithubPrResult {
  branch: string;
  prNumber: number;
  prUrl: string;
  commitSha: string;
  dryRun: boolean;
}

export interface LinearIssueResult {
  issueId: string;
  identifier: string;
  url: string;
  dryRun: boolean;
}

export interface RailwayDeployResult {
  deploymentId: string;
  status: string;
  url: string;
  dryRun: boolean;
}

export interface SlackNotifyResult {
  channel: string;
  messageTs: string;
  dryRun: boolean;
}

export interface PipelineInput {
  figmaUrl: string;
  /** GitHub owner/repo, e.g. acme/demo-app */
  repo: string;
  /** Optional Slack channel for progress updates */
  slackChannel?: string;
  /** When true, skip live API calls and return realistic mock results */
  dryRun?: boolean;
  /** Base branch for the PR */
  baseBranch?: string;
}

export interface PipelineOutput {
  status: PipelineStatus;
  figma: FigmaDesignContext;
  files: GeneratedFile[];
  github: GithubPrResult;
  linear: LinearIssueResult;
  railway: RailwayDeployResult;
  slack: SlackNotifyResult;
  error?: string;
}

export function parseFigmaUrl(url: string): { fileKey: string; nodeId?: string } {
  const fileMatch = url.match(/figma\.com\/(?:file|design)\/([a-zA-Z0-9]+)/);
  if (!fileMatch) {
    throw new Error(`Invalid Figma URL: ${url}`);
  }

  const nodeMatch = url.match(/node-id=([^&]+)/);
  const nodeId = nodeMatch
    ? decodeURIComponent(nodeMatch[1]).replace(/-/g, ':')
    : undefined;

  return { fileKey: fileMatch[1], nodeId };
}
