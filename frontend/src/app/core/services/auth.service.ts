// Servicio de Autenticacion
// Maneja la logica de login, logout y validacion de sesion
// Se comunica con el backend a traves de HttpClient

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
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
  private expirationTimer: ReturnType<typeof setTimeout> | undefined;
  private expirationHandled = false;

  constructor(private http: HttpClient, private router: Router) {
    this.cargarUsuarioDelLocal();
  }

  // Carga el usuario guardado en localStorage si existe
  private cargarUsuarioDelLocal(): void {
    const token = localStorage.getItem('token');
    const usuarioGuardado = localStorage.getItem('usuario');
    if (token && usuarioGuardado) {
      this.usuarioActual.next(JSON.parse(usuarioGuardado));
    }
    if (token) {
      this.programarExpiracion(token);
    }
  }

  // Realiza el login enviando credenciales al backend
  // Guarda el token y usuario en localStorage si es exitoso
  login(login: string, password: string): Observable<LoginResponse> {
    const request: LoginRequest = { login, password };
    return new Observable(observer => {
      this.http.post<LoginResponse>(`${this.apiUrl}/login`, request).subscribe({
        next: (response) => {
          localStorage.setItem('token', response.token);
          this.expirationHandled = false;
          this.programarExpiracion(response.token);
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
    const token = this.getToken();
    return !!token && this.obtenerExpiracion(token) > Date.now();
  }

  // Limpia la sesion: elimina token y usuario
  logout(): void {
    if (this.expirationTimer) {
      clearTimeout(this.expirationTimer);
    }
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.usuarioActual.next(null);
  }

  private programarExpiracion(token: string): void {
    const expiration = this.obtenerExpiracion(token);
    const delay = expiration - Date.now();

    if (delay <= 0) {
      this.manejarExpiracion();
      return;
    }

    this.expirationTimer = setTimeout(() => this.manejarExpiracion(), delay);
  }

  private obtenerExpiracion(token: string): number {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return Number(payload.exp) * 1000;
    } catch {
      return 0;
    }
  }

  private manejarExpiracion(): void {
    if (this.expirationHandled) {
      return;
    }

    this.expirationHandled = true;
    this.logout();
    window.alert('El token expiro. Inicia sesion nuevamente.');
    this.router.navigate(['/']);
  }
}
