# AI Agent Pipeline (Mastra Monorepo)

End-to-end multi-agent workflow for the AI Engineering Research Assignment:

**Slack `/ship-design` → Figma → React codegen → GitHub PR → Linear → Approve → Railway → Slack**

## Monorepo layout

```text
apps/
  orchestrator/   Mastra agents, MCP, workflow, Slack bot
  demo-app/       Vite + React template the pipeline targets
packages/
  shared/         Shared TypeScript contracts
```

## Assignment mapping

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| Figma → React (Agent / MCP) | Done | `figma-codegen-agent` + Figma REST tool + optional Figma MCP |
| GitHub Integration Agent | Done | `github-agent` + `create-github-pr` tool (+ GitHub MCP when token set) |
| Linear Integration Agent | Done | `linear-agent` + `create-linear-issue` tool (+ Linear MCP when key set) |
| Slack Bot Agent | Done | `slack-bot-agent` + Bolt `/ship-design` + progress posts + approve buttons |
| Railway Deploy Agent | Done | `railway-agent` + `deploy-railway` tool |
| MCP | Done | `loadMcpResources()` wires Figma/GitHub/Linear MCP into Mastra + control agents |
| Slack control plane | Done | Slash command starts workflow; mentions route to Slack Bot Agent |

## Quick start

```bash
npm install
npm run build -w @ai-pipeline/shared
cp apps/orchestrator/.env.example apps/orchestrator/.env

# Studio (agents + workflow UI)
npm run dev

# Full dry-run without Slack tokens
npm run pipeline:dry-run -w orchestrator

# Demo frontend
npm run dev:demo
```

## Slack Bot (control + notifications)

1. Create a Slack app from [`apps/orchestrator/slack-app-manifest.yaml`](apps/orchestrator/slack-app-manifest.yaml)
2. Install to your workspace; enable **Socket Mode** and create an **App-Level Token** (`connections:write`)
3. Put tokens in `apps/orchestrator/.env`:

```env
SLACK_BOT_TOKEN=xoxb-...
SLACK_SIGNING_SECRET=...
SLACK_APP_TOKEN=xapp-...
DEFAULT_GITHUB_REPO=your-org/demo-app
DRY_RUN=true
```

4. Start the bot:

```bash
npm run slack:bot -w orchestrator
```

5. In Slack:

```text
/ship-design https://www.figma.com/design/ABC/Hero your-org/demo-app
/ship-design https://www.figma.com/design/ABC/Hero your-org/demo-app --live --approve
```

- Progress messages post after **each** pipeline step
- With `--approve` or live mode, Slack shows **Approve deploy / Reject** buttons before Railway

## Pipeline steps

1. `fetch-figma-design` — Figma REST (or mock) + Slack progress  
2. `generate-react-code` — Claude codegen (or template in dry-run)  
3. `create-github-pr` — branch + commit + PR  
4. `create-linear-issue` — issue linked to PR  
5. `approve-deploy` — human-in-the-loop (Slack / Studio resume)  
6. `deploy-railway` — trigger deploy  
7. `notify-slack` — final summary  

## MCP

When tokens are present, the orchestrator starts MCP servers:

| Env | MCP server |
|-----|------------|
| `FIGMA_ACCESS_TOKEN` | `figma-developer-mcp` |
| `GITHUB_TOKEN` | `@modelcontextprotocol/server-github` |
| `LINEAR_API_KEY` | `mcp-linear` |

Tools are merged into the Slack Bot + Pipeline Control + Figma agents, and proxies are registered on `Mastra.mcpServers`.

## Going live

Set tokens in `apps/orchestrator/.env`, then use `--live` (CLI/Slack) or `"dryRun": false` in Studio.

Required for live mode:

- `GOOGLE_GENERATIVE_AI_API_KEY` (or swap the model string in `src/mastra/agents/*.ts` for another provider — Anthropic/OpenAI/Groq are also supported)
- `FIGMA_ACCESS_TOKEN`
- `GITHUB_TOKEN`
- `LINEAR_API_KEY` + `LINEAR_TEAM_ID`
- `RAILWAY_TOKEN` + `RAILWAY_SERVICE_ID` + `RAILWAY_ENVIRONMENT_ID`
- Slack bot tokens (for control plane)

## Agents

| Agent | Role |
|-------|------|
| `figma-codegen-agent` | Design → React |
| `github-agent` | Repo + PR |
| `linear-agent` | Issue tracking |
| `railway-agent` | Deploy |
| `slack-bot-agent` | Notifications + control |
| `pipeline-control-agent` | Studio / debugging orchestrator |
