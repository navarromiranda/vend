import { Component, OnInit } from '@angular/core';
import { TicketsService } from '../services/tickets.service';
import { Prod } from '../services/prod';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.page.html',
  styleUrls: ['./ticket.page.scss'],
})
export class TicketPage implements OnInit {

  constructor(public Tickets: TicketsService) { }

  minusOne(prod: Prod): void {
    this.Tickets.minusOneProdToTicket(prod);
  }

  plusOne(prod: Prod): void {
    this.Tickets.addProdToTicket(prod);
  }

  ngOnInit() { }

}
