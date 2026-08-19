// Rutas de la aplicacion
// Define las rutas disponibles y sus componentes asociados

import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'bienvenidos', component: DashboardComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];