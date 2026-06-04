import { PrismaClient } from '@prisma/client'

// Instância única do Prisma Client (singleton)
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
})

export default prisma