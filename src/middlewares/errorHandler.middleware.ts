import { Request, Response, NextFunction } from 'express'
import { AppError } from '../utils/AppError'
import { ZodError } from 'zod'

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  // Erros de validação do Zod
  if (err instanceof ZodError) {
    res.status(400).json({
      status: 'erro',
      message: 'Dados inválidos',
      errors: err.errors.map((e) => ({ campo: e.path.join('.'), mensagem: e.message })),
    })
    return
  }

  // Erros operacionais conhecidos
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ status: 'erro', message: err.message })
    return
  }

  // Erros inesperados
  console.error('Erro inesperado:', err)
  res.status(500).json({ status: 'erro', message: 'Erro interno do servidor' })
}