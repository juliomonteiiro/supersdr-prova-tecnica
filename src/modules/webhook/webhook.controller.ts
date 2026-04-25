import { Request, Response } from 'express';
import { AppError } from '../../shared/errors';
import { WebhookService } from './webhook.service';
import { logger } from '../../infra/logger/logger';

type Params = {
    provider: string;
};

export class WebhookController {
    private service = new WebhookService();

    /**
     * @swagger
     * /webhook/{provider}:
     *   post:
     *     summary: Receive webhook from a provider
     *     parameters:
     *       - in: path
     *         name: provider
     *         required: true
     *         schema:
     *           type: string
     *         description: Provider name (zapi, meta, etc)
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *     responses:
     *       200:
     *         description: Webhook processed
     */
    async receive(req: Request<Params>, res: Response) {
        try {
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