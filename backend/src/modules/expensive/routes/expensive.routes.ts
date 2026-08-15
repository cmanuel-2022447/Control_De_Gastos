import { Router } from 'express';
import { getExpenses, createExpense } from '../controller/expensive.controller';

const router = Router();

// Endpoint para obtener todos los gastos registrados
router.get('/', getExpenses);

// Endpoint para crear nuevo gasto
router.post('/', createExpense);

export default router;