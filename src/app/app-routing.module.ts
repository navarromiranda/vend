import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'venta-rapida', pathMatch: 'full' },
  { path: 'venta-rapida', loadChildren: () => import('./ticket/ticket.module').then( m => m.TicketPageModule)},
  { path: 'favoritos', loadChildren: () => import('./favs/favs.module').then( m => m.FavsPageModule)},
  { path: 'tickets', loadChildren: () => import('./tickets/tickets.module').then( m => m.TicketsPageModule)},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
