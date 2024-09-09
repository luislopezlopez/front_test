import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrearAsambleaPage } from './crear-asamblea.page';

const routes: Routes = [
  {
    path: '',
    component: CrearAsambleaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrearAsambleaPageRoutingModule {}
