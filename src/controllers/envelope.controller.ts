import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { EnvelopeService } from '../services/envelope.service'

const envelopeService = new EnvelopeService()

const schemaOrcamento = z.object({
  orcamento: z.number().positive('Orçamento deve ser positivo'),
})

const schemaRoubo = z.object({
  envelopeOrigemId: z.string().uuid(),
  envelopeDestinoId: z.string().uuid(),
  valor: z.number().positive(),
})

export class EnvelopeController {
  async listar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const usuarioId = req.user!.userId
      const resultado = await envelopeService.listarOuCriarEnvelopes(usuarioId)
      res.status(200).json({ status: 'sucesso', dados: resultado })
    } catch (erro) { next(erro) }
  }

  async atualizarOrcamento(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const usuarioId = req.user!.userId
      const { id } = req.params
      const { orcamento } = schemaOrcamento.parse(req.body)
      const resultado = await envelopeService.atualizarOrcamento(usuarioId, id, orcamento)
      res.status(200).json({ status: 'sucesso', dados: resultado })
    } catch (erro) { next(erro) }
  }

  async roubar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const usuarioId = req.user!.userId
      const { envelopeOrigemId, envelopeDestinoId, valor } = schemaRoubo.parse(req.body)
      const resultado = await envelopeService.roubarEnvelope(usuarioId, envelopeOrigemId, envelopeDestinoId, valor)
      res.status(200).json({ status: 'sucesso', dados: resultado })
    } catch (erro) { next(erro) }
  }
}