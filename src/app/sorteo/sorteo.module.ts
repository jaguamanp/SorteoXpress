import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SorteoPageRoutingModule } from './sorteo-routing.module';

import { SorteoPage } from './sorteo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SorteoPageRoutingModule
  ],
  declarations: [SorteoPage]
})
export class SorteoPageModule {}
