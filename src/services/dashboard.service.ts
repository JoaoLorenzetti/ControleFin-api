import prisma from '../config/database'
import { AppError } from '../utils/AppError'

export class DashboardService {
  async resumo(usuarioId: string) {
    const agora = new Date()
    const mes = agora.getMonth() + 1
    const ano = agora.getFullYear()

    const perfil = await prisma.perfil.findUnique({ where: { usuarioId } })
    if (!perfil) throw new AppError('Perfil não encontrado', 404)

    const envelopes = await prisma.envelope.findMany({
      where: { usuarioId, mes, ano },
    })

    // Cálculos gerais
    const totalOrcamento = envelopes.reduce((acc, e) => acc + Number(e.orcamento), 0)
    const totalGasto = envelopes.reduce((acc, e) => acc + Number(e.gasto), 0)
    const saldoLivre = totalOrcamento - totalGasto

    // Dias restantes no mês
    const diasNoMes = new Date(ano, mes, 0).getDate()
    const diaAtual = agora.getDate()
    const diasRestantes = diasNoMes - diaAtual + 1

    // Orçamento diário livre
    const orcamentoDiario = diasRestantes > 0
      ? Math.max(saldoLivre / diasRestantes, 0)
      : 0

    // Porcentagem do mês consumida
    const porcentagemMes = totalOrcamento > 0
      ? Math.round((totalGasto / totalOrcamento) * 100)
      : 0

    return {
      renda: Number(perfil.renda),
      gastosFixos: Number(perfil.gastosFixos),
      meta: perfil.meta,
      totalOrcamento,
      totalGasto,
      saldoLivre,
      orcamentoDiario: Math.round(orcamentoDiario * 100) / 100,
      porcentagemMes,
      diasRestantes,
      mes,
      ano,
      envelopesEstourados: envelopes.filter(e => Number(e.gasto) > Number(e.orcamento)).length,
    }
  }
}