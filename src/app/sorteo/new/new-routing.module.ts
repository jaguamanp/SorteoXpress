import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewModalSorteoPage } from './new.page';

const routes: Routes = [
  {
    path: '',
    component: NewModalSorteoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewModalSorteoPageRoutingModule {}
