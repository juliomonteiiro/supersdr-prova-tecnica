import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import type { Request } from 'express';
import { assertZApiWebhookAuthorized } from './zapi-webhook.guard';

vi.mock('../../config/env', () => ({
  env: {
    LOG_LEVEL: 'silent',
    ZAPI_INSTANCE_TOKEN: undefined as string | undefined,
    ZAPI_CLIENT_TOKEN: undefined as string | undefined
  }
}));

vi.mock('../../infra/logger/logger', () => ({
  logger: {
    warn: vi.fn()
  }
}));

import { env } from '../../config/env';

function mockRequest(headers: Record<string, string | undefined>): Request {
  const lower: Record<string, string | undefined> = {};
  for (const [k, v] of Object.entries(headers)) {
    lower[k.toLowerCase()] = v;
  }
  return {
    get(name: string) {
      return lower[name.toLowerCase()];
    },
    headers: lower
  } as unknown as Request;
}

describe('assertZApiWebhookAuthorized', () => {
  beforeEach(() => {
    vi.mocked(env).ZAPI_INSTANCE_TOKEN = undefined;
    vi.mocked(env).ZAPI_CLIENT_TOKEN = undefined;
  });

  afterEach(() => {
    vi.mocked(env).ZAPI_INSTANCE_TOKEN = undefined;
    vi.mocked(env).ZAPI_CLIENT_TOKEN = undefined;
  });

  it('allows any request when no Z-API token is configured', () => {
    vi.mocked(env).ZAPI_INSTANCE_TOKEN = undefined;
    vi.mocked(env).ZAPI_CLIENT_TOKEN = undefined;
    expect(() =>
      assertZApiWebhookAuthorized(mockRequest({}))
    ).not.toThrow();
  });

  it('allows request when z-api-token matches instance token', () => {
    vi.mocked(env).ZAPI_INSTANCE_TOKEN = 'instance-token';
    expect(() =>
      assertZApiWebhookAuthorized(
        mockRequest({ 'z-api-token': 'instance-token' })
      )
    ).not.toThrow();
  });

  it('allows request when Client-Token matches legacy token config', () => {
    vi.mocked(env).ZAPI_CLIENT_TOKEN = 'secret-from-panel';
    expect(() =>
      assertZApiWebhookAuthorized(
        mockRequest({ 'Client-Token': 'secret-from-panel' })
      )
    ).not.toThrow();
  });

  it('rejects when token is configured but header is missing', () => {
    vi.mocked(env).ZAPI_INSTANCE_TOKEN = 'instance-token';
    expect(() => assertZApiWebhookAuthorized(mockRequest({}))).toThrow(
      'Invalid or missing token for Z-API webhook'
    );
  });

  it('rejects when header does not match', () => {
    vi.mocked(env).ZAPI_INSTANCE_TOKEN = 'instance-token';
    expect(() =>
      assertZApiWebhookAuthorized(mockRequest({ 'z-api-token': 'wrong' }))
    ).toThrow('Invalid or missing token for Z-API webhook');
  });
});
