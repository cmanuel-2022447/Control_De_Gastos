// Define los endpoints para login de usuarios
// POST /api/auth/login - Autentica usuario con email y password

import { Router } from 'express';
import { AuthController } from '../controller/auth.controller';

const router = Router();

// Endpoint de login: recibe credenciales y retorna token JWT
router.post('/login', AuthController.login);

export default router;