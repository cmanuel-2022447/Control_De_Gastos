import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
// TODO: Conectar a PostgreSQL pool (ej. import { pool } from '../../../config/db');

const SECRET_KEY = 'tu_clave_secreta_super_segura';

// Usuarios de prueba con contraseñas hasheadas usando bcryptjs
// En producción, estos datos vendrían de la base de datos PostgreSQL
const USERS_DATABASE = [
    { id: 1, email: 'admin@kinal.com', passwordHash: '$2b$10$qvrUqapGl/2Cwl02oabIyuJOw9Z0uWuBjzw8nPz4VPr7qglls6m7u', rol: 'admin' },
    { id: 2, email: 'usuario@kinal.com', passwordHash: '$2b$10$AoOsZA4OoX1zGh4Mvpnuy.oOq19ZMt/iizlE8MH1u55n0/RprDqoK', rol: 'user' }
];

export class AuthService {
    // Hashea una contraseña usando bcryptjs con salt rounds de 10
    // Retorna el hash seguro para almacenar en base de datos
    static async hashPassword(password: string): Promise<string> {
        const saltRounds = 10;
        return await bcryptjs.hash(password, saltRounds);
    }

    // Compara una contraseña en texto plano con su hash
    // Retorna true si coinciden, false si no
    static async comparePassword(password: string, passwordHash: string): Promise<boolean> {
        return await bcryptjs.compare(password, passwordHash);
    }

    // Valida email y password contra credenciales registradas
    // Usa bcryptjs para comparar contraseñas de forma segura
    // Genera JWT con vencimiento de 1 hora
    // Retorna token y rol del usuario o null si fallan credenciales
    static async login(email: string, password: string) {
        try {
            // NOTA: En producción, reemplazar con consulta real a PostgreSQL
            // const query = 'SELECT * FROM usuarios WHERE email = $1';
            // const result = await pool.query(query, [email]);
            // const user = result.rows[0];

            // Buscar usuario en base de datos temporal
            const user = USERS_DATABASE.find(u => u.email === email);
            
            if (!user) {
                return null; // Usuario no existe
            }

            // Comparar contraseña usando bcryptjs de forma segura
            const isPasswordValid = await this.comparePassword(password, user.passwordHash);
            
            if (!isPasswordValid) {
                return null; // Contraseña incorrecta
            }

            // Generar JWT con datos del usuario
            const userPayload = { id: user.id, email: user.email, rol: user.rol };
            const token = jwt.sign(userPayload, SECRET_KEY, { expiresIn: '1h' });

            return { token, rol: user.rol };
        } catch (error) {
            throw new Error("Error al autenticar con la base de datos");
        }
    }
}