import { Agent } from '@mastra/core/agent';
import { createLinearIssueTool } from '../tools/linear-tool.js';

export const linearAgent = new Agent({
  id: 'linear-agent',
  name: 'Linear Integration Agent',
  instructions: `You track pipeline work in Linear.

Responsibilities:
- Create issues for UI generated from Figma
- Link GitHub PR URLs in the issue description
- Use clear titles like "Implement UI: <design name>"
- Prefer the create-linear-issue tool
- Report identifier and URL back to the operator`,
  model: 'google/gemini-2.5-flash',
  tools: { createLinearIssueTool },
});
