// Configuracion principal de la aplicacion Express
// Inicializa middleware CORS y manejo de JSON
// Define las rutas principales del servidor

import express from 'express';
import cors from 'cors';
import authRoutes from './src/modules/auth/routes/auth.routes';

// Crear instancia de Express
const app = express();

// Middleware para permitir solicitudes desde otros origenes
app.use(cors());

// Middleware para parsear JSON en el cuerpo de las solicitudes
app.use(express.json());

// Registrar rutas de autenticacion bajo /api/auth
app.use('/api/auth', authRoutes);

export default app;