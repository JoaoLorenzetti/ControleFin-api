import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { AppError } from '../utils/AppError'

export interface JwtPayload {
  userId: string
  email: string
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Token de autenticação é obrigatório', 401)
    }

    const token = authHeader.split(' ')[1]
    const secret = process.env.JWT_SECRET

    if (!secret) throw new AppError('Erro de configuração do servidor', 500, false)

    const decoded = jwt.verify(token, secret) as JwtPayload
    req.user = decoded
    next()
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError('Token inválido ou expirado', 401))
    } else {
      next(error)
    }
  }
}