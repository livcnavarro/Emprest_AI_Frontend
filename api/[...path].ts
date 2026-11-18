import type { IncomingMessage, ServerResponse } from 'node:http';
import { createServerlessApplication } from '../backend/dist/serverless.js';

let applicationPromise:
  | ReturnType<typeof createServerlessApplication>
  | undefined;

export default async function handler(
  request: IncomingMessage,
  response: ServerResponse,
): Promise<void> {
  applicationPromise ??= createServerlessApplication();
  const application = await applicationPromise;
  application(request, response);
}
