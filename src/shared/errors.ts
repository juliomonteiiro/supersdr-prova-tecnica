export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly code: string
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ProviderNotSupportedError extends AppError {
  constructor(provider: string) {
    super(`Provider "${provider}" is not supported`, 400, 'PROVIDER_NOT_SUPPORTED');
  }
}

export class PayloadValidationError extends AppError {
  constructor(provider: string, details?: string) {
    super(
      `Invalid payload for provider "${provider}"${details ? `: ${details}` : ''}`,
      400,
      'INVALID_PAYLOAD'
    );
  }
}
