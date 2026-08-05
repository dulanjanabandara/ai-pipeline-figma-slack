# Orchestrator (Mastra)

Agents, MCP, `design-to-deploy` workflow, and Slack Bolt control plane.

```bash
# from monorepo root
npm run dev                         # Studio :4111
npm run pipeline:dry-run -w orchestrator
npm run slack:bot -w orchestrator   # needs Slack tokens + Socket Mode
```

Slack app manifest: [`slack-app-manifest.yaml`](./slack-app-manifest.yaml)

See the root [README](../../README.md) for architecture and env vars.
