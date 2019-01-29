import { Injectable } from '@angular/core';
import { Prod, Clave } from './prod';

@Injectable({
  providedIn: 'root'
})
export class TicketsService {
  public newTicket = new Map<Prod, number>();

  constructor() { }

  addProdToTicket(prod: Prod): void {
    const curr = this.newTicket.get(prod) || 0;
    this.newTicket.set(prod, 1 + curr);
  }

  minusOneProdToTicket(prod: Prod): void {
    const curr = this.newTicket.get(prod) || 0;
    if (curr > 1) {
      this.newTicket.set(prod, -1 + curr);
    } else {
      this.deleteProdFromTicket(prod);
    }
  }

  deleteProdFromTicket(prod): void {
    this.newTicket.delete(prod);
  }

  getNewTicketQty(): number {
    let qty = 0;
    this.newTicket.forEach((q, prod) => {
      qty += q;
    });

    return qty;
  }

  getNewTicketTotal(): number {
    let total = 0;
    this.newTicket.forEach((qty, prod) => {
      total += (qty * prod.precio);
    });

    return total;
  }

}
