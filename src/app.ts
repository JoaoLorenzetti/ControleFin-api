import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'
import { errorHandler } from './middlewares/errorHandler.middleware'
import authRoutes from './routes/auth.routes'
import envelopeRoutes from './routes/envelope.routes'
import transacaoRoutes from './routes/transacao.routes'
import dashboardRoutes from './routes/dashboard.routes'


const app = express()

app.use(cors())
app.use(express.json())

// Swagger
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: { title: 'ControleFin API', version: '1.0.0', description: 'API do app de controle financeiro pessoal' },
    servers: [{ url: 'http://localhost:3333/api/v1', description: 'Desenvolvimento' }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.ts'],
})

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// Rota de saúde
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Rotas — serão adicionadas nos próximos commits
app.use('/api/v1/auth', authRoutes)
// app.use('/api/v1/perfil', perfilRoutes)
app.use('/api/v1/envelopes', envelopeRoutes)
app.use('/api/v1/transacoes', transacaoRoutes)
app.use('/api/v1/dashboard', dashboardRoutes)

// Handler de rota não encontrada
app.use((req, res) => {
  res.status(404).json({ status: 'erro', message: 'Rota não encontrada' })
})

app.use(errorHandler)

export default app