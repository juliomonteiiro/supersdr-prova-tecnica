import { Request, Response } from 'express';
import { AppError } from '../../shared/errors';
import { WebhookService } from './webhook.service';
import { logger } from '../../infra/logger/logger';
import { assertZApiWebhookAuthorized } from './zapi-webhook.guard';

type Params = {
    provider: string;
};

export class WebhookController {
    private service = new WebhookService();

    /** Documentação OpenAPI: `src/openapi/webhook.openapi.ts` e `/docs`. */
    async receive(req: Request<Params>, res: Response) {
        try {
            if (req.params.provider.trim().toLowerCase() === 'zapi') {
                assertZApiWebhookAuthorized(req);
            }

            const result = await this.service.handle(
                req.params.provider,
                req.body
            );

            return res.json(result);
        } catch (error: any) {
            logger.error({ err: error }, 'Failed to process webhook');

            if (error instanceof AppError) {
                return res.status(error.statusCode).json({
                    error: error.message,
                    code: error.code
                });
            }

            return res.status(500).json({
                error: 'Internal processing error',
                code: 'INTERNAL_ERROR'
            });
        }
    }
}