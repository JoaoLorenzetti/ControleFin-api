import { Request, Response, NextFunction } from 'express'
import { DashboardService } from '../services/dashboard.service'

const dashboardService = new DashboardService()

export class DashboardController {
  async resumo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const usuarioId = req.user!.userId
      const resultado = await dashboardService.resumo(usuarioId)
      res.status(200).json({ status: 'sucesso', dados: resultado })
    } catch (erro) { next(erro) }
  }
}