import { Agent } from '@mastra/core/agent';
import { createGithubPrTool } from '../tools/github-tool.js';

export const githubAgent = new Agent({
  id: 'github-agent',
  name: 'GitHub Integration Agent',
  instructions: `You manage GitHub repository operations for the design-to-deploy pipeline.

Responsibilities:
- Create feature branches for generated UI code
- Commit React/TSX files produced by the Figma codegen agent
- Open pull requests with clear titles and Figma context in the body
- Prefer the create-github-pr tool for atomic branch+commit+PR flows
- Confirm dry-run vs live mode before mutating a repository`,
  model: 'google/gemini-flash-latest',
  tools: { createGithubPrTool },
});
