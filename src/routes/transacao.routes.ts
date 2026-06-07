import { Router } from 'express'
import { TransacaoController } from '../controllers/transacao.controller'
import { authenticate } from '../middlewares/auth.middleware'

const router = Router()
const transacaoController = new TransacaoController()

router.use(authenticate)

/**
 * @swagger
 * /transacoes:
 *   post:
 *     summary: Lançar um gasto
 *     tags: [Transações]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [valor, envelopeId]
 *             properties:
 *               valor:
 *                 type: number
 *                 example: 45.90
 *               descricao:
 *                 type: string
 *                 example: Almoço
 *               envelopeId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Gasto lançado com sucesso
 */
router.post('/', (req, res, next) => transacaoController.lancar(req, res, next))

/**
 * @swagger
 * /transacoes:
 *   get:
 *     summary: Listar transações
 *     tags: [Transações]
 *     parameters:
 *       - in: query
 *         name: envelopeId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de transações
 */
router.get('/', (req, res, next) => transacaoController.listar(req, res, next))

/**
 * @swagger
 * /transacoes/{id}:
 *   delete:
 *     summary: Deletar uma transação
 *     tags: [Transações]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Transação deletada
 */
router.delete('/:id', (req, res, next) => transacaoController.deletar(req, res, next))

export default router