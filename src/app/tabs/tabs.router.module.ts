import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'favs',
        children: [
          {
            path: '',
            loadChildren: '../favs/favs.module#FavsPageModule'
          }
        ]
      },
      {
        path: 'search',
        children: [
          {
            path: '',
            loadChildren: '../search/search.module#SearchPageModule'
          }
        ]
      },
      {
        path: 'tickets',
        children: [
          {
            path: '',
            loadChildren: '../tickets/tickets.module#TicketsPageModule'
          }
        ]
      },
      {
        path: 'ticket',
        children: [
          {
            path: '',
            loadChildren: '../ticket/ticket.module#TicketPageModule'
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/ticket',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/favs',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
