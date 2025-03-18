import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'settings', pathMatch: 'full' },
  { path: 'users', loadComponent: () => import('./features/user/user-grid/user-grid.component').then(m => m.UserGridComponent) },
  { path: 'absence', loadComponent: () => import('./features/absences/absence-grid/absence-grid.component').then(m => m.AbsenceGridComponent) },
  { path: 'settings', loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent) },
  { path: '**', redirectTo: 'settings' }
];