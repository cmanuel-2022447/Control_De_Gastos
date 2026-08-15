import { Router } from 'express';
import { AuthController } from '../controller/auth.controller';

const router = Router();

// Endpoint de login: recibe credenciales y retorna token JWT
router.post('/login', AuthController.login);

export default router;