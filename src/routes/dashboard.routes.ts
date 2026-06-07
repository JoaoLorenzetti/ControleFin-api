import { Router } from 'express'
import { DashboardController } from '../controllers/dashboard.controller'
import { authenticate } from '../middlewares/auth.middleware'

const router = Router()
const dashboardController = new DashboardController()

router.use(authenticate)

/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: Resumo financeiro do mês
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Saldo livre, orçamento diário, meta e envelopes estourados
 */
router.get('/', (req, res, next) => dashboardController.resumo(req, res, next))

export default router