import { parseShipDesignText } from '../slack/parse-command.js';

const parsed = parseShipDesignText(
  'https://www.figma.com/design/ABC123/Hero acme/demo-app --live --approve',
  { repo: 'fallback/repo' },
);

console.log(parsed);

if (!parsed.figmaUrl.includes('ABC123')) throw new Error('figma parse failed');
if (parsed.repo !== 'acme/demo-app') throw new Error('repo parse failed');
if (parsed.dryRun !== false) throw new Error('live flag failed');
if (parsed.requireDeployApproval !== true) throw new Error('approve flag failed');

console.log('parse-command ok');
