export class ZApiAdapter {
  parse(payload: any) {
    if (!payload?.messageId) {
      throw new Error('Invalid ZAPI payload');
    }

    return {
      id: payload.messageId,
      provider: 'zapi',
      from: payload.phone,
      content: payload.text?.message || ''
    };
  }
}