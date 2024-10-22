import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'sorteo',
    pathMatch: 'full'
  },
  {
    path: 'sorteo',
    loadChildren: () => import('./sorteo/sorteo.module').then( m => m.SorteoPageModule)
  },
  {
    path: 'detail-sorteo/:id',
    loadChildren: () => import('./detail-sorteo/detail-sorteo.module').then( m => m.DetailSorteoPageModule)
  },
  {
    path: 'modal-register',
    loadChildren: () => import('./detail-sorteo/modal-register/modal-register.module').then( m => m.ModalRegisterPageModule)
  },
  {
    path: 'sorteo-generador/:id',
    loadChildren: () => import('./sorteo-generador/sorteo-generador.module').then( m => m.SorteoGeneradorPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
