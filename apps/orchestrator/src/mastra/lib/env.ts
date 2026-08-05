export function hasLlmApiKey(): boolean {
  return Boolean(
    process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.ANTHROPIC_API_KEY ||
      process.env.OPENAI_API_KEY ||
      process.env.GROQ_API_KEY,
  );
}

export function isDryRun(explicit?: boolean): boolean {
  if (typeof explicit === 'boolean') return explicit;
  if (process.env.DRY_RUN === 'true') return true;
  if (process.env.DRY_RUN === 'false') return false;
  // Default to dry-run when critical tokens are missing so demos still work.
  return !process.env.GITHUB_TOKEN || !hasLlmApiKey();
}

export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function optionalEnv(name: string, fallback = ''): string {
  return process.env[name] ?? fallback;
}
