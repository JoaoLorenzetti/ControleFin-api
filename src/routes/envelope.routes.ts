import { Router } from 'express'
import { EnvelopeController } from '../controllers/envelope.controller'
import { authenticate } from '../middlewares/auth.middleware'

const router = Router()
const envelopeController = new EnvelopeController()

router.use(authenticate)

/**
 * @swagger
 * /envelopes:
 *   get:
 *     summary: Listar envelopes do mês atual
 *     tags: [Envelopes]
 *     responses:
 *       200:
 *         description: Lista de envelopes com saldo e porcentagem
 */
router.get('/', (req, res, next) => envelopeController.listar(req, res, next))

/**
 * @swagger
 * /envelopes/{id}/orcamento:
 *   patch:
 *     summary: Atualizar orçamento de um envelope
 *     tags: [Envelopes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orcamento:
 *                 type: number
 *                 example: 500
 *     responses:
 *       200:
 *         description: Orçamento atualizado
 */
router.patch('/:id/orcamento', (req, res, next) => envelopeController.atualizarOrcamento(req, res, next))

/**
 * @swagger
 * /envelopes/roubar:
 *   post:
 *     summary: Transferir orçamento entre envelopes (Roubo Consciente)
 *     tags: [Envelopes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               envelopeOrigemId:
 *                 type: string
 *               envelopeDestinoId:
 *                 type: string
 *               valor:
 *                 type: number
 *     responses:
 *       200:
 *         description: Transferência realizada
 */
router.post('/roubar', (req, res, next) => envelopeController.roubar(req, res, next))

export default router