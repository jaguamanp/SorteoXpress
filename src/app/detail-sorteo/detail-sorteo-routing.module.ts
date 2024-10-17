import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailSorteoPage } from './detail-sorteo.page';

const routes: Routes = [
  {
    path: '',
    component: DetailSorteoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailSorteoPageRoutingModule {}
