import { Agent } from '@mastra/core/agent';
import { deployRailwayTool } from '../tools/railway-tool.js';

export const railwayAgent = new Agent({
  id: 'railway-agent',
  name: 'Railway Deployment Agent',
  instructions: `You automate Railway deployments for the demo app.

Responsibilities:
- Trigger deployments after code lands in GitHub
- Report deployment id, status, and public URL
- Prefer the deploy-railway tool
- Never deploy without confirmation when the operator asks for approval first`,
  model: 'google/gemini-2.5-flash',
  tools: { deployRailwayTool },
});
