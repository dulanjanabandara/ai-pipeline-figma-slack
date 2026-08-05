import { createTool } from '@mastra/core/tools';
import type { RailwayDeployResult } from '@ai-pipeline/shared';
import { z } from 'zod';
import { isDryRun, optionalEnv } from '../lib/env.js';

export const deployRailwayTool = createTool({
  id: 'deploy-railway',
  description: 'Trigger a Railway deployment for the demo app and return the public URL.',
  inputSchema: z.object({
    serviceId: z.string().optional(),
    environmentId: z.string().optional(),
    dryRun: z.boolean().optional(),
  }),
  outputSchema: z.object({
    deploymentId: z.string(),
    status: z.string(),
    url: z.string(),
    dryRun: z.boolean(),
  }),
  execute: async (input): Promise<RailwayDeployResult> => {
    const dryRun = isDryRun(input.dryRun);

    if (dryRun) {
      const id = `dryrun-deploy-${Date.now()}`;
      return {
        deploymentId: id,
        status: 'SUCCESS',
        url: `https://demo-app-dryrun.up.railway.app`,
        dryRun: true,
      };
    }

    const token = optionalEnv('RAILWAY_TOKEN');
    const serviceId = input.serviceId || optionalEnv('RAILWAY_SERVICE_ID');
    const environmentId = input.environmentId || optionalEnv('RAILWAY_ENVIRONMENT_ID');
    const publicUrl = optionalEnv('RAILWAY_PUBLIC_URL', 'https://demo-app.up.railway.app');

    if (!token || !serviceId || !environmentId) {
      throw new Error(
        'RAILWAY_TOKEN, RAILWAY_SERVICE_ID, and RAILWAY_ENVIRONMENT_ID are required when dryRun is false',
      );
    }

    const mutation = `
      mutation serviceInstanceDeploy($serviceId: String!, $environmentId: String!) {
        serviceInstanceDeploy(serviceId: $serviceId, environmentId: $environmentId)
      }
    `;

    const res = await fetch('https://backboard.railway.app/graphql/v2', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: mutation,
        variables: { serviceId, environmentId },
      }),
    });

    if (!res.ok) {
      throw new Error(`Railway API error: ${await res.text()}`);
    }

    const json = (await res.json()) as {
      data?: { serviceInstanceDeploy?: string };
      errors?: unknown;
    };

    const deploymentId = json.data?.serviceInstanceDeploy;
    if (!deploymentId) {
      throw new Error(`Railway deploy failed: ${JSON.stringify(json.errors ?? json)}`);
    }

    return {
      deploymentId,
      status: 'TRIGGERED',
      url: publicUrl,
      dryRun: false,
    };
  },
});
