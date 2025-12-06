import { Routes } from '@angular/router';
import { TreeVisualizationComponent } from './tree-visualization/tree-visualization.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'tree-visualization', component: TreeVisualizationComponent },
];
