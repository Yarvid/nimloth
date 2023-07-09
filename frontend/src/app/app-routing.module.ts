import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TreeVisualizationComponent } from './tree-visualization/tree-visualization.component';

const routes: Routes = [
  { path: '', redirectTo: '/tree-visualization', pathMatch: 'full'},
  { path: 'tree-visualization', component: TreeVisualizationComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
