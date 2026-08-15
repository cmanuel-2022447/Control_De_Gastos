import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
    // Metodo login: valida credenciales y genera token JWT
    // Entrada: email y password del usuario
    // Salida: token JWT y rol del usuario
    static async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            
            // Delegar validacion de credenciales al servicio
            const result = await AuthService.login(email, password);

            if (!result) {
                return res.status(401).json({ message: "Correo o contraseña incorrectos" });
            }

            return res.status(200).json({
                message: "Inicio de sesión exitoso",
                token: result.token,
                rol: result.rol
            });
        } catch (error) {
            return res.status(500).json({ message: "Error interno en el servidor", error });
        }
    }
}