import { Component } from '@angular/core';
import { ITicketWithMeta } from '../models/ITicketWithMeta';
import { ITicketrow } from '../models/ITicketrow';
import { Prod } from '../models/prod';
import { TicketsService } from '../services/tickets.service';

@Component({
  selector: 'app-tickets',
  templateUrl: 'tickets.page.html',
  styleUrls: ['tickets.page.scss']
})
export class TicketsPage {
  tickets: Map<string, ITicketWithMeta> = new Map()

  constructor(public Tickets: TicketsService) {
    const deepMapString = localStorage.getItem('tickets') || '[]';

    const arr: Array<[string, { date: Date, pago: number, ticket: Array<[string, { prod: Prod, qty: number }]> }]> = JSON.parse(deepMapString);
    const m: Array<[string, ITicketWithMeta]> = arr.map(([k, v]) => [k, { ...v, ticket: new Map<string, ITicketrow>(v.ticket) }])
    this.tickets = new Map<string, ITicketWithMeta>(m);
  }

}
