import { Decimal } from '@prisma/client/runtime/library'
import prisma from '../config/database'
import { AppError } from '../utils/AppError'
import { CATEGORIAS_PADRAO } from '../utils/categorias'

export class EnvelopeService {
  // Busca ou cria os envelopes do mês atual
  async listarOuCriarEnvelopes(usuarioId: string) {
    const agora = new Date()
    const mes = agora.getMonth() + 1
    const ano = agora.getFullYear()

    // Verifica se já existem envelopes para esse mês
    const existentes = await prisma.envelope.findMany({
      where: { usuarioId, mes, ano },
      include: { transacoes: true },
    })

    // Se já existem retorna eles
    if (existentes.length > 0) {
      return existentes.map(this.formatarEnvelope)
    }

    // Busca o perfil para calcular orçamentos
    const perfil = await prisma.perfil.findUnique({ where: { usuarioId } })

    if (!perfil) throw new AppError('Perfil não encontrado. Complete o onboarding.', 404)

    // Saldo livre = renda - gastos fixos
    const saldoLivre = Number(perfil.renda) - Number(perfil.gastosFixos)

    // Cria os envelopes padrão com orçamentos sugeridos
    const envelopesParaCriar = CATEGORIAS_PADRAO.map((cat) => ({
      usuarioId,
      categoria: cat.key,
      emoji: cat.emoji,
      nome: cat.nome,
      cor: cat.cor,
      orcamento: new Decimal(Math.round(saldoLivre * cat.percentual)),
      mes,
      ano,
    }))

    await prisma.envelope.createMany({ data: envelopesParaCriar })

    const criados = await prisma.envelope.findMany({
      where: { usuarioId, mes, ano },
      include: { transacoes: true },
    })

    return criados.map(this.formatarEnvelope)
  }

  async atualizarOrcamento(usuarioId: string, envelopeId: string, orcamento: number) {
    const envelope = await prisma.envelope.findFirst({
      where: { id: envelopeId, usuarioId },
    })

    if (!envelope) throw new AppError('Envelope não encontrado', 404)

    const atualizado = await prisma.envelope.update({
      where: { id: envelopeId },
      data: { orcamento: new Decimal(orcamento) },
      include: { transacoes: true },
    })

    return this.formatarEnvelope(atualizado)
  }

  async roubarEnvelope(
    usuarioId: string,
    envelopeOrigemId: string,
    envelopeDestinoId: string,
    valor: number
  ) {
    // Verifica se ambos os envelopes pertencem ao usuário
    const [origem, destino] = await Promise.all([
      prisma.envelope.findFirst({ where: { id: envelopeOrigemId, usuarioId } }),
      prisma.envelope.findFirst({ where: { id: envelopeDestinoId, usuarioId } }),
    ])

    if (!origem || !destino) throw new AppError('Envelope não encontrado', 404)

    const valorDecimal = new Decimal(valor)

    // Verifica se a origem tem orçamento suficiente para "roubar"
    const saldoOrigem = Number(origem.orcamento) - Number(origem.gasto)
    if (saldoOrigem < valor) {
      throw new AppError('Saldo insuficiente no envelope de origem', 422)
    }

    // Transfere o orçamento entre envelopes atomicamente
    await prisma.$transaction([
      prisma.envelope.update({
        where: { id: envelopeOrigemId },
        data: { orcamento: { decrement: valorDecimal } },
      }),
      prisma.envelope.update({
        where: { id: envelopeDestinoId },
        data: { orcamento: { increment: valorDecimal } },
      }),
    ])

    return { mensagem: `R$ ${valor} transferido com sucesso` }
  }

  // Formata o envelope adicionando campos calculados
  private formatarEnvelope(envelope: any) {
    const orcamento = Number(envelope.orcamento)
    const gasto = Number(envelope.gasto)
    const saldo = orcamento - gasto
    const porcentagem = orcamento > 0 ? Math.round((gasto / orcamento) * 100) : 0

    return {
      ...envelope,
      orcamento,
      gasto,
      saldo,
      porcentagem,
      estourado: gasto > orcamento,
    }
  }
}