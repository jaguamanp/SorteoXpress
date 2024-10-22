import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SorteoGeneradorPageRoutingModule } from './sorteo-generador-routing.module';

import { SorteoGeneradorPage } from './sorteo-generador.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SorteoGeneradorPageRoutingModule
  ],
  declarations: [SorteoGeneradorPage]
})
export class SorteoGeneradorPageModule {}
