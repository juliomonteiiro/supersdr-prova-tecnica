import { Request } from 'express';
import { env } from '../../config/env';
import { AppError } from '../../shared/errors';

export function assertZApiWebhookAuthorized(req: Request): void {
  const expected = env.ZAPI_CLIENT_TOKEN;
  if (!expected) {
    return;
  }

  const received =
    req.get('Client-Token') ??
    req.get('client-token') ??
    (typeof req.headers['client-token'] === 'string'
      ? req.headers['client-token']
      : undefined);

  if (!received || received !== expected) {
    throw new AppError(
      'Invalid or missing Client-Token for Z-API webhook',
      401,
      'ZAPI_WEBHOOK_UNAUTHORIZED'
    );
  }
}
