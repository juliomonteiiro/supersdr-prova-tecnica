import { Request, Response } from 'express';
import { WebhookService } from './webhook.service';

type Params = {
    provider: string;
};

export class WebhookController {
    private service = new WebhookService();

    /**
     * @swagger
     * /webhook/{provider}:
     *   post:
     *     summary: Recebe webhook de um provedor
     *     parameters:
     *       - in: path
     *         name: provider
     *         required: true
     *         schema:
     *           type: string
     *         description: Nome do provedor (zapi, meta, etc)
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *     responses:
     *       200:
     *         description: Webhook processado
     */
    async receive(req: Request<Params>, res: Response) {
        try {
            const result = await this.service.handle(
                req.params.provider,
                req.body
            );

            return res.json(result);
        } catch (error: any) {
            return res.status(400).json({
                error: error.message
            });
        }
    }
}