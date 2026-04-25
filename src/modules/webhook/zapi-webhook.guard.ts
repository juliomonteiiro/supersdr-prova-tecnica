import { Request } from 'express';
import { env } from '../../config/env';
import { AppError } from '../../shared/errors';

export function assertZApiWebhookAuthorized(req: Request): void {
  const expected = env.ZAPI_INSTANCE_TOKEN ?? env.ZAPI_CLIENT_TOKEN;
  if (!expected) {
    return;
  }

  const receivedZApiToken =
    req.get('z-api-token') ??
    req.get('Z-API-Token') ??
    (typeof req.headers['z-api-token'] === 'string'
      ? req.headers['z-api-token']
      : undefined);
  const receivedClientToken =
    req.get('Client-Token') ??
    req.get('client-token') ??
    (typeof req.headers['client-token'] === 'string'
      ? req.headers['client-token']
      : undefined);
  const received = receivedZApiToken ?? receivedClientToken;

  if (!received || received !== expected) {
    throw new AppError(
      'Invalid or missing token for Z-API webhook',
      401,
      'ZAPI_WEBHOOK_UNAUTHORIZED'
    );
  }
}
