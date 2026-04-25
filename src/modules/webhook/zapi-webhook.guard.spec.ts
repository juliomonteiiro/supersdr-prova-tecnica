import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import type { Request } from 'express';
import { assertZApiWebhookAuthorized } from './zapi-webhook.guard';

vi.mock('../../config/env', () => ({
  env: { ZAPI_CLIENT_TOKEN: undefined as string | undefined }
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
    vi.mocked(env).ZAPI_CLIENT_TOKEN = undefined;
  });

  afterEach(() => {
    vi.mocked(env).ZAPI_CLIENT_TOKEN = undefined;
  });

  it('allows any request when ZAPI_CLIENT_TOKEN is not configured', () => {
    vi.mocked(env).ZAPI_CLIENT_TOKEN = undefined;
    expect(() =>
      assertZApiWebhookAuthorized(mockRequest({}))
    ).not.toThrow();
  });

  it('allows request when Client-Token matches', () => {
    vi.mocked(env).ZAPI_CLIENT_TOKEN = 'secret-from-panel';
    expect(() =>
      assertZApiWebhookAuthorized(
        mockRequest({ 'Client-Token': 'secret-from-panel' })
      )
    ).not.toThrow();
  });

  it('rejects when token is configured but header is missing', () => {
    vi.mocked(env).ZAPI_CLIENT_TOKEN = 'secret-from-panel';
    expect(() => assertZApiWebhookAuthorized(mockRequest({}))).toThrow(
      'Invalid or missing Client-Token'
    );
  });

  it('rejects when header does not match', () => {
    vi.mocked(env).ZAPI_CLIENT_TOKEN = 'secret-from-panel';
    expect(() =>
      assertZApiWebhookAuthorized(mockRequest({ 'Client-Token': 'wrong' }))
    ).toThrow('Invalid or missing Client-Token');
  });
});
