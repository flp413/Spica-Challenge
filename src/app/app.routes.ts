import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'settings', pathMatch: 'full' },
  { path: 'user-search', loadComponent: () => import('./features/user/user-search/user-search.component').then(m => m.UserSearchComponent) },
  { path: 'user-grid', loadComponent: () => import('./features/user/user-grid/user-grid.component').then(m => m.UserGridComponent) },
  { path: 'absence-grid', loadComponent: () => import('./features/absences/absence-grid/absence-grid.component').then(m => m.AbsenceGridComponent) },
  { path: 'settings', loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent) },
  { path: '**', redirectTo: 'settings' }
];