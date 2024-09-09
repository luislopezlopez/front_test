import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearAsambleaPageRoutingModule } from './crear-asamblea-routing.module';

import { CrearAsambleaPage } from './crear-asamblea.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearAsambleaPageRoutingModule
  ],
  declarations: [CrearAsambleaPage]
})
export class CrearAsambleaPageModule {}
