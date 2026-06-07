import { Decimal } from '@prisma/client/runtime/library'
import prisma from '../config/database'
import { AppError } from '../utils/AppError'

interface DadosTransacao {
  valor: number
  descricao?: string
  envelopeId: string
}

export class TransacaoService {
  async lancarGasto(usuarioId: string, dados: DadosTransacao) {
    // Verifica se o envelope pertence ao usuário
    const envelope = await prisma.envelope.findFirst({
      where: { id: dados.envelopeId, usuarioId },
    })

    if (!envelope) throw new AppError('Envelope não encontrado', 404)

    const valorDecimal = new Decimal(dados.valor)

    // Registra a transação e atualiza o gasto do envelope atomicamente
    const transacao = await prisma.$transaction(async (tx) => {
      const novaTransacao = await tx.transacao.create({
        data: {
          valor: valorDecimal,
          descricao: dados.descricao,
          usuarioId,
          envelopeId: dados.envelopeId,
        },
      })

      await tx.envelope.update({
        where: { id: dados.envelopeId },
        data: { gasto: { increment: valorDecimal } },
      })

      return novaTransacao
    })

    // Verifica se estourou o envelope após o lançamento
    const envelopeAtualizado = await prisma.envelope.findUnique({
      where: { id: dados.envelopeId },
    })

    const estourado = Number(envelopeAtualizado!.gasto) > Number(envelopeAtualizado!.orcamento)

    return { transacao, estourado }
  }

  async listarTransacoes(usuarioId: string, envelopeId?: string) {
    const transacoes = await prisma.transacao.findMany({
      where: {
        usuarioId,
        ...(envelopeId && { envelopeId }),
      },
      include: {
        envelope: {
          select: { nome: true, emoji: true, cor: true },
        },
      },
      orderBy: { criadoEm: 'desc' },
      take: 50, // últimas 50 transações
    })

    return transacoes.map((t) => ({
      ...t,
      valor: Number(t.valor),
    }))
  }

  async deletarTransacao(usuarioId: string, transacaoId: string) {
    const transacao = await prisma.transacao.findFirst({
      where: { id: transacaoId, usuarioId },
    })

    if (!transacao) throw new AppError('Transação não encontrada', 404)

    // Remove a transação e estorna o valor no envelope atomicamente
    await prisma.$transaction([
      prisma.transacao.delete({ where: { id: transacaoId } }),
      prisma.envelope.update({
        where: { id: transacao.envelopeId },
        data: { gasto: { decrement: transacao.valor } },
      }),
    ])
  }
}