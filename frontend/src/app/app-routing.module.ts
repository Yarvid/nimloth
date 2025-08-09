import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TreeVisualizationComponent } from './tree-visualization/tree-visualization.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'tree-visualization',
    component: TreeVisualizationComponent,
    canActivate: [AuthGuard], // Protect this route
  },
  { path: '', redirectTo: '/tree-visualization', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
