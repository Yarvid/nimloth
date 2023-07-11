import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TreeVisualizationComponent } from './tree-visualization/tree-visualization.component';
import { NavbarComponent } from './navbar/navbar.component';
import { CreateModalComponent } from './create-modal/create-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    TreeVisualizationComponent,
    NavbarComponent,
    CreateModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
