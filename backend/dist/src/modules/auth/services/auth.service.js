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
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = require("../../../config/db");
const jwt_1 = require("../../../util/jwt");
class AuthService {
    static login(loginValue, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.pool.query('SELECT id, usuario, email, password_hash, rol FROM usuarios WHERE email = $1 OR usuario = $1 LIMIT 1', [loginValue]);
            const user = result.rows[0];
            if (!user || !(yield bcryptjs_1.default.compare(password, user.password_hash))) {
                throw new Error('INVALID_CREDENTIALS');
            }
            return {
                token: (0, jwt_1.generateToken)({ id: user.id, email: user.email, rol: user.rol }),
                rol: user.rol
            };
        });
    }
}
exports.AuthService = AuthService;
