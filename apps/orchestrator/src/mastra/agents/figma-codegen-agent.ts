import { Agent } from '@mastra/core/agent';
import { fetchFigmaDesignTool } from '../tools/figma-tool.js';

export const figmaCodegenAgent = new Agent({
  id: 'figma-codegen-agent',
  name: 'Figma → React Code Generator',
  instructions: `You convert Figma design context into clean React + TypeScript + Tailwind UI code.

Rules:
- Prefer a single composition for the first viewport (not a dashboard).
- Brand/product name must be hero-level, not only nav text.
- Avoid purple-on-white clichés, cream+terracotta defaults, and broadsheet newspaper layouts.
- No cards in the hero. Keep one headline, one supporting sentence, one CTA group.
- Output ONLY valid structured data matching the schema: an array of files with path + content.
- Use Vite-friendly paths like src/App.tsx and src/index.css.
- Do not invent backend APIs; keep the UI self-contained.
- When MCP Figma tools are available, prefer them for richer design context.`,
  model: 'google/gemini-2.5-flash',
  tools: { fetchFigmaDesignTool },
});
