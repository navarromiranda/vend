import { Component } from '@angular/core';
import { TicketsService } from '../services/tickets.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  constructor(public Tickets: TicketsService) { }
}
