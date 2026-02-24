import { Routes } from '@angular/router';
import { GlobalizationSample } from './globalization.sample';
import { RtlSample } from './rtl.sample';

export const routes: Routes = [
  { path: '', redirectTo: '/globalization', pathMatch: 'full' },
  { path: 'globalization', component: GlobalizationSample },
  { path: 'rtl', component: RtlSample },
  { path: '**', redirectTo: '/globalization' }
];