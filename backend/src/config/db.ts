import dotenv from 'dotenv';
import bcryptjs from 'bcryptjs';
import { Pool } from 'pg';

dotenv.config();

export const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

export async function initializeDatabase(): Promise<void> {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id SERIAL PRIMARY KEY,
            usuario VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(150) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            rol VARCHAR(20) NOT NULL DEFAULT 'user',
            creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    await pool.query(`
        ALTER TABLE usuarios
            ADD COLUMN IF NOT EXISTS usuario VARCHAR(50)
    `);

    await pool.query(`
        DO $$
        BEGIN
            IF EXISTS (
                SELECT 1 FROM information_schema.columns
                WHERE table_name = 'usuarios' AND column_name = 'password'
            ) AND NOT EXISTS (
                SELECT 1 FROM information_schema.columns
                WHERE table_name = 'usuarios' AND column_name = 'password_hash'
            ) THEN
                ALTER TABLE usuarios RENAME COLUMN password TO password_hash;
            END IF;
        END $$
    `);

    await pool.query(`
        ALTER TABLE usuarios
            ADD COLUMN IF NOT EXISTS rol VARCHAR(20) NOT NULL DEFAULT 'user'
    `);
    await pool.query('CREATE UNIQUE INDEX IF NOT EXISTS usuarios_usuario_idx ON usuarios (usuario)');

    const adminPasswordHash = await bcryptjs.hash(process.env.ADMIN_PASSWORD || 'Admin123', 10);
    const userPasswordHash = await bcryptjs.hash(process.env.USER_PASSWORD || 'Usuario123', 10);

    await pool.query(
        `INSERT INTO usuarios (usuario, email, password_hash, rol)
         VALUES ($1, $2, $3, 'admin')
         ON CONFLICT (usuario) DO NOTHING`,
        [process.env.ADMIN_USERNAME || 'admin', process.env.ADMIN_EMAIL || 'admin@kinal.com', adminPasswordHash]
    );
    await pool.query(
        `INSERT INTO usuarios (usuario, email, password_hash, rol)
         VALUES ($1, $2, $3, 'user')
         ON CONFLICT (usuario) DO NOTHING`,
        [process.env.USER_USERNAME || 'usuario', process.env.USER_EMAIL || 'usuario@kinal.com', userPasswordHash]
    );
}