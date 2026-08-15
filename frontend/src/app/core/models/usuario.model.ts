// Modelo de Usuario para la autenticacion
// Define la estructura de datos de los usuarios en la aplicacion

export interface Usuario {
  id: number;
  email: string;
  rol: 'admin' | 'user';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  rol: string;
}
