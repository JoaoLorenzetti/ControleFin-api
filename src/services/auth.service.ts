import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../config/database'
import { AppError } from '../utils/AppError'

interface DadosCadastro {
  nome: string
  email: string
  senha: string
}

interface DadosPerfil {
  renda: number
  ciclo: string
  gastosFixos: number
  meta: string
}

interface DadosLogin {
  email: string
  senha: string
}

export class AuthService {
  async cadastrar(dados: DadosCadastro) {
    const usuarioExistente = await prisma.user.findUnique({
      where: { email: dados.email },
    })

    if (usuarioExistente) {
      throw new AppError('E-mail já está em uso', 409)
    }

    const senhaCriptografada = await bcrypt.hash(dados.senha, 12)

    const usuario = await prisma.user.create({
      data: {
        nome: dados.nome,
        email: dados.email,
        senha: senhaCriptografada,
      },
    })

    const token = this.gerarToken(usuario.id, usuario.email)

    return {
      token,
      usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email },
    }
  }

  async salvarPerfil(usuarioId: string, dados: DadosPerfil) {
    // Cria ou atualiza o perfil financeiro do onboarding
    const perfil = await prisma.perfil.upsert({
      where: { usuarioId },
      update: {
        renda: dados.renda,
        ciclo: dados.ciclo,
        gastosFixos: dados.gastosFixos,
        meta: dados.meta,
      },
      create: {
        usuarioId,
        renda: dados.renda,
        ciclo: dados.ciclo,
        gastosFixos: dados.gastosFixos,
        meta: dados.meta,
      },
    })

    return perfil
  }

  async login(dados: DadosLogin) {
    const usuario = await prisma.user.findUnique({
      where: { email: dados.email },
      include: { perfil: true },
    })

    if (!usuario) {
      throw new AppError('Credenciais inválidas', 401)
    }

    const senhaCorreta = await bcrypt.compare(dados.senha, usuario.senha)

    if (!senhaCorreta) {
      throw new AppError('Credenciais inválidas', 401)
    }

    const token = this.gerarToken(usuario.id, usuario.email)

    return {
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        perfilCompleto: !!usuario.perfil,
      },
    }
  }

 async meuPerfil(usuarioId: string) {
  const usuario = await prisma.user.findUnique({
    where: { id: usuarioId },
    include: { perfil: true },
  })

  if (!usuario) throw new AppError('Usuário não encontrado', 404)

  // Remove a senha antes de retornar
  const { senha, ...usuarioSemSenha } = usuario

  return usuarioSemSenha
}
  private gerarToken(usuarioId: string, email: string): string {
    const secret = process.env.JWT_SECRET
    const expiresIn = process.env.JWT_EXPIRES_IN || '30d'

    if (!secret) throw new AppError('Erro de configuração do servidor', 500, false)

    return jwt.sign({ userId: usuarioId, email }, secret, { expiresIn } as jwt.SignOptions)
  }
}