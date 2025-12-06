import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TreeVisualizationComponent } from './tree-visualization/tree-visualization.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'tree-visualization', component: TreeVisualizationComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
