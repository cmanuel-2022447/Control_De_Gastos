import bcryptjs from 'bcryptjs';
import { pool } from '../../../config/db';
import { generateToken } from '../../../util/jwt';

export class AuthService {
    static async login(loginValue: string, password: string): Promise<{ token: string; rol: string }> {
        const result = await pool.query(
            'SELECT id, usuario, email, password_hash, rol FROM usuarios WHERE email = $1 OR usuario = $1 LIMIT 1',
            [loginValue]
        );
        const user = result.rows[0];

        if (!user || !(await bcryptjs.compare(password, user.password_hash))) {
            throw new Error('INVALID_CREDENTIALS');
        }

        return {
            token: generateToken({ id: user.id, email: user.email, rol: user.rol }),
            rol: user.rol
        };
    }
}