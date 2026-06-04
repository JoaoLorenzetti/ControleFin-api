import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { AuthService } from '../services/auth.service'

const authService = new AuthService()

const schemaCadastro = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
})

const schemaLogin = z.object({
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(1, 'Senha é obrigatória'),
})

const schemaPerfil = z.object({
  renda: z.number().positive('Renda deve ser positiva'),
  ciclo: z.enum(['mensal', 'quinzenal', 'semanal']),
  gastosFixos: z.number().min(0).default(0),
  meta: z.string().min(1, 'Meta é obrigatória'),
})

export class AuthController {
  async cadastrar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dados = schemaCadastro.parse(req.body)
      const resultado = await authService.cadastrar(dados)
      res.status(201).json({ status: 'sucesso', dados: resultado })
    } catch (erro) {
      next(erro)
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dados = schemaLogin.parse(req.body)
      const resultado = await authService.login(dados)
      res.status(200).json({ status: 'sucesso', dados: resultado })
    } catch (erro) {
      next(erro)
    }
  }

  async salvarPerfil(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const usuarioId = req.user!.userId
      const dados = schemaPerfil.parse(req.body)
      const resultado = await authService.salvarPerfil(usuarioId, dados)
      res.status(200).json({ status: 'sucesso', dados: resultado })
    } catch (erro) {
      next(erro)
    }
  }

  async meuPerfil(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const usuarioId = req.user!.userId
      const resultado = await authService.meuPerfil(usuarioId)
      res.status(200).json({ status: 'sucesso', dados: resultado })
    } catch (erro) {
      next(erro)
    }
  }
}