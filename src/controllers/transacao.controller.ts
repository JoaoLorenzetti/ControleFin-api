import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { TransacaoService } from '../services/transacao.service'

const transacaoService = new TransacaoService()

const schemaTransacao = z.object({
  valor: z.number().positive('Valor deve ser positivo'),
  descricao: z.string().max(255).optional(),
  envelopeId: z.string().uuid('ID do envelope inválido'),
})

export class TransacaoController {
  async lancar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const usuarioId = req.user!.userId
      const dados = schemaTransacao.parse(req.body)
      const resultado = await transacaoService.lancarGasto(usuarioId, dados)
      res.status(201).json({ status: 'sucesso', dados: resultado })
    } catch (erro) { next(erro) }
  }

  async listar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const usuarioId = req.user!.userId
      const envelopeId = req.query.envelopeId as string | undefined
      const resultado = await transacaoService.listarTransacoes(usuarioId, envelopeId)
      res.status(200).json({ status: 'sucesso', dados: resultado })
    } catch (erro) { next(erro) }
  }

  async deletar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const usuarioId = req.user!.userId
      const { id } = req.params
      await transacaoService.deletarTransacao(usuarioId, id)
      res.status(204).send()
    } catch (erro) { next(erro) }
  }
}