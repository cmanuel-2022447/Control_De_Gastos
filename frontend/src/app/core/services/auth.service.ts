// Servicio de Autenticacion
// Maneja la logica de login, logout y validacion de sesion
// Se comunica con el backend a traves de HttpClient

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoginRequest, LoginResponse, Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // API base URL para comunicarse con el backend
  private apiUrl = 'http://localhost:3000/api/auth';
  
  // Observable que mantiene el estado del usuario autenticado
  private usuarioActual = new BehaviorSubject<Usuario | null>(null);
  public usuario$ = this.usuarioActual.asObservable();

  constructor(private http: HttpClient) {
    this.cargarUsuarioDelLocal();
  }

  // Carga el usuario guardado en localStorage si existe
  private cargarUsuarioDelLocal(): void {
    const token = localStorage.getItem('token');
    const usuarioGuardado = localStorage.getItem('usuario');
    if (token && usuarioGuardado) {
      this.usuarioActual.next(JSON.parse(usuarioGuardado));
    }
  }

  // Realiza el login enviando credenciales al backend
  // Guarda el token y usuario en localStorage si es exitoso
  login(email: string, password: string): Observable<LoginResponse> {
    const request: LoginRequest = { email, password };
    return new Observable(observer => {
      this.http.post<LoginResponse>(`${this.apiUrl}/login`, request).subscribe({
        next: (response) => {
          localStorage.setItem('token', response.token);
          // Aqui se guardaria el usuario cuando el backend lo retorne
          observer.next(response);
          observer.complete();
        },
        error: (error) => observer.error(error)
      });
    });
  }

  // Obtiene el token del localStorage
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Verifica si existe un token valido
  estaAutenticado(): boolean {
    return !!this.getToken();
  }

  // Limpia la sesion: elimina token y usuario
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.usuarioActual.next(null);
  }
}
