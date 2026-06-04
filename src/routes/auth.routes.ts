import { Router } from 'express'
import { AuthController } from '../controllers/auth.controller'
import { authenticate } from '../middlewares/auth.middleware'

const router = Router()
const authController = new AuthController()

/**
 * @swagger
 * /auth/cadastrar:
 *   post:
 *     summary: Cadastrar novo usuário
 *     tags: [Autenticação]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nome, email, senha]
 *             properties:
 *               nome:
 *                 type: string
 *                 example: João Pedro
 *               email:
 *                 type: string
 *                 example: joao@exemplo.com
 *               senha:
 *                 type: string
 *                 example: minhasenha123
 *     responses:
 *       201:
 *         description: Usuário cadastrado com sucesso
 *       409:
 *         description: E-mail já está em uso
 */
router.post('/cadastrar', (req, res, next) => authController.cadastrar(req, res, next))

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Fazer login
 *     tags: [Autenticação]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, senha]
 *             properties:
 *               email:
 *                 type: string
 *                 example: joao@exemplo.com
 *               senha:
 *                 type: string
 *                 example: minhasenha123
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       401:
 *         description: Credenciais inválidas
 */
router.post('/login', (req, res, next) => authController.login(req, res, next))

/**
 * @swagger
 * /auth/perfil:
 *   post:
 *     summary: Salvar perfil financeiro do onboarding
 *     tags: [Autenticação]
 *     responses:
 *       200:
 *         description: Perfil salvo com sucesso
 */
router.post('/perfil', authenticate, (req, res, next) => authController.salvarPerfil(req, res, next))

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Buscar dados do usuário logado
 *     tags: [Autenticação]
 *     responses:
 *       200:
 *         description: Dados do usuário
 */
router.get('/me', authenticate, (req, res, next) => authController.meuPerfil(req, res, next))

export default router