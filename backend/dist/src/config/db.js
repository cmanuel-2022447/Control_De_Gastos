"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
exports.initializeDatabase = initializeDatabase;
const dotenv_1 = __importDefault(require("dotenv"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const pg_1 = require("pg");
dotenv_1.default.config();
exports.pool = new pg_1.Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});
function initializeDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        yield exports.pool.query(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id SERIAL PRIMARY KEY,
            usuario VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(150) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            rol VARCHAR(20) NOT NULL DEFAULT 'user',
            creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);
        yield exports.pool.query(`
        ALTER TABLE usuarios
            ADD COLUMN IF NOT EXISTS usuario VARCHAR(50)
    `);
        yield exports.pool.query(`
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
        yield exports.pool.query(`
        ALTER TABLE usuarios
            ADD COLUMN IF NOT EXISTS rol VARCHAR(20) NOT NULL DEFAULT 'user'
    `);
        yield exports.pool.query('CREATE UNIQUE INDEX IF NOT EXISTS usuarios_usuario_idx ON usuarios (usuario)');
        const adminPasswordHash = yield bcryptjs_1.default.hash(process.env.ADMIN_PASSWORD || 'Admin123', 10);
        const userPasswordHash = yield bcryptjs_1.default.hash(process.env.USER_PASSWORD || 'Usuario123', 10);
        yield exports.pool.query(`INSERT INTO usuarios (usuario, email, password_hash, rol)
         VALUES ($1, $2, $3, 'admin')
         ON CONFLICT (usuario) DO NOTHING`, [process.env.ADMIN_USERNAME || 'admin', process.env.ADMIN_EMAIL || 'admin@kinal.com', adminPasswordHash]);
        yield exports.pool.query(`INSERT INTO usuarios (usuario, email, password_hash, rol)
         VALUES ($1, $2, $3, 'user')
         ON CONFLICT (usuario) DO NOTHING`, [process.env.USER_USERNAME || 'usuario', process.env.USER_EMAIL || 'usuario@kinal.com', userPasswordHash]);
    });
}
