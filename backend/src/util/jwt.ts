import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta_super_segura';
const TOKEN_EXPIRATION: SignOptions['expiresIn'] = process.env.JWT_EXPIRES_IN as SignOptions['expiresIn'] || '1m';

export interface AuthTokenPayload extends JwtPayload {
    id: number;
    email: string;
    rol: 'admin' | 'user';
}

export function generateToken(payload: Omit<AuthTokenPayload, 'iat' | 'exp'>): string {
    const options: SignOptions = { expiresIn: TOKEN_EXPIRATION };
    return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyToken(token: string): AuthTokenPayload {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (typeof decoded === 'string' || !decoded.id || !decoded.email || !decoded.rol) {
        throw new Error('Token invalido');
    }

    return decoded as AuthTokenPayload;
}