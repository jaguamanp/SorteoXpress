import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailSorteoPageRoutingModule } from './detail-sorteo-routing.module';

import { DetailSorteoPage } from './detail-sorteo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailSorteoPageRoutingModule
  ],
  declarations: [DetailSorteoPage]
})
export class DetailSorteoPageModule {}
