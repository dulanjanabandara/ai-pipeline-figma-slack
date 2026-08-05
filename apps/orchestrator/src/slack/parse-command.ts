export type ShipDesignCommand = {
  figmaUrl: string;
  repo: string;
  dryRun: boolean;
  requireDeployApproval: boolean;
};

/**
 * Parse `/ship-design` text:
 *   <figma-url> [owner/repo] [--live] [--approve]
 */
export function parseShipDesignText(
  text: string,
  defaults: { repo: string },
): ShipDesignCommand {
  const tokens = text.trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) {
    throw new Error(
      'Usage: `/ship-design <figma-url> [owner/repo] [--live] [--approve]`',
    );
  }

  const flags = new Set(
    tokens.filter((t) => t.startsWith('--')).map((t) => t.toLowerCase()),
  );
  const positional = tokens.filter((t) => !t.startsWith('--'));

  const figmaUrl = positional[0];
  if (!/^https?:\/\/(www\.)?figma\.com\//i.test(figmaUrl)) {
    throw new Error(`Expected a Figma URL, got: ${figmaUrl}`);
  }

  const repo = positional[1] ?? defaults.repo;
  if (!/^[\w.-]+\/[\w.-]+$/.test(repo)) {
    throw new Error(`Expected GitHub owner/repo, got: ${repo}`);
  }

  const dryRun = !flags.has('--live');
  const requireDeployApproval = flags.has('--approve') || !dryRun;

  return { figmaUrl, repo, dryRun, requireDeployApproval };
}
